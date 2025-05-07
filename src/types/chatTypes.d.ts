// src/types/chatTypes.d.ts
interface Participant {
    id: number;
    thread_id: number;
    user_id: number;
    last_read: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}


interface Conversation {
    id: number;
    subject: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    participants?: Participant[];
    pivot?: {
        user_id: number;
        thread_id: number;
        created_at: string;
        updated_at: string;
    };
}

interface Message {
    id: number;
    thread_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
    };
}


interface ChatListItem {
    user_id: number;
    user_name: string;
    last_message: string | null;
    last_message_time: string | null;
    is_read: boolean;
    unread_count: number;
}


interface ChatResponse<T> {
    status: 'success' | 'error' | 'validation_error';
    data: T;
    errors?: Record<string, string[]>;
}
