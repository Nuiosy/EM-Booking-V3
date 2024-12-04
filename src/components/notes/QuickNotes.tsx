import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X } from "lucide-react"
import { noteStore } from "@/lib/stores/noteStore"

export function QuickNotes() {
  const [newNote, setNewNote] = useState("")
  const { quickNotes, addQuickNote, removeQuickNote } = noteStore()

  const handleAddNote = () => {
    if (newNote.trim()) {
      addQuickNote(newNote)
      setNewNote("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Add a quick note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddNote()
            }
          }}
        />
        <Button size="icon" onClick={handleAddNote}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[150px]">
        <div className="space-y-2">
          {quickNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <p className="text-sm">{note.text}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeQuickNote(note.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}