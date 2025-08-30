import { requireUser } from "@/lib/auth";
import buildAllGraphqlSchema from "@/server/apollo";
import { Context } from "@/types/context";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { GraphQLFormattedError } from "graphql";

const apolloServer = new ApolloServer({
    schema: buildAllGraphqlSchema(),
    formatError: (error: GraphQLFormattedError) => {
        console.log("🚀 ~ error:", error)
        const message = error.message
            .replace('SequelizeValidationError: ', '')
            .replace('Validation error: ', '')
            .replace('Context creation failed: ', '')
            .replace('Unexpected error value: ', '');
        return { ...error, message };
    },
    // formatResponse: (response: ApolloServerOptionsWithSchema<BaseContext>) => {
    //     return response;
    // },
    // plugins: [loggingPlugin()],
});

// Create the handler with database connection and context
const handler = startServerAndCreateNextHandler(apolloServer, {
    context: async (req: Request): Promise<Context> => {
        const me = await requireUser();
        // Allow unauthenticated access - let individual resolvers handle authorization
        if (!me) {
            throw new Error("Unauthorized");
        }

        const origin = req.headers.get('Origin') || "";
        return { me, origin };
    },
})

// export { handler as GET, handler as POST };
// ✅ Correctly export POST/GET handlers using valid signatures

export async function POST(req: Request) {
    return handler(req);
}

export async function GET(req: Request) {
    return handler(req);
}
