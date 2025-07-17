'use client';
import React from 'react';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ChatSidebarProps {
    chatList: ChatThread[];
    chatUsersList: ChatUser[];
    selectedUser: ChatThread | null;
    showAllUsers: boolean;
    searchQuery: string;
    isChatListLoading: boolean;
    isChatUsersLoading: boolean;
    isMobile: boolean;
    showChatArea: boolean;
    onUserSelect: (user: ChatThread) => void;
    onToggleUsers: () => void;
    onSearchChange: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chatList,
    chatUsersList,
    selectedUser,
    showAllUsers,
    searchQuery,
    isChatListLoading,
    isChatUsersLoading,
    isMobile,
    showChatArea,
    onUserSelect,
    onToggleUsers,
    onSearchChange,
}) => {

    // const [deleteMessages] = useDeleteAllMessagesMutation();

    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    const filteredUsers = chatList.filter((user) => {
        const name = user.other_participant.user.name.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    const filteredAllUsers = chatUsersList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderChatListSkeleton = () => (
        <div className="chat-list-skeleton">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="chat-item-skeleton">
                    <Skeleton circle width={40} height={40} />
                    <div className="chat-info-skeleton">
                        <Skeleton width={120} height={15} />
                        <Skeleton width={80} height={12} />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="chat-sidebar-container">
            <div className="sidebar-header">
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button
                    className="toggle-users-btn"
                    onClick={onToggleUsers}
                    aria-label={showAllUsers ? 'Close user list' : 'Open user list'}
                >
                    {showAllUsers ? <FaTimes /> : <FaPlus />}
                </button>
            </div>

            <div className={`chat-list-container ${isMobile && showChatArea ? 'mobile-hidden' : ''}`}>
                {isChatListLoading ? (
                    renderChatListSkeleton()
                ) : showAllUsers ? (
                    <>
                        <div className="all-users-header">
                            <h4>All Users</h4>
                            <span className="badge">{chatUsersList.length}</span>
                        </div>
                        {isChatUsersLoading ? (
                            renderChatListSkeleton()
                        ) : filteredAllUsers.length > 0 ? (
                            filteredAllUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={`chat-item ${selectedUser?.other_participant.user.id === user.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        onToggleUsers();
                                        const existingThread = chatList.find(
                                            thread => thread.other_participant.user.id === user.id
                                        );
                                        if (existingThread) {
                                            onUserSelect(existingThread);
                                        } else {
                                            onUserSelect({
                                                thread_id: 0,
                                                current_user_id: 0,
                                                user_is: 'sender',
                                                latest_message: {
                                                    id: 0,
                                                    body: '',
                                                    created_at: new Date().toISOString(),
                                                    thread_id: 0,
                                                    user_id: 0,
                                                    updated_at: '',
                                                    deleted_at: null
                                                },
                                                other_participant: {
                                                    user: user as unknown as User,
                                                    id: 0,
                                                    thread_id: 0,
                                                    user_id: user.id,
                                                    last_read: null,
                                                    created_at: '',
                                                    updated_at: '',
                                                    deleted_at: null
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <div className="user-avatar">
                                        <div className="avatar">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div className={`status-indicator online`} />
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">
                                            {user.name}
                                        </div>
                                        <div className="user-role">{user.role}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No users found</p>
                                <button
                                    className="clear-search-btn"
                                    onClick={() => onSearchChange('')}
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((chat) => (
                        <div
                            key={chat.thread_id}
                            className={`chat-item ${selectedUser?.thread_id === chat.thread_id ? 'selected' : ''}`}
                            onClick={() => onUserSelect(chat)}
                        >
                            <div className="user-avatar">
                                <div className="avatar">
                                    {chat.other_participant.user.name[0].toUpperCase()}
                                </div>
                                <div className={`status-indicator online`} />
                            </div>
                            <div className="user-info">
                                <div className="user-name">
                                    {chat.other_participant.user.name}
                                </div>
                                <div className="last-message">
                                    {chat.latest_message.body.substring(0, 30)}
                                    {chat.latest_message.body.length > 30 && '...'}
                                </div>
                            </div>
                            <div className="message-time">
                                {formatTime(chat.latest_message.created_at)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No conversations yet</p>
                        <button
                            className="start-chat-btn"
                            onClick={onToggleUsers}
                        >
                            Start a new chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;