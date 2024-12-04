import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useChatStore } from "@/lib/stores/chatStore"
import { ChatMessage } from "./ChatMessage"

export function ChatPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    sendMessage,
    fetchConversations 
  } = useChatStore()

  const activeConversation = conversations.find(c => c.id === activeConversationId)
  
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return

    await sendMessage(activeConversationId, newMessage)
    setNewMessage("")
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully."
    })
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chats</h2>
        <p className="text-muted-foreground">
          Communicate with your team members
        </p>
      </div>

      <div className="flex-1 flex space-x-4">
        {/* Conversations List */}
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-15rem)]">
              <div className="space-y-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer hover:bg-muted/50 ${
                      activeConversationId === conv.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    {conv.participants.map((participant) => (
                      <div key={participant.id} className="relative">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.employeeId}`} />
                          <AvatarFallback>{participant.employeeId[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                    <div className="flex-1 min-w-0">
                      {conv.messages.length > 0 && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.messages[conv.messages.length - 1].content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1">
          {activeConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center space-x-4">
                  {activeConversation.participants.map((participant) => (
                    <Avatar key={participant.id}>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.employeeId}`} />
                      <AvatarFallback>{participant.employeeId[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100vh-20rem)]">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4 py-4">
                    {activeConversation.messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isCurrentUser={message.senderId === "currentUser"}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start chatting
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}