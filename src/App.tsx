import { useEffect, useMemo, useState } from "react"
import ModalFileUpload from "./components/modal-file-upload"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import {
  ChevronRight,
  CircleFadingPlus,
  Lightbulb,
  List,
  Plus,
  Search,
  Video,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/animate-ui/components/radix/dialog"
import useIdeas from "./hooks/use-ideas"
import type { Idea } from "./types/idea"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./components/ui/input-group"
import {
  SelectTrigger,
  Select,
  SelectLabel,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectGroup,
} from "./components/ui/select"

export default function App() {
  const { getAllIdeas } = useIdeas()
  const [search, setSearch] = useState("")
  const [searchType, setSearchType] = useState("both")
  const [ideas, setIdeas] = useState<Idea[]>()
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getAllIdeas().then((ideas) => setIdeas(ideas))
  }, [isModalOpen])

  const FilteredIdeas = useMemo(() => {
    return ideas?.filter((idea) => {
      const matchSearch =
        search === "" || idea.name.toLowerCase().includes(search.toLowerCase())

      const matchType = searchType === "both" || idea.type.includes(searchType)

      return matchSearch && matchType
    })
  }, [ideas, search, searchType])

  if (!FilteredIdeas)
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => !open && setIsModalOpen(false)}
    >
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Card className="h-[50vh] w-full max-w-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb /> Ideias
            </CardTitle>
            <CardDescription>
              Verifique todas as ideias ja criadas
            </CardDescription>
            <CardAction>
              <DialogTrigger onClick={() => setIsModalOpen(true)}>
                <Plus />
              </DialogTrigger>
            </CardAction>
            <InputGroup className="col-span-full my-1">
              <InputGroupInput
                placeholder="Qual o nome da idea?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                Total: {FilteredIdeas?.length}
              </InputGroupAddon>
            </InputGroup>
            <Select
              value={searchType}
              onValueChange={(val) => setSearchType(val)}
            >
              <SelectTrigger className="col-span-full w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="both">
                    <List />
                    Ambos
                  </SelectItem>
                  <SelectItem value="reels">
                    <Video />
                    Reels
                  </SelectItem>
                  <SelectItem value="stories">
                    <CircleFadingPlus />
                    Stories
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex h-80 flex-col space-y-2 overflow-y-auto">
            {FilteredIdeas?.map((idea, index) => (
              <div
                className="flex transform items-center justify-between rounded-md bg-secondary p-2 hover:scale-105 hover:bg-secondary/50"
                key={index}
                onClick={() => setSelectedIdea(idea)}
              >
                <div className="flex gap-2">
                  <div className="relative flex items-center rounded-full bg-primary p-2">
                    {idea.type === "reels" ? <Video /> : <CircleFadingPlus />}
                  </div>
                  <div className="max-w-60">
                    <span className="block truncate font-bold">
                      {idea.name}
                    </span>
                    <p className="truncate">{idea.description}</p>
                  </div>
                </div>
                <span>
                  <ChevronRight />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb /> Adicionar Idea
            </DialogTitle>
            <DialogDescription>
              Selecione o tipo da idea, nome, descrição e faça um upload do
              arquivo de imagem da idea
            </DialogDescription>
          </DialogHeader>
          <ModalFileUpload />
        </DialogContent>
      </div>
      {selectedIdea && (
        <VisualizerIdea
          idea={selectedIdea}
          isOpen={!!selectedIdea}
          onClose={() => setSelectedIdea(null)}
        />
      )}
    </Dialog>
  )
}

function VisualizerIdea({
  idea,
  isOpen,
  onClose,
}: {
  idea: Idea
  isOpen: boolean
  onClose: () => void
}) {
  const { getIdeaImage } = useIdeas()
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!idea?.id) return

    getIdeaImage(idea.id).then((publicUrl) => setPreview(publicUrl))
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-auto">
        <DialogHeader className="place-items-center">
          {preview && (
            <img src={preview} alt="Preview" className="h-40 w-40 rounded-md" />
          )}

          <DialogTitle>{idea.name}</DialogTitle>

          <DialogDescription>{idea.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
