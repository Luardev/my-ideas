import { supabase } from "@/lib/supabase"
import { normalizeImagePath } from "@/lib/utils"
import type { Idea } from "@/types/idea"
import { toast } from "sonner"

const useIdeas = () => {
  const creatIdea = async ({
    name,
    description,
    file,
    type,
  }: Omit<Idea, "id">) => {
    try {
      const { data }: { data: Idea | null } = await supabase
        .from("ideas")
        .insert({ name, description, type })
        .select()
        .single()

      if (!data) throw new Error("Nenhuma ideia encontrada")

      if (file) {
        const path = `v1/${normalizeImagePath(file.name)}`

        await supabase.storage.from("ideas").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        })

        await supabase.from("images").insert({ url: path, "idea-id": data.id })
      }

      toast.success("Ideia Criada com sucesso")
    } catch (error) {
      toast.error("Erro ao criar idea.")
      console.error(error)
    }
  }

  const getAllIdeas = async () => {
    const { data } = await supabase.from("ideas").select()

    return data as Idea[]
  }

  const getIdeaImage = async (id: string) => {
    const { data } = await supabase
      .from("images")
      .select("url")
      .eq("idea-id", id)
      .single()

    if (!data?.url) return null

    const { data: image } = supabase.storage
      .from("ideas")
      .getPublicUrl(data.url)

    return image.publicUrl
  }

  return {
    creatIdea,
    getAllIdeas,
    getIdeaImage,
  }
}

export default useIdeas
