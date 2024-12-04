import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plane, MapPin, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchAirports, getAirportByCode, type Airport } from "@/lib/services/airportService"
import { Badge } from "@/components/ui/badge"

interface AirportSelectorProps {
  value: string
  onChange: (code: string, airport: { municipality: string; country: string }) => void
  error?: string
  direction?: 'departure' | 'arrival'
}

export function AirportSelector({ 
  value, 
  onChange, 
  error,
  direction = 'departure' 
}: AirportSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null)

  // Load initial airport if value is provided
  useEffect(() => {
    if (value) {
      getAirportByCode(value).then(airport => {
        if (airport) {
          setSelectedAirport(airport)
        }
      })
    }
  }, [value])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery) {
        setIsLoading(true)
        const results = await searchAirports(searchQuery)
        setAirports(results)
        setIsLoading(false)
      } else {
        setAirports([])
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            error ? "border-red-500" : ""
          )}
        >
          <div className="flex items-center">
            <Plane className={cn(
              "mr-2 h-4 w-4",
              direction === 'arrival' && "rotate-90"
            )} />
            {selectedAirport ? (
              <div className="flex flex-col items-start">
                <span>{selectedAirport.iataCode} - {selectedAirport.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedAirport.municipality}, {selectedAirport.country}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Select {direction === 'departure' ? 'departure' : 'arrival'} airport...
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search airports..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {isLoading ? "Searching..." : "No airports found."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {airports.map((airport) => (
              <CommandItem
                key={airport.id}
                value={airport.iataCode}
                onSelect={() => {
                  setSelectedAirport(airport)
                  onChange(airport.iataCode, {
                    municipality: airport.municipality,
                    country: airport.country
                  })
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === airport.iataCode ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {airport.iataCode} - {airport.name}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {airport.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {airport.municipality}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {airport.country}
                    </span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}