'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch, FaSmile, FaTimes } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useFetchChatListQuery, useFetchMessagesQuery, useSendMessageMutation, useFetchChatUsersQuery } from '@/slices/chat/chatApi';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<ChatThread | null>(null);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
    const [sendMessage] = useSendMessageMutation();
    const { data: chatListData, refetch: refetchChatList } = useFetchChatListQuery();
    const chatList: ChatThread[] = chatListData?.latest_messages || [];
    const { data: chatUsers } = useFetchChatUsersQuery();
    const chatUsersList: ChatUser[] = chatUsers || [];
    const emojiRef = useRef<HTMLDivElement>(null);
    const smileyRef = useRef<HTMLDivElement>(null);

    const { data: profile } = useFetchProfileQuery();
    const currentUserId = profile?.user.id;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredUsers = chatList.filter((user) => {
        const name = user.other_participant.user.name.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });
    const filteredAllUsers = chatUsersList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedUserId = selectedUser?.other_participant?.user?.id || selectedUser?.current_user_id;
    const { data: messagesData, refetch } = useFetchMessagesQuery(selectedUserId!, {
        skip: !selectedUserId,
    });

    const handleUserClick = (user: ChatThread) => {
        setSelectedUser(user);
    };


    const handleEmojiClick = (emoji: EmojiClickData) => {
        setMessage(prev => prev + emoji.emoji);
    };

    const toggleEmojiPanel = () => {
        setIsEmojiPanelOpen(prev => !prev);
    };

    // Helper function to render the date label only when the day changes
    const renderDateLabel = (message: ChatMessage, prevDate: string) => {
        const messageDate = new Date(message.created_at).toLocaleDateString();
        if (messageDate !== prevDate) {
            return (
                <div className="dateLabel">
                    <span>{messageDate}</span>
                </div>
            );
        }
        return null; // Do not show the date if it's the same day as the previous message
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedUser) return;

        try {
            await sendMessage({
                recipient_id: selectedUser.other_participant.user.id || selectedUser.current_user_id,
                message,
            });

            setMessage('');
            refetch(); // Refresh the message list
            refetchChatList(); // Refresh the last message in chat list
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (!selectedUser && filteredUsers.length > 0) {
            setSelectedUser(filteredUsers[0]);
        }
    }, [filteredUsers, selectedUser]);

    useEffect(() => {
        const chatMessagesEl = document.getElementById('chatMessages');
        if (chatMessagesEl) {
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
    }, [messagesData]);

    // Close emoji box on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(event.target as Node) &&
                smileyRef.current &&
                !smileyRef.current.contains(event.target as Node)
            ) {
                setIsEmojiPanelOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="chat-page">
                {/* Sidebar */}
                <div className="chatSidebar">
                    <div className="chatsidebar-header">
                        <div className="searchInputContainer">
                            <FaSearch size={14} color="#009693" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="searchInput"
                            />
                        </div>
                        <span onClick={() => setShowAllUsers(prev => !prev)}>
                            {showAllUsers ? <FaTimes size={15} color="#fff" /> : <FaPlus size={15} color="#fff" />}
                        </span>
                    </div>
                    <div className="chatList">
                        {showAllUsers ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 20px', borderBottom: '1px solid #ddd' }}><h4>All</h4> <h4>{chatUsersList.length}</h4></div>
                                {filteredAllUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="chatItem"
                                        onClick={() => {
                                            setShowAllUsers(false);
                                            const existingThread = chatList.find(
                                                thread => thread.other_participant.user.id === user.id
                                            );
                                            if (existingThread) {
                                                setSelectedUser(existingThread);
                                            }
                                            else {
                                                // If no existing thread, create a placeholder ChatThread
                                                setSelectedUser({
                                                    thread_id: 0,
                                                    current_user_id: 0,
                                                    user_is: 'sender',
                                                    latest_message: {
                                                        id: 0, body: '', created_at: new Date().toISOString(),
                                                        thread_id: 0,
                                                        user_id: 0,
                                                        updated_at: '',
                                                        deleted_at: null
                                                    },
                                                    other_participant: {
                                                        user: user as unknown as User,
                                                        id: 0,
                                                        thread_id: 0,
                                                        user_id: 0,
                                                        last_read: null,
                                                        created_at: '',
                                                        updated_at: '',
                                                        deleted_at: null
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        <div className="chatavatar">
                                            <div className="avatar-placeholder">
                                                {user.name[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', overflow: 'hidden' }}>
                                            <div className="chatName">
                                                {user.name} {user.id === currentUserId}
                                            </div>
                                            <div className="chatuser-role">{user.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            filteredUsers.map((chat) => {
                                const name = chat.other_participant.user.name;
                                const lastMsg = chat.latest_message.body || '';
                                const id = chat.latest_message.id;
                                return (
                                    <div
                                        key={id}
                                        className={`chatItem ${selectedUser?.latest_message.id === chat.latest_message.id ? 'selected' : ''}`}
                                        onClick={() => handleUserClick(chat)}
                                    >
                                        <div className="chatavatar">
                                            <div className="avatar-placeholder">
                                                {chat.other_participant.user.name[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', overflow: 'hidden' }}>
                                            <div className="chatName">{name}</div>
                                            <div className="chatMessage">{lastMsg}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                    </div>
                </div>
                <div className="chatArea">
                    <div className="chatHeader">
                        <div className="header-left">
                            <div className="avatar-container">
                                <div className="chatavatar">
                                    <div className="avatar-placeholder">
                                        {selectedUser?.other_participant.user.name[0].toUpperCase()}
                                    </div>
                                </div>
                                <div className={`status-indicator online`} />
                            </div>
                            <div className="user-info">
                                <div className="chatName">{selectedUser?.other_participant.user.name}</div>
                                <div className="onlineStatus">
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chatMessages" id="chatMessages">
                        {messagesData?.messages.map((msg, index) => {
                            // Get the previous message date
                            const prevMessage = messagesData?.messages[index - 1];
                            const prevDate = prevMessage ? new Date(prevMessage.created_at).toLocaleDateString() : '';

                            return (
                                <React.Fragment key={msg.id}>
                                    {renderDateLabel(msg, prevDate)} {/* Render the date only if it's a new day */}
                                    <div className={msg.sent_by_me ? 'messageRight' : 'messageLeft'}>
                                        <p className="messageText">{msg.body}</p>
                                        <span className="timestamp">{formatTime(msg.created_at)}</span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <div className="inputBox">
                        <div className="message-input-container">
                            <FaPlus size={14} color="#009693" />
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Type Message here....."
                                className="input"
                            />
                        </div>
                        <span ref={smileyRef} onClick={toggleEmojiPanel}>
                            <FaSmile size={18} color="#009693" />
                        </span>
                        <span className="sendButton" onClick={handleSendMessage}>
                            <FiSend size={20} color="#009693" />
                        </span>
                    </div>

                    {isEmojiPanelOpen && (
                        <div className="emoji-panel" ref={emojiRef}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>

            </div>
        </>
    )
}

export default ChatPage;