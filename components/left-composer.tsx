"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadSheet from "@/components/upload-sheet"
import GoogleSheetConnect from "@/components/google-sheet-connect"
import PromptPanel from "@/components/prompt-panel"

export default function LeftComposer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Data Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Sheet</TabsTrigger>
              <TabsTrigger value="google">Google Sheets</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="pt-4">
              <UploadSheet />
            </TabsContent>
            <TabsContent value="google" className="pt-4">
              <GoogleSheetConnect />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <PromptPanel />
    </motion.div>
  )
}
