import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AgencySettings {
  agencyName: string
  country: string
  address: string
  email: string
  phone: string
  airports: {
    code: string
    name: string
    country: string
    isEU: boolean
  }[]
}

interface AgencySettingsStore {
  settings: AgencySettings
  updateSettings: (settings: Partial<AgencySettings>) => void
}

export const agencySettingsStore = create<AgencySettingsStore>()(
  persist(
    (set) => ({
      settings: {
        agencyName: "",
        country: "",
        address: "",
        email: "",
        phone: "",
        airports: []
      },
      
      updateSettings: (newSettings) => set((state) => ({
        settings: {
          ...state.settings,
          ...newSettings
        }
      }))
    }),
    {
      name: 'agency-settings-storage'
    }
  )
)