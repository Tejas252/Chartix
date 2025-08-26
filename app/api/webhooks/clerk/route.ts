import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers and body
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    const payload = await req.json();
    const body = JSON.stringify(payload);

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occurred -- no svix headers', {
        status: 400
      });
    }

    // Create a new Webhook instance with the webhook secret
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      // Verify the webhook payload
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred during webhook verification', {
        status: 400
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0].email_address;
      const name = first_name && last_name ? `${first_name} ${last_name}` : first_name || email.split('@')[0];

      try {
        // Start a transaction to ensure both user and team creation succeed or fail together
        await prisma.$transaction(async (tx) => {
          // Create user in database
          const user = await tx.user.create({
            data: {
              clerkId: id,
              email: email,
              name: name,
              imageUrl: image_url,
            },
          });

          // Create a default team for the user
          const team = await tx.team.create({
            data: {
              name: `${name}'s Team`,
              createdBy: {
                connect: { id: user.id },
              },
            },
          });

          // Add the user as an owner of the team
          await tx.teamMember.create({
            data: {
              teamId: team.id,
              userId: user.id,
              role: 'OWNER',
            },
          });
        });

        console.log(`User ${email} and their default team created successfully`);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error in webhook handler:', error);
        return NextResponse.json(
          { error: 'Error processing webhook' },
          { status: 500 }
        );
      }
    }

    return new Response('', { status: 200 });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
