'use client';
import React, { useState, useEffect } from 'react';
import { useFetchChatListQuery, useFetchChatUsersQuery } from '@/slices';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { toast } from 'react-toastify';
import { useMediaQuery } from 'react-responsive';

function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<ChatThread | null>(null);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showChatArea, setShowChatArea] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 768 });

    const {
        data: chatListData,
        error: chatListError,
        isLoading: isChatListLoading
    } = useFetchChatListQuery();

    const {
        data: chatUsers,
        error: chatUsersError,
        isLoading: isChatUsersLoading
    } = useFetchChatUsersQuery();

    const chatList: ChatThread[] = chatListData?.latest_messages || [];
    const chatUsersList: ChatUser[] = chatUsers || [];

    useEffect(() => {
        if (chatListError) {
            toast.error('Failed to load conversations');
        }
        if (chatUsersError) {
            toast.error('Failed to load users');
        }
    }, [chatListError, chatUsersError]);

    const handleUserSelect = (user: ChatThread) => {
        setSelectedUser(user);
        if (isMobile) {
            setShowChatArea(true);
        }
    };

    const handleBackToChatList = () => {
        setShowChatArea(false);
    };

    useEffect(() => {
        if (!isMobile) {
            setShowChatArea(false);
        }
    }, [isMobile]);

    return (
        <div className="chat-app">
            <div className="chat-sidebar">
                <ChatSidebar
                    chatList={chatList}
                    chatUsersList={chatUsersList}
                    selectedUser={selectedUser}
                    showAllUsers={showAllUsers}
                    searchQuery={searchQuery}
                    isChatListLoading={isChatListLoading}
                    isChatUsersLoading={isChatUsersLoading}
                    onUserSelect={handleUserSelect}
                    onToggleUsers={() => setShowAllUsers(prev => !prev)}
                    onSearchChange={setSearchQuery}
                    isMobile={isMobile}
                    showChatArea={showChatArea}
                />
            </div>

            <div className={`chat-main ${isMobile && !showChatArea ? 'mobile-hidden' : ''}`}>
                <ChatArea
                    selectedUser={selectedUser}
                    onStartNewChat={() => setShowAllUsers(true)}
                    onBackToChatList={handleBackToChatList}
                    isMobile={isMobile}
                />
            </div>
        </div>
    );
}

export default ChatPage;