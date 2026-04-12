import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CircleFadingPlus, Trash2, Upload, Video } from "lucide-react"
import { useRef, useState } from "react"
import { Textarea } from "./ui/textarea"
import useIdeas from "@/hooks/use-ideas"
import type { Idea } from "@/types/idea"

export default function ModalFileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("stories")
  const { creatIdea } = useIdeas()

  const handleCreateIdea = async (idea: Idea) => {
    setIsLoading(true)
    await creatIdea(idea)
    setIsLoading(false)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    setUploadedFiles(newFiles)
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename))
  }

  return (
    <div>
      <div className="mt-2 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ideaName" className="mb-2">
              Nome da ideia
            </Label>
            <Input
              id="ideaName"
              type="text"
              placeholder="Qual o nome?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="ideaType" className="mb-2">
              Tipo da ideia
            </Label>
            <Select defaultValue="1" value={type} onValueChange={setType}>
              <SelectTrigger id="ideaType" className="w-full ps-2">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="reels">
                    <Video />
                    <span className="truncate">Reels</span>
                  </SelectItem>
                  <SelectItem value="stories">
                    <CircleFadingPlus />
                    <span className="truncate">Stories</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="ideaDescription" className="mb-2">
              Descrição da ideia.
            </Label>
            <Textarea
              placeholder="Descreva-o..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border p-8 text-center"
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="mb-2 rounded-full bg-muted p-3">
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-pretty text-foreground">
            Upload a project image
          </p>
          <p className="mt-1 text-sm text-pretty text-muted-foreground">
            or,{" "}
            <label
              htmlFor="fileUpload"
              className="cursor-pointer font-medium text-primary hover:text-primary/90"
              onClick={(e) => e.stopPropagation()}
            >
              click to browse
            </label>{" "}
            (4MB max)
          </p>
          <input
            type="file"
            multiple={false}
            id="fileUpload"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>
      </div>

      <div
        className={cn(
          "space-y-3 px-6 pb-5",
          uploadedFiles.length > 0 ? "mt-4" : ""
        )}
      >
        {uploadedFiles.map((file, index) => {
          const imageUrl = URL.createObjectURL(file)

          return (
            <div
              className="flex flex-col rounded-lg border border-border p-2"
              key={file.name + index}
              onLoad={() => {
                return () => URL.revokeObjectURL(imageUrl)
              }}
            >
              <div className="flex items-center gap-2">
                <div className="row-span-2 flex h-14 w-18 items-center justify-center self-start overflow-hidden rounded-sm bg-muted">
                  <img
                    src={imageUrl}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 pr-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="max-w-62.5 truncate text-sm text-foreground">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-extralight text-muted-foreground">
                          {Math.round(file.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="bg-transparent! hover:text-red-500"
                      onClick={() => removeFile(file.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-end gap-2 rounded-b-lg border-t border-border bg-muted px-6 py-3">
        <Button
          className="h-9 px-4 text-sm font-medium"
          onClick={() =>
            handleCreateIdea({
              name,
              description,
              type,
              file: uploadedFiles[0],
            })
          }
          disabled={isLoading}
        >
          {isLoading ? "Carregando..." : "Cadastrar"}
        </Button>
      </div>
    </div>
  )
}
