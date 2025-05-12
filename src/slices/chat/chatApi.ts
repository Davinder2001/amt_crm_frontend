import chatCreateSlice from "./chatCreateSlice";

const chatApi = chatCreateSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 1. Fetch all conversations
        fetchChatList: builder.query<ChatListResponse, void>({
            query: () => "chats",
            providesTags: ["Chat"],
        }),

        // 2. Fetch messages with a specific user
        fetchMessages: builder.query<{ status: string; thread_id: number; messages: ChatMessage[] }, number>({
            query: (id) => `chats/with-user/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Chat", id }],
        }),

        // 3. Send message to an existing conversation
        sendMessage: builder.mutation<SendMessageResponse, { recipient_id: number; message: string }>({
            query: ({ recipient_id, message }) => ({
                url: `chats/${recipient_id}/message`,
                method: "POST",
                body: { recipient_id, message },
            }),
        }),

        // 4. Fetch all chat users
        fetchChatUsers: builder.query<ChatUser[], void>({
            query: () => "chats/users",
            providesTags: ["Chat"],
        }),

        // 4. delete single message
        deleteSingleMessage: builder.mutation<{ success: boolean }, number | string>({
            query: (messageId) => ({
                url: `chats/message/${messageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Chat"],
        }),

        // 4. delete all messages in chat
        deleteAllMessages: builder.mutation<{ success: boolean }, number | string>({
            query: (id) => ({
                url: `chats/with-user/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Chat"],
        }),

    }),
});

export const {
    useFetchChatListQuery,
    useFetchMessagesQuery,
    useSendMessageMutation,
    useFetchChatUsersQuery,
    useDeleteSingleMessageMutation,
    useDeleteAllMessagesMutation,
} = chatApi;

export default chatApi;
