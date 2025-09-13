import { prisma } from "@/lib/prisma"
import { Prisma } from "@/prisma/generated/client"

import { v4 as uuidv4 } from 'uuid';

export const createChart = async (data: Prisma.ChartCreateInput) => {
    console.log("🚀 ~ createChart ~ data:", data)
    // Generate a base slug from the title if provided, otherwise use 'chart'
    const baseSlug = (data.title || 'chart').toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .substring(0, 50);         // Limit length

    // Check if a chart with this slug already exists
    const existingChart = await prisma.chart.findFirst({
        where: {
            slug: {
                startsWith: baseSlug
            }
        },
        select: {
            slug: true
        },
        orderBy: {
            slug: 'desc'
        }
    });

    // If a chart with this base slug exists, append a UUID
    let slug = baseSlug;
    if (existingChart) {
        const uniqueId = uuidv4().split('-')[0]; // Use first part of UUID
        slug = `${baseSlug}-${uniqueId}`;
    }

    // Ensure title is set, default to 'Untitled Chart' if not provided
    const title = data.title || 'Untitled Chart';

    return await prisma.chart.create({
        data: {
            ...data,
            title,
            slug,
        }
    });
}

export const getChartFromMessage = async ({
    conversationId
}: {
    conversationId: string;
}) => {
    return await prisma.chart.findFirst({
        where: {
            conversationId,
        },
        orderBy:{
            updatedAt:"desc"
        },
    });
};