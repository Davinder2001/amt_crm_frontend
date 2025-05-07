import chatCreateSlice from "./chatCreateSlice";

const chatApi = chatCreateSlice.injectEndpoints({
    endpoints: (builder) => ({
        // 1. Fetch all conversations
        fetchConversations: builder.query<ChatResponse<ChatListItem[]>, void>({
            query: () => "chats",
            providesTags: ["Chat"],
        }),

        // 2. Fetch messages of a specific conversation
        fetchMessages: builder.query<ChatResponse<Message[]>, number>({
            query: (id) => `conversations/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Chat", id }],
        }),

        // 3. Create new conversation
        createConversation: builder.mutation<
            ChatResponse<Conversation>,
            {
                subject: string;
                recipient_id: number;
                message: string;
            }
        >({
            query: (body) => ({
                url: "conversations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Chat"],
        }),

        // 4. Send message to existing conversation
        sendMessage: builder.mutation<
            ChatResponse<Message>,
            {
                thread_id: number;
                message: string;
            }
        >({
            query: ({ thread_id, message }) => ({
                url: `conversations/${thread_id}/message`,
                method: "POST",
                body: { message },
            }),
            invalidatesTags: (_result, _error, { thread_id }) => [
                { type: "Chat", id: thread_id },
            ],
        }),

        // 5. Get chat list with unread count, etc.
        fetchChatList: builder.query<ChatResponse<ChatListItem[]>, void>({
            query: () => "chat-list",
            providesTags: ["Chat"],
        }),
    }),
});

export const {
    useFetchConversationsQuery,
    useFetchMessagesQuery,
    useCreateConversationMutation,
    useSendMessageMutation,
    useFetchChatListQuery,
} = chatApi;

export default chatApi;
