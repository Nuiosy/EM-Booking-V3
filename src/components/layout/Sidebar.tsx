import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Home, 
  Plane, 
  CreditCard, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  MessageSquare,
  StickyNote,
  ChevronLeft,
  Building2
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onNavigate: (page: string) => void
  currentPage: string
}

export function Sidebar({ className, onNavigate, currentPage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const { signOut } = useAuth()

  return (
    <div className="relative flex">
      {/* Main Sidebar */}
      <div 
        className={cn(
          "relative flex flex-col border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h2 className="font-semibold">EM Booking</h2>}
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hover:bg-muted",
              collapsed && "ml-auto"
            )}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            <NavItem 
              icon={<Home className="h-4 w-4" />} 
              label="Dashboard" 
              collapsed={collapsed} 
              active={currentPage === "dashboard"}
              onClick={() => onNavigate("dashboard")}
            />
            <NavItem 
              icon={<Plane className="h-4 w-4" />} 
              label="Bookings" 
              collapsed={collapsed}
              active={currentPage === "bookings"}
              onClick={() => onNavigate("bookings")}
            />
            <NavItem 
              icon={<Users className="h-4 w-4" />} 
              label="Customers" 
              collapsed={collapsed}
              active={currentPage === "customers"}
              onClick={() => onNavigate("customers")}
            />
            <NavItem 
              icon={<CreditCard className="h-4 w-4" />} 
              label="Payments" 
              collapsed={collapsed}
              active={currentPage === "payments"}
              onClick={() => onNavigate("payments")}
            />
            <NavItem 
              icon={<MessageSquare className="h-4 w-4" />} 
              label="Chats" 
              collapsed={collapsed}
              active={currentPage === "chats"}
              onClick={() => onNavigate("chats")}
            />
            <NavItem 
              icon={<StickyNote className="h-4 w-4" />} 
              label="Notes" 
              collapsed={collapsed}
              active={currentPage === "notes"}
              onClick={() => onNavigate("notes")}
            />
            <NavItem 
              icon={<FileText className="h-4 w-4" />} 
              label="Reports" 
              collapsed={collapsed}
              active={currentPage === "reports"}
              onClick={() => onNavigate("reports")}
            />

            <NavItem 
              icon={<Settings className="h-4 w-4" />} 
              label="Settings" 
              collapsed={collapsed}
              active={currentPage === "settings"}
              onClick={() => onNavigate("settings")}
            />
            <NavItem 
              icon={<Building2 className="h-4 w-4" />} 
              label="Agency Settings" 
              collapsed={collapsed}
              active={currentPage === "agency-settings"}
              onClick={() => onNavigate("agency-settings")}
            />
          </div>
        </ScrollArea>

        <div className="p-2 border-t">
          <NavItem 
            icon={<LogOut className="h-4 w-4" />} 
            label="Logout" 
            collapsed={collapsed}
            onClick={signOut}
          />
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, collapsed, active, onClick }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start",
        collapsed ? "px-2" : "px-4",
        active && "bg-muted"
      )}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      <span className={cn(
        "flex items-center",
        !collapsed && "mr-2"
      )}>
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </Button>
  )
}