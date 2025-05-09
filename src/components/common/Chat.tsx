// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlus, FaSearch, FaSmile, FaTimes } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
// import { useFetchChatListQuery, useFetchMessagesQuery, useSendMessageMutation, useFetchChatUsersQuery } from '@/slices/chat/chatApi';
// import { useFetchProfileQuery } from '@/slices/auth/authApi';

// function ChatPage() {
//     const [selectedUser, setSelectedUser] = useState<ChatThread | null>(null);
//     const [showAllUsers, setShowAllUsers] = useState(false);
//     const [message, setMessage] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
//     const [sendMessage] = useSendMessageMutation();
//     const { data: chatListData, refetch: refetchChatList } = useFetchChatListQuery();
//     const chatList: ChatThread[] = chatListData?.latest_messages || [];
//     const { data: chatUsers } = useFetchChatUsersQuery();
//     const chatUsersList: ChatUser[] = chatUsers || [];
//     const emojiRef = useRef<HTMLDivElement>(null);
//     const smileyRef = useRef<HTMLDivElement>(null);

//     const { data: profile } = useFetchProfileQuery();
//     const currentUserId = profile?.user.id;

//     const formatTime = (timestamp: string) => {
//         const date = new Date(timestamp);
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const filteredUsers = chatList.filter((user) => {
//         const name = user.other_participant.user.name.toLowerCase();
//         return name.includes(searchQuery.toLowerCase());
//     });
//     const filteredAllUsers = chatUsersList.filter((user) =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const selectedUserId = selectedUser?.other_participant?.user?.id || selectedUser?.current_user_id;
//     const { data: messagesData, refetch } = useFetchMessagesQuery(selectedUserId!, {
//         skip: !selectedUserId,
//     });

//     const handleUserClick = (user: ChatThread) => {
//         setSelectedUser(user);
//     };


//     const handleEmojiClick = (emoji: EmojiClickData) => {
//         setMessage(prev => prev + emoji.emoji);
//     };

//     const toggleEmojiPanel = () => {
//         setIsEmojiPanelOpen(prev => !prev);
//     };

//     // Helper function to render the date label only when the day changes
//     const renderDateLabel = (message: ChatMessage, prevDate: string) => {
//         const messageDate = new Date(message.created_at).toLocaleDateString();
//         if (messageDate !== prevDate) {
//             return (
//                 <div className="dateLabel">
//                     <span>{messageDate}</span>
//                 </div>
//             );
//         }
//         return null; // Do not show the date if it's the same day as the previous message
//     };

//     const handleSendMessage = async () => {
//         if (!message.trim() || !selectedUser) return;

//         try {
//             await sendMessage({
//                 recipient_id: selectedUser.other_participant.user.id || selectedUser.current_user_id,
//                 message,
//             });

//             setMessage('');
//             refetch(); // Refresh the message list
//             refetchChatList(); // Refresh the last message in chat list
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     useEffect(() => {
//         if (!selectedUser && filteredUsers.length > 0) {
//             setSelectedUser(filteredUsers[0]);
//         }
//     }, [filteredUsers, selectedUser]);

//     useEffect(() => {
//         const chatMessagesEl = document.getElementById('chatMessages');
//         if (chatMessagesEl) {
//             chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
//         }
//     }, [messagesData]);

//     // Close emoji box on outside click
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 emojiRef.current &&
//                 !emojiRef.current.contains(event.target as Node) &&
//                 smileyRef.current &&
//                 !smileyRef.current.contains(event.target as Node)
//             ) {
//                 setIsEmojiPanelOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     return (
//         <>
//             <div className="chat-page">
//                 {/* Sidebar */}
//                 <div className="chatSidebar">
//                     <div className="chatsidebar-header">
//                         <div className="searchInputContainer">
//                             <FaSearch size={14} color="#009693" />
//                             <input
//                                 type="text"
//                                 placeholder="Search users..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="searchInput"
//                             />
//                         </div>
//                         <span onClick={() => setShowAllUsers(prev => !prev)}>
//                             {showAllUsers ? <FaTimes size={15} color="#fff" /> : <FaPlus size={15} color="#fff" />}
//                         </span>
//                     </div>
//                     <div className="chatList">
//                         {showAllUsers ? (
//                             <>
//                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 20px', borderBottom: '1px solid #ddd' }}><h4>All</h4> <h4>{chatUsersList.length}</h4></div>
//                                 {filteredAllUsers.map((user) => (
//                                     <div
//                                         key={user.id}
//                                         className="chatItem"
//                                         onClick={() => {
//                                             setShowAllUsers(false);
//                                             const existingThread = chatList.find(
//                                                 thread => thread.other_participant.user.id === user.id
//                                             );
//                                             if (existingThread) {
//                                                 setSelectedUser(existingThread);
//                                             }
//                                             else {
//                                                 // If no existing thread, create a placeholder ChatThread
//                                                 setSelectedUser({
//                                                     thread_id: 0,
//                                                     current_user_id: 0,
//                                                     user_is: 'sender',
//                                                     latest_message: {
//                                                         id: 0, body: '', created_at: new Date().toISOString(),
//                                                         thread_id: 0,
//                                                         user_id: 0,
//                                                         updated_at: '',
//                                                         deleted_at: null
//                                                     },
//                                                     other_participant: {
//                                                         user: user as unknown as User,
//                                                         id: 0,
//                                                         thread_id: 0,
//                                                         user_id: 0,
//                                                         last_read: null,
//                                                         created_at: '',
//                                                         updated_at: '',
//                                                         deleted_at: null
//                                                     }
//                                                 });
//                                             }
//                                         }}
//                                     >
//                                         <div className="chatavatar">
//                                             <div className="avatar-placeholder">
//                                                 {user.name[0].toUpperCase()}
//                                             </div>
//                                         </div>
//                                         <div style={{ width: '100%', overflow: 'hidden' }}>
//                                             <div className="chatName">
//                                                 {user.name} {user.id === currentUserId}
//                                             </div>
//                                             <div className="chatuser-role">{user.role}</div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </>
//                         ) : (
//                             filteredUsers.map((chat) => {
//                                 const name = chat.other_participant.user.name;
//                                 const lastMsg = chat.latest_message.body || '';
//                                 const id = chat.latest_message.id;
//                                 return (
//                                     <div
//                                         key={id}
//                                         className={`chatItem ${selectedUser?.latest_message.id === chat.latest_message.id ? 'selected' : ''}`}
//                                         onClick={() => handleUserClick(chat)}
//                                     >
//                                         <div className="chatavatar">
//                                             <div className="avatar-placeholder">
//                                                 {chat.other_participant.user.name[0].toUpperCase()}
//                                             </div>
//                                         </div>
//                                         <div style={{ width: '100%', overflow: 'hidden' }}>
//                                             <div className="chatName">{name}</div>
//                                             <div className="chatMessage">{lastMsg}</div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}

//                     </div>
//                 </div>
//                 <div className="chatArea">
//                     <div className="chatHeader">
//                         <div className="header-left">
//                             <div className="avatar-container">
//                                 <div className="chatavatar">
//                                     <div className="avatar-placeholder">
//                                         {selectedUser?.other_participant.user.name[0].toUpperCase()}
//                                     </div>
//                                 </div>
//                                 <div className={`status-indicator online`} />
//                             </div>
//                             <div className="user-info">
//                                 <div className="chatName">{selectedUser?.other_participant.user.name}</div>
//                                 <div className="onlineStatus">
//                                     Online
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="chatMessages" id="chatMessages">
//                         {messagesData?.messages.map((msg, index) => {
//                             // Get the previous message date
//                             const prevMessage = messagesData?.messages[index - 1];
//                             const prevDate = prevMessage ? new Date(prevMessage.created_at).toLocaleDateString() : '';

//                             return (
//                                 <React.Fragment key={msg.id}>
//                                     {renderDateLabel(msg, prevDate)} {/* Render the date only if it's a new day */}
//                                     <div className={msg.sent_by_me ? 'messageRight' : 'messageLeft'}>
//                                         <p className="messageText">{msg.body}</p>
//                                         <span className="timestamp">{formatTime(msg.created_at)}</span>
//                                     </div>
//                                 </React.Fragment>
//                             );
//                         })}
//                     </div>

//                     <div className="inputBox">
//                         <div className="message-input-container">
//                             <FaPlus size={14} color="#009693" />
//                             <input
//                                 type="text"
//                                 value={message}
//                                 onChange={(e) => setMessage(e.target.value)}
//                                 onKeyDown={(e) => {
//                                     if (e.key === 'Enter') {
//                                         e.preventDefault();
//                                         handleSendMessage();
//                                     }
//                                 }}
//                                 placeholder="Type Message here....."
//                                 className="input"
//                             />
//                         </div>
//                         <span ref={smileyRef} onClick={toggleEmojiPanel}>
//                             <FaSmile size={18} color="#009693" />
//                         </span>
//                         <span className="sendButton" onClick={handleSendMessage}>
//                             <FiSend size={20} color="#009693" />
//                         </span>
//                     </div>

//                     {isEmojiPanelOpen && (
//                         <div className="emoji-panel" ref={emojiRef}>
//                             <EmojiPicker onEmojiClick={handleEmojiClick} />
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </>
//     )
// }

// export default ChatPage;


















'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch, FaSmile, FaTimes, FaEllipsisV, FaPaperclip } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useFetchChatListQuery, useFetchMessagesQuery, useSendMessageMutation, useFetchChatUsersQuery } from '@/slices/chat/chatApi';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ChatPage() {
    // State management
    const [selectedUser, setSelectedUser] = useState<ChatThread | null>(null);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
    const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const emojiRef = useRef<HTMLDivElement>(null);
    const smileyRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const attachmentButtonRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // API hooks
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const {
        data: chatListData,
        refetch: refetchChatList,
        error: chatListError,
        isLoading: isChatListLoading
    } = useFetchChatListQuery();

    const {
        data: chatUsers,
        error: chatUsersError,
        isLoading: isChatUsersLoading
    } = useFetchChatUsersQuery();

    const {
        data: profile,
        error: profileError
    } = useFetchProfileQuery();

    // Derived data
    const chatList: ChatThread[] = chatListData?.latest_messages || [];
    const chatUsersList: ChatUser[] = chatUsers || [];
    const currentUserId = profile?.user.id;

    // Error handling
    useEffect(() => {
        if (chatListError) {
            setError('Failed to load chat list');
            toast.error('Failed to load conversations');
        }
        if (chatUsersError) {
            setError('Failed to load users');
            toast.error('Failed to load users');
        }
        if (profileError) {
            setError('Failed to load profile');
            toast.error('Failed to load your profile');
        }
    }, [chatListError, chatUsersError, profileError]);

    // Format time for messages
    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    // Filter users based on search query
    const filteredUsers = chatList.filter((user) => {
        const name = user.other_participant.user.name.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    const filteredAllUsers = chatUsersList.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get messages for selected user
    const selectedUserId = selectedUser?.other_participant?.user?.id || selectedUser?.current_user_id;
    const {
        data: messagesData,
        refetch: refetchMessages,
        error: messagesError,
        isLoading: isMessagesLoading
    } = useFetchMessagesQuery(selectedUserId!, {
        skip: !selectedUserId,
    });

    useEffect(() => {
        if (messagesError) {
            setError('Failed to load messages');
            toast.error('Failed to load messages');
        }
    }, [messagesError]);

    // Handle user selection
    const handleUserClick = (user: ChatThread) => {
        setSelectedUser(user);
        setIsEmojiPanelOpen(false);
        setIsAttachmentPanelOpen(false);
    };

    // Handle emoji selection
    const handleEmojiClick = (emoji: EmojiClickData) => {
        setMessage(prev => prev + emoji.emoji);
    };

    // Toggle emoji panel
    const toggleEmojiPanel = () => {
        setIsEmojiPanelOpen(prev => !prev);
        setIsAttachmentPanelOpen(false);
    };

    // Toggle attachment panel
    const toggleAttachmentPanel = () => {
        setIsAttachmentPanelOpen(prev => !prev);
        setIsEmojiPanelOpen(false);
    };

    // Render date label when day changes
    const renderDateLabel = (message: ChatMessage, prevDate: string) => {
        try {
            const messageDate = new Date(message.created_at).toLocaleDateString();
            if (messageDate !== prevDate) {
                return (
                    <div className="date-label">
                        <span>{messageDate}</span>
                    </div>
                );
            }
            return null;
        } catch (error) {
            console.error('Error rendering date label:', error);
            return null;
        }
    };

    // Send message handler
    const handleSendMessage = async () => {
        if (!message.trim() || !selectedUser || isSending) return;

        try {
            await sendMessage({
                recipient_id: selectedUser.other_participant.user.id || selectedUser.current_user_id,
                message,
            }).unwrap();

            setMessage('');
            await refetchMessages();
            await refetchChatList();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
            setError('Failed to send message');
        }
    };

    // Auto-select first user if none selected
    useEffect(() => {
        if (!selectedUser && filteredUsers.length > 0) {
            setSelectedUser(filteredUsers[0]);
        }
    }, [filteredUsers, selectedUser]);

    // Close panels when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node) &&
                smileyRef.current && !smileyRef.current.contains(event.target as Node)) {
                setIsEmojiPanelOpen(false);
            }

            if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node) &&
                attachmentButtonRef.current && !attachmentButtonRef.current.contains(event.target as Node)) {
                setIsAttachmentPanelOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const chatMessagesEl = document.getElementById('chatMessages');
        if (chatMessagesEl) {
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
    }, [messagesData]);

    // Loading skeleton for chat list
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

    // Loading skeleton for messages
    const renderMessagesSkeleton = () => (
        <div className="messages-skeleton">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`message-skeleton ${i % 2 === 0 ? 'left' : 'right'}`}>
                    <Skeleton width={Math.random() * 200 + 100} height={50} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="chat-app">
            {/* Error toast container */}
            {error && (
                <div className="error-toast">
                    {error}
                    <button onClick={() => setError(null)}>X</button>
                </div>
            )}

            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <button
                        className="toggle-users-btn"
                        onClick={() => setShowAllUsers(prev => !prev)}
                        aria-label={showAllUsers ? 'Close user list' : 'Open user list'}
                    >
                        {showAllUsers ? <FaTimes /> : <FaPlus />}
                    </button>
                </div>

                <div className="chat-list-container">
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
                                            setShowAllUsers(false);
                                            const existingThread = chatList.find(
                                                thread => thread.other_participant.user.id === user.id
                                            );
                                            if (existingThread) {
                                                setSelectedUser(existingThread);
                                            } else {
                                                setSelectedUser({
                                                    thread_id: 0,
                                                    current_user_id: currentUserId || 0,
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
                                        onClick={() => setSearchQuery('')}
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
                                onClick={() => handleUserClick(chat)}
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
                                        {/* {chat.unread_count && chat.unread_count > 0 && (
                      <span className="unread-count">{chat.unread_count}</span>
                    )} */}
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
                                onClick={() => setShowAllUsers(true)}
                            >
                                Start a new chat
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className="chat-main">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="header-left">
                                <div className="user-avatar">
                                    <div className="avatar">
                                        {selectedUser.other_participant.user.name[0].toUpperCase()}
                                    </div>
                                    <div className={`status-indicator online`} />
                                </div>
                                <div className="user-details">
                                    <h3>{selectedUser.other_participant.user.name}</h3>
                                    <p className="user-status">
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="header-right">
                                <button className="header-action-btn">
                                    <FaEllipsisV />
                                </button>
                            </div>
                        </div>

                        <div className="messages-container" id='chatMessages'>
                            {isMessagesLoading ? (
                                renderMessagesSkeleton()
                            ) : messagesData?.messages && messagesData.messages.length > 0 ? (
                                messagesData.messages.map((msg, index) => {
                                    const prevMessage = messagesData?.messages[index - 1];
                                    const prevDate = prevMessage ? new Date(prevMessage.created_at).toLocaleDateString() : '';

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {renderDateLabel(msg, prevDate)}
                                            <div className={`message ${msg.sent_by_me ? 'sent' : 'received'}`}>
                                                <div className="message-content">
                                                    <p>{msg.body}</p>
                                                    <span className="message-time">{formatTime(msg.created_at)}</span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <div className="empty-chat">
                                    <p>No messages yet</p>
                                    <p>Start the conversation with {selectedUser.other_participant.user.name}</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="message-input-container">
                            <div
                                ref={attachmentButtonRef}
                                className="attachment-btn"
                                onClick={toggleAttachmentPanel}
                            >
                                <FaPaperclip />
                            </div>

                            {isAttachmentPanelOpen && (
                                <div
                                    ref={attachmentRef}
                                    className="attachment-panel"
                                >
                                    <button className="attachment-option">
                                        <span>Photo</span>
                                    </button>
                                    <button className="attachment-option">
                                        <span>Document</span>
                                    </button>
                                    <button className="attachment-option">
                                        <span>Location</span>
                                    </button>
                                </div>
                            )}

                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type a message..."
                                    className="message-input"
                                />
                                <div
                                    ref={smileyRef}
                                    className="emoji-btn"
                                    onClick={toggleEmojiPanel}
                                >
                                    <FaSmile />
                                </div>
                            </div>

                            <button
                                className="send-btn"
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isSending}
                            >
                                <FiSend />
                            </button>

                            {isEmojiPanelOpen && (
                                <div
                                    ref={emojiRef}
                                    className="emoji-panel"
                                >
                                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="no-chat-content">
                            <h3>Select a chat to start messaging</h3>
                            <p>Or start a new conversation</p>
                            <button
                                className="new-chat-btn"
                                onClick={() => setShowAllUsers(true)}
                            >
                                New Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;