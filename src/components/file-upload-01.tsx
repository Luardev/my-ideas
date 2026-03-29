import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  CircleFadingPlus,
  HelpCircle,
  Trash2,
  Upload,
  Video,
} from "lucide-react"
import { useRef, useState } from "react"
import { Textarea } from "./ui/textarea"
import useIdeas from "@/hooks/use-ideas"

export default function FileUpload01() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("stories")
  const { creatIdea } = useIdeas()

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
    <div className="flex items-center justify-center p-10">
      <Card className="mx-auto w-full max-w-lg rounded-lg bg-background p-0 shadow-md">
        <CardContent className="p-0">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-balance text-foreground">
                  Crie uma nova ideia
                </h2>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">
                  Segure e arraste os arquivos para adiciona-los a ideia.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 px-6 pb-4">
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

          <div className="px-6">
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
                          <span className="max-w-[250px] truncate text-sm text-foreground">
                            {file.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <p className="text-muted-foreground">{file.type}</p>
                            {"|"}
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

          <div className="flex items-center justify-between rounded-b-lg border-t border-border bg-muted px-6 py-3">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="mr-1 h-4 w-4" />
                    Need help?
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-background py-3 text-foreground">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-pretty">
                      Need assistance?
                    </p>
                    <p className="dark:text-muted-background max-w-[200px] text-xs text-pretty text-muted-foreground">
                      Upload project images by dragging and dropping files or
                      using the file browser. Supported formats: JPG, PNG, SVG.
                      Maximum file size: 4MB.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-9 px-4 text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                className="h-9 px-4 text-sm font-medium"
                onClick={() =>
                  creatIdea({
                    name,
                    description,
                    type,
                    file: uploadedFiles[0],
                  })
                }
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
