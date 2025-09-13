import { Role, Visibility } from "@/prisma/generated/client";
import { prisma } from "@/lib/prisma";

/**
 * Check if user can view a chart
 */
export async function canViewChart({
  chartId,
  userId,
  token, // optional: for LINK access
}: {
  chartId: string;
  userId?: string; // anonymous viewer may not have userId
  token?: string;
}): Promise<boolean> {
  const chart = await prisma.chart.findUnique({
    where: { id: chartId },
    include: {
      user: true,
      team: {
        include: { members: true },
      },
      shares: true,
    },
  });

  if (!chart) return false;

  // Public charts
  if (chart.visibility === Visibility.PUBLIC) return true;

  // Link-based sharing
  if (chart.visibility === Visibility.LINK && token) {
    const validLink = chart.shares.find(
      (s) => s.token === token && (!s.expiresAt || s.expiresAt > new Date())
    );
    if (validLink) return true;
  }

  // Owner
  if (chart.userId && chart.userId === userId) return true;

  // Team members
  if (chart.team) {
    const membership = chart.team.members.find((m) => m.userId === userId);
    if (membership) return true;
  }

  return false;
}

/**
 * Check if user can edit a chart
 */
export async function canEditChart({
  chartId,
  userId,
}: {
  chartId: string;
  userId: string;
}): Promise<boolean> {
  const chart = await prisma.chart.findUnique({
    where: { id: chartId },
    include: {
      user: true,
      team: {
        include: { members: true },
      },
    },
  });

  if (!chart) return false;

  // Owner
  if (chart.userId && chart.userId === userId) return true;

  // Team members with sufficient role
  if (chart.team) {
    const membership = chart.team.members.find((m) => m.userId === userId);
    if (membership) {
      return (
        membership.role === Role.OWNER ||
        membership.role === Role.ADMIN ||
        membership.role === Role.EDITOR
      );
    }
  }

  return false;
}
