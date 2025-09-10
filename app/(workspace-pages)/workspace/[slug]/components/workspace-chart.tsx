"use client"

import { WorkspaceChart as WorkspaceChartComponent } from "@/components/workspace/workspace-chart"
import { WorkspaceChartProvider } from "@/contexts/workspace-chart-context"

export function WorkspaceChart({ conversationData }: { conversationData: any }) {
  return (
    <WorkspaceChartProvider initialData={{
      messages: conversationData.messages,
      chartData: conversationData.chartData,
      conversationId: conversationData.id,
    }}>
      <WorkspaceChartComponent conversationData={conversationData} />
    </WorkspaceChartProvider>
  )
}