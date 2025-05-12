'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaSmile, FaEllipsisV, FaPaperclip, FaArrowLeft, FaArrowDown } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useDeleteSingleMessageMutation, useFetchMessagesQuery, useSendMessageMutation } from '@/slices/chat/chatApi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ChatAreaProps {
    selectedUser: ChatThread | null;
    onStartNewChat: () => void;
    onBackToChatList: () => void;
    isMobile: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    selectedUser,
    onStartNewChat,
    onBackToChatList,
    isMobile
}) => {
    const [message, setMessage] = useState('');
    const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
    const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const emojiRef = useRef<HTMLDivElement>(null);
    const smileyRef = useRef<HTMLDivElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);
    const attachmentButtonRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const selectedUserId = selectedUser?.other_participant?.user?.id;
    const [deleteMessage] = useDeleteSingleMessageMutation();

    const {
        data: messagesData,
        refetch: refetchMessages,
        isLoading: isMessagesLoading
    } = useFetchMessagesQuery(selectedUserId!, {
        skip: !selectedUserId,
    });

    const handleDelete = async (messageId: number | string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            await deleteMessage(messageId).unwrap();
            await refetchMessages();
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    const formatTime = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    const handleEmojiClick = (emoji: EmojiClickData) => {
        setMessage(prev => prev + emoji.emoji);
    };

    const toggleEmojiPanel = () => {
        setIsEmojiPanelOpen(prev => !prev);
        setIsAttachmentPanelOpen(false);
    };

    const toggleAttachmentPanel = () => {
        setIsAttachmentPanelOpen(prev => !prev);
        setIsEmojiPanelOpen(false);
    };

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

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedUser || isSending) return;

        try {
            await sendMessage({
                recipient_id: selectedUser.other_participant.user.id,
                message,
            }).unwrap();

            setMessage('');
            await refetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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

        const handleScroll = () => {
            if (!chatMessagesEl) return;

            const threshold = 300; // px from bottom to hide button
            const isAtBottom = chatMessagesEl.scrollHeight - chatMessagesEl.scrollTop - chatMessagesEl.clientHeight < threshold;
            setShowScrollToBottom(!isAtBottom);
        };

        if (chatMessagesEl) {
            chatMessagesEl.addEventListener('scroll', handleScroll);
            // Scroll to bottom initially
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }

        return () => {
            if (chatMessagesEl) {
                chatMessagesEl.removeEventListener('scroll', handleScroll);
            }
        };
    }, [messagesData]);

    const renderMessagesSkeleton = () => (
        <div className="messages-skeleton">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`message-skeleton ${i % 2 === 0 ? 'left' : 'right'}`}>
                    <Skeleton width={Math.random() * 200 + 100} height={50} />
                </div>
            ))}
        </div>
    );

    if (!selectedUser) {
        return (
            <div className="no-chat-selected">
                <div className="no-chat-content">
                    <h3>Select a chat to start messaging</h3>
                    <p>Or start a new conversation</p>
                    <button
                        className="new-chat-btn"
                        onClick={onStartNewChat}
                    >
                        New Chat
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="chat-header">
                <div className="header-left">
                    {isMobile && (
                        <button
                            className="chatback-button"
                            onClick={onBackToChatList}
                        >
                            <FaArrowLeft />
                        </button>
                    )}
                    <div className="user-avatar">
                        <div className="avatar">
                            {selectedUser.other_participant.user.name[0].toUpperCase()}
                        </div>
                        <div className={`status-indicator online`} />
                    </div>
                    <div className="user-details">
                        <h3>{selectedUser.other_participant.user.name}</h3>
                        <p className="user-status">Online</p>
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
                                <div className={`message ${msg.sent_by_me ? 'sent' : 'received'}`}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        if (isMobile) handleDelete(msg.id);
                                    }}
                                    onTouchStart={(e) => {
                                        if (isMobile) {
                                            const timeout = setTimeout(() => handleDelete(msg.id), 800);
                                            const clear = () => clearTimeout(timeout);
                                            e.currentTarget.addEventListener('touchend', clear, { once: true });
                                            e.currentTarget.addEventListener('touchmove', clear, { once: true });
                                        }
                                    }}>
                                    <div className="message-content">
                                        <p>{msg.body}</p>
                                        <span className="message-time">{formatTime(msg.created_at)}
                                            {!isMobile && msg.sent_by_me && (
                                                <div className="message-options">
                                                    <FaEllipsisV onClick={() => handleDelete(msg.id)} color='#fff' />
                                                </div>
                                            )}
                                        </span>

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
                {showScrollToBottom && (
                    <span className="scroll-to-bottom-btn" onClick={() => {
                        const chatMessagesEl = document.getElementById('chatMessages');
                        if (chatMessagesEl) {
                            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
                        }
                    }} >
                        <FaArrowDown size={16} />
                    </span>
                )}
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
    );
};

export default ChatArea;