import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import useIdeas from "@/hooks/use-ideas"
import FileUpload01 from "./components/file-upload-01"

export default function App() {
  // const { getAllIdeas } = useIdeas()

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <FileUpload01 />
    </div>
  )
}
