import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"
import { ChatDialog } from "./ChatDialog"
import { useChatStore } from "@/lib/stores/chatStore"

interface Employee {
  id: string
  name: string
  avatar: string
  role: string
  isOnline: boolean
  lastSeen?: string
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Travel Agent",
    isOnline: true
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    role: "Senior Agent",
    isOnline: true
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    role: "Support Agent",
    isOnline: false,
    lastSeen: "10 minutes ago"
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    role: "Travel Consultant",
    isOnline: false,
    lastSeen: "2 hours ago"
  }
]

export function EmployeesList() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const { startNewConversation } = useChatStore()

  const handleStartChat = async (employee: Employee) => {
    await startNewConversation(employee.id)
    setSelectedEmployee(null)
  }

  return (
    <>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {mockEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.name[0]}</AvatarFallback>
                  </Avatar>
                  {employee.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.role}</div>
                  {!employee.isOnline && employee.lastSeen && (
                    <div className="text-xs text-muted-foreground">
                      Last seen: {employee.lastSeen}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStartChat(employee)}
                disabled={!employee.isOnline}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatDialog
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      />
    </>
  )
}