'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  messages: Message[];
}

interface Message {
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'Cameron Williamson',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    lastMessage: 'Thanks for reply',
    time: '7:30 PM',
    messages: [
      { sender: 'them', text: 'Hey, Your order according to application yes? 😊', time: '01:14 PM' },
      { sender: 'me', text: 'Hey, Yes My order according to application. Thank You 😂', time: '02:10 PM' },
    ],
  },
  {
    id: 2,
    name: 'Darrell Steward',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    lastMessage: 'I will check and update.',
    time: '6:15 PM',
    messages: [
      { sender: 'them', text: 'Did you receive the package?', time: '12:00 PM' },
      { sender: 'me', text: 'Yes, just now. Thanks!', time: '12:15 PM' },
    ],
  },
  {
    id: 3,
    name: 'Courtney Henry',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Let\'s talk tomorrow!',
    time: '5:05 PM',
    messages: [
      { sender: 'them', text: 'Can we schedule a call?', time: '03:30 PM' },
      { sender: 'me', text: 'Sure! Let\'s talk tomorrow.', time: '05:05 PM' },
    ],
  },
  {
    id: 4,
    name: 'Wade Warren',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    lastMessage: 'I\'ll email the document.',
    time: '4:22 PM',
    messages: [
      { sender: 'them', text: 'Do you need the invoice?', time: '02:00 PM' },
      { sender: 'me', text: 'Yes, please send it.', time: '02:15 PM' },
      { sender: 'them', text: 'I\'ll email the document.', time: '04:22 PM' },
    ],
  },
];

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const emojiRef = useRef<HTMLDivElement>(null);
  const smileyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleUserClick = (user: typeof users[0]) => {
    setSelectedUser(user);
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage(prev => prev + emoji.emoji); // Works with latest emoji-picker-react
  };

  const toggleEmojiPanel = () => {
    setIsEmojiPanelOpen(prev => !prev);
  };
  const handleSendMessage = () => {
    if (message.trim() === '' || !selectedUser) return;

    const newMessage: Message = {
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedUser = {
      ...selectedUser,
      messages: [...selectedUser.messages, newMessage],
      lastMessage: message,
      time: 'Just now'
    };

    setSelectedUser(updatedUser);
    setMessage('');

    // Update the user in the users array
    // const updatedUsers = users.map(user =>
    //   user.id === updatedUser.id ? updatedUser : user
    // );
    // In a real app, you would setUsers(updatedUsers) if using state for users
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chatSidebar">
        <div className="chatsidebar-header">
          <div className="searchInputContainer">
            <FaSearch size={14} color='#009693' />
            <input
              type="text"
              placeholder="Search users..."
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <span><FaPlus size={15} color='#fff' /></span>
        </div>
        <div className="chatList">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`chatItem ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <img src={user.avatar} alt="avatar" className="avatar" />
                <div>
                  <div className="chatName">{user.name}</div>
                  <div className="chatMessage">{user.lastMessage}</div>
                </div>
                <div className="chatTime">{user.time}</div>
              </div>
            ))
          ) : (
            <div className="no-users-message">
              {searchQuery ? (
                <>
                  <FaSearch size={24} />
                  <p>No users found for &quot;{searchQuery}&quot;</p>
                  <button
                    className="clear-search-button"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p>No users available</p>
                  <p className="hint-text">Add new contacts to start chatting</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chatArea">
        <div className="chatHeader">
          <img src={selectedUser.avatar} alt="avatar" className="avatar" />
          <div>
            <div className="chatName">{selectedUser.name}</div>
            <div className="onlineStatus">Online</div>
          </div>
        </div>

        <div className="chatMessages">
          {selectedUser.messages.map((msg, index) => (
            <div
              key={index}
              className={msg.sender === 'me' ? 'messageRight' : 'messageLeft'}
            >
              <p>{msg.text}</p>
              <span className="timestamp">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
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


      <style jsx>{`
        .chat-page {
          display: flex;
          height: 500px;
          font-family: Arial, sans-serif;
          background: #fff;
          border-radius: 8px;
          position: relative;
        }

        .chatSidebar {
          width: 30%;
          border-right: 1px solid #eee;
          overflow: auto;
        }
          .chatsidebar-header{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 20px 10px;
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
          background: #ffffff;
          z-index: 1;
          }
        .searchInputContainer {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 35px;
          padding: 10px 15px;
          background: #f1f9f9;
          border-radius: 50px;
          color: #009693;
          width: fit-content;
        }

        .searchInput {
          width: fit-content;
          padding: 0;
          margin: 0;
          border: none;
          background: #f1f9f9;
          color: #009693;
        }
          .chatsidebar-header span{
          padding: 10px;
          background: #009693;
          color: #ffffff;
          border-radius: 8px;
           display: flex;
  align-items: center;
  justify-content: center;
          }

        .chatList {
          display: flex;
          flex-direction: column;
    overflow: auto;
    padding-bottom: 50px;
        }
          .no-users-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.no-users-message p {
  margin: 10px 0;
}

.no-users-message svg {
  margin-bottom: 15px;
  color: #aaa;
}

.hint-text {
  font-size: 0.9rem;
  color: #999;
}

.clear-search-button {
  margin-top: 15px;
  padding: 8px 16px;
  background: #009693;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

        .chatItem {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid #f0f0f0;
          padding: 10px;
          position: relative;
          cursor: pointer;
        }

        .chatItem.selected {
          background-color: #f0f0f0;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .chatName {
          font-weight: bold;
        }

        .chatMessage {
          font-size: 0.85rem;
          color: #555;
        }

        .chatTime {
          margin-left: auto;
          font-size: 0.8rem;
          color: #888;
        }

        .chatArea {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f1f9f9;
          justify-content: space-between;
        }

        .chatHeader {
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          background: #fff;
          padding: 12px;
        }

        .onlineStatus {
          font-size: 0.8rem;
          color: green;
        }

        .chatMessages {
          flex: 1;
          padding: 20px 10px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          overflow-y: auto;
        }

        .messageLeft {
          align-self: flex-start;
          background: #fff;
          padding: 10px 15px;
          border-radius: 20px;
          max-width: 70%;
          position: relative;
        }

        .messageRight {
          align-self: flex-end;
          background: #009693;
          color: #fff;
          padding: 10px 15px;
          border-radius: 20px;
          max-width: 70%;
          position: relative;
          margin-top: 10px;
        }

        .timestamp {
          font-size: 0.75rem;
          color: #888;
          position: absolute;
          bottom: -18px;
          right: 10px;
          white-space: nowrap;
        }

        .inputBox {
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(0, 150, 147, 0.37);
          padding: 10px;
          gap: 10px;
          background: #f1f9f9;
          position: relative;
        }
           .emoji-panel {
          position: absolute;
          bottom: 50px; 
          right: 50px;
          z-index: 1000;
        }
          .message-input-container{
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          }
          .message-input-container input{
          width: 100%;
          padding: 0;
          margin: 0;
          border: none;
          background: #f1f9f9;
          }
        .sendButton {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
