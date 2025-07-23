"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { HomeTab } from "@/components/tabs/home-tab"
// import { AppsTab } from "@/components/tabs/apps-tab"
// import { FilesTab } from "@/components/tabs/files-tab"
import { ProjectsTab } from "@/components/tabs/projects-tab"
import { LearnTab } from "@/components/tabs/learn-tab"
import  {App}  from "@/components/App";

// export default function Home() {
//   return (
  
//     <main className="overflow-hidden">  
        
//          <App/>
  
//        </main>

//   );
// }

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="p-4 md:p-6">
      <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="grid w-full max-w-[600px] grid-cols-5 rounded-2xl p-1">
            <TabsTrigger value="home" className="rounded-xl data-[state=active]:rounded-xl">
              Home
            </TabsTrigger>
            <TabsTrigger value="apps" className="rounded-xl data-[state=active]:rounded-xl">
              Apps
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-xl data-[state=active]:rounded-xl">
              Files
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl data-[state=active]:rounded-xl">
              Projects
            </TabsTrigger>
            <TabsTrigger value="learn" className="rounded-xl data-[state=active]:rounded-xl">
              Learn
            </TabsTrigger>
          </TabsList>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="rounded-2xl bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
            <Button className="rounded-2xl">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="home" className="mt-0">
            {/* <HomeTab /> */}
          </TabsContent>
          <TabsContent value="apps" className="mt-0">
            {/* <AppsTab /> */}
          </TabsContent>
          <TabsContent value="files" className="mt-0">
            {/* <FilesTab /> */}
          </TabsContent>
          <TabsContent value="projects" className="mt-0">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="learn" className="mt-0">
            <LearnTab />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}