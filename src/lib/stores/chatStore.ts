import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: Date
  isRead: boolean
  readAt?: Date
  attachments: any[]
}

interface Conversation {
  id: string
  participants: {
    id: string
    employeeId: string
    lastReadAt: Date
  }[]
  messages: Message[]
  lastMessageAt: Date
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading: boolean
  error: string | null
  
  setActiveConversation: (id: string) => void
  sendMessage: (conversationId: string, content: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  fetchConversations: () => Promise<void>
  startNewConversation: (employeeId: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  error: null,

  setActiveConversation: (id) => {
    set({ activeConversationId: id })
    get().markAsRead(id)
  },

  sendMessage: async (conversationId, content) => {
    try {
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          content,
          sender_id: supabase.auth.user()?.id
        })
        .single()

      if (error) throw error

      // Update local state
      set((state) => ({
        conversations: state.conversations.map(conv => 
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessageAt: new Date()
              }
            : conv
        )
      }))

      // Subscribe to realtime updates
      const channel = supabase
        .channel(`chat:${conversationId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        }, (payload) => {
          // Handle realtime updates
          if (payload.new) {
            set((state) => ({
              conversations: state.conversations.map(conv =>
                conv.id === conversationId
                  ? {
                      ...conv,
                      messages: [...conv.messages, payload.new],
                      lastMessageAt: new Date(payload.new.created_at)
                    }
                  : conv
              )
            }))
          }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (error) {
      set({ error: error.message })
    }
  },

  markAsRead: async (conversationId) => {
    try {
      const { error } = await supabase
        .from('chat_participants')
        .update({
          last_read_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .eq('employee_id', supabase.auth.user()?.id)

      if (error) throw error
    } catch (error) {
      set({ error: error.message })
    }
  },

  fetchConversations: async () => {
    try {
      set({ isLoading: true })

      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          participants:chat_participants(
            id,
            employee_id,
            last_read_at
          ),
          messages:chat_messages(
            id,
            sender_id,
            content,
            created_at,
            is_read,
            read_at,
            attachments
          )
        `)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      set({ conversations, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  startNewConversation: async (employeeId) => {
    try {
      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({})
        .single()

      if (convError) throw convError

      // Add participants
      const { error: partError } = await supabase
        .from('chat_participants')
        .insert([
          {
            conversation_id: conversation.id,
            employee_id: supabase.auth.user()?.id
          },
          {
            conversation_id: conversation.id,
            employee_id: employeeId
          }
        ])

      if (partError) throw partError

      // Update local state
      set((state) => ({
        conversations: [...state.conversations, {
          ...conversation,
          participants: [],
          messages: []
        }],
        activeConversationId: conversation.id
      }))

      return conversation.id
    } catch (error) {
      set({ error: error.message })
    }
  }
}))

// Initialize realtime subscriptions
supabase
  .channel('chat_changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'chat_messages' 
  }, (payload) => {
    const store = useChatStore.getState()
    store.fetchConversations()
  })
  .subscribe()