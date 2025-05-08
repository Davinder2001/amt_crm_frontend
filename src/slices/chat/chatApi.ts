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
        sendMessage: builder.mutation<SendMessageResponse, { id: number; message: string }>({
            query: ({ id, message }) => ({
                url: `chats/${id}/message`,
                method: "POST",
                body: { message },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Chat", id },
            ],
        }),
    }),
});

export const {
    useFetchChatListQuery,
    useFetchMessagesQuery,
    useSendMessageMutation,
} = chatApi;

export default chatApi;
