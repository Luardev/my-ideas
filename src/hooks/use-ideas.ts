import { supabase } from "@/lib/supabase"
import type { Idea } from "@/types/idea"

const useIdeas = () => {
  const creatIdea = async ({ name, description, file, type }: Idea) => {
    try {
      const path = `v1/${file.name}`
      const { data } = await supabase
        .from("ideas")
        .insert({ name, description, type })
        .select()

      await supabase.storage.from("ideas").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

      const { data: ImageData } = await supabase
        .from("images")
        .insert({ url: path, "idea-id": data.id })
        .select()

      console.log("Idea criada com successo", ImageData)
    } catch (error) {
      alert("Erro")
      console.error(error)
    }
  }

  return {
    creatIdea,
  }
}

export default useIdeas
