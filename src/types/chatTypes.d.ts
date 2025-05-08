// User model
interface User {
    id: number;
    name: string;
    email: string;
    number: string;
    uid: string;
    profile_image: string | null;
    user_type: string;
    user_status: string;
    company_id: number | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

// Message inside chat list
interface LatestMessage {
    id: number;
    thread_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Participant inside chat list
interface Participant {
    id: number;
    thread_id: number;
    user_id: number;
    last_read: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: User;
}

// Each chat thread item
interface ChatThread {
    thread_id: number;
    current_user_id: number;
    user_is: 'sender' | 'receiver';
    latest_message: LatestMessage;
    other_participant: Participant;
}

// API response for chat list
interface ChatListResponse {
    latest_messages: ChatThread[];
}

// Thread info
interface Thread {
    id: number;
    subject: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

// Message for single thread
interface Message {
    thread_id: number;
    user_id: number;
    body: string;
    updated_at: string;
    created_at: string;
    id: number;
    thread: Thread;
}

// API response for sending a message
interface SendMessageResponse {
    status: string;
    data: {
        thread_id: number;
        message: Message;
    };
}

// Sender details inside user message thread
interface MessageSender {
    id: number;
    name: string;
    email: string;
}

// Message in user chat thread
interface ChatMessage {
    id: number;
    body: string;
    sender_id: number;
    sender: MessageSender;
    sent_by_me: boolean;
    read: boolean;
    created_at: string;
}

// API response for chat with a specific user
interface ChatWithUserResponse {
    status: string;
    thread_id: number;
    messages: ChatMessage[];
}
