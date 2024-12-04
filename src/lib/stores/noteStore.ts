import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface QuickNote {
  id: string
  text: string
  createdAt: Date
}

interface NoteStore {
  notes: Note[]
  quickNotes: QuickNote[]
  addNote: (note: { title: string; content: string }) => void
  updateNote: (id: string, note: { title: string; content: string }) => void
  removeNote: (id: string) => void
  addQuickNote: (text: string) => void
  removeQuickNote: (id: string) => void
}

export const noteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      quickNotes: [],
      
      addNote: (note) => set((state) => ({
        notes: [...state.notes, {
          id: Math.random().toString(36).substr(2, 9),
          ...note,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      })),
      
      updateNote: (id, note) => set((state) => ({
        notes: state.notes.map(n => 
          n.id === id
            ? { ...n, ...note, updatedAt: new Date() }
            : n
        )
      })),
      
      removeNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
      
      addQuickNote: (text) => set((state) => ({
        quickNotes: [...state.quickNotes, {
          id: Math.random().toString(36).substr(2, 9),
          text,
          createdAt: new Date()
        }]
      })),
      
      removeQuickNote: (id) => set((state) => ({
        quickNotes: state.quickNotes.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'note-storage'
    }
  )
)