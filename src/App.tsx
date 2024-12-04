import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Stats } from '@/components/dashboard/Stats'
import { RecentBookings } from '@/components/dashboard/RecentBookings'
import { BookingsPage } from '@/components/bookings/BookingsPage'
import { CustomersPage } from '@/components/customers/CustomersPage'
import { LoginPage } from '@/components/auth/LoginPage'
import { ChatPage } from '@/components/chat/ChatPage'
import { NotesPage } from '@/components/notes/NotesPage'
import { AgencySettings } from '@/components/settings/AgencySettings'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSupabase } from '@/lib/hooks/useSupabase'
import { Loader2 } from 'lucide-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles'

import 'dayjs/locale/de'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a', // Tailwind slate-900
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          transition: 'all 150ms',
          '&:hover': {
            backgroundColor: 'hsl(var(--muted))',
          },
        },
      },
    },
  },
});

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const { isConnected } = useSupabase()

  useEffect(() => {
    const handleNavigateToBooking = (event: CustomEvent<{ bookingId: string }>) => {
      setCurrentPage('bookings')
      setSelectedBookingId(event.detail.bookingId)
    }

    window.addEventListener('navigateToBooking', handleNavigateToBooking as EventListener)

    return () => {
      window.removeEventListener('navigateToBooking', handleNavigateToBooking as EventListener)
    }
  }, [])

  if (authLoading || !isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back to your travel agency dashboard
              </p>
            </div>
            <Stats />
            <RecentBookings />
          </div>
        )
      case 'bookings':
        return <BookingsPage initialBookingId={selectedBookingId} />
      case 'customers':
        return <CustomersPage />
      case 'chats':
        return <ChatPage />
      case 'notes':
        return <NotesPage />
      case 'agency-settings':
        return <AgencySettings />
      default:
        return null
    }
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          <div className="flex h-screen bg-background">
            <Sidebar 
              onNavigate={(page) => {
                setCurrentPage(page)
                setSelectedBookingId(null)
              }}
              currentPage={currentPage}
            />
            <main className="flex-1 overflow-y-auto p-8">
              {renderPage()}
            </main>
          </div>
          <Toaster />
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}