import { motion } from "framer-motion"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    id: string
    content: string
    createdAt: Date
    isRead: boolean
    senderId: string
    sender?: {
      name: string
      avatar: string
    }
  }
  isCurrentUser: boolean
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start space-x-2 mb-4",
        isCurrentUser && "flex-row-reverse space-x-reverse"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender?.avatar} />
        <AvatarFallback>{message.sender?.name[0]}</AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col space-y-1 max-w-[70%]",
        isCurrentUser && "items-end"
      )}>
        <motion.div
          layout
          className={cn(
            "rounded-lg px-4 py-2",
            isCurrentUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted"
          )}
        >
          <p className="text-sm">{message.content}</p>
        </motion.div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
          {isCurrentUser && message.isRead && (
            <span className="text-primary">Read</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}