// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import EmojiPicker from 'emoji-picker-react';
// import { EmojiClickData } from 'emoji-picker-react';
// import { useFetchChatListQuery } from '@/slices/chat/chatApi';

// function ChatPage() {
//   const [selectedUser, setSelectedUser] = useState<ChatListItem | null>(null);
//   const { data: chats } = useFetchChatListQuery();
//   const { data: sendMsg } = useFetchChatListQuery();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const emojiRef = useRef<HTMLDivElement>(null);
//   const smileyRef = useRef<HTMLDivElement>(null);

//   const handleUserClick = (user: ChatListItem) => {
//     setSelectedUser(user);
//   };

//   // Filter by receiver name (assuming the current user is sender)
//   const filteredUsers: ChatListItem[] = (chats?.messages || []).filter(
//     (user: ChatListItem) =>
//       user.latest_message &&
//       (user.other_participant.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.other_participant.user.name?.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const handleEmojiClick = (emoji: EmojiClickData) => {
//     setMessage(prev => prev + emoji.emoji);
//   };

//   const toggleEmojiPanel = () => {
//     setIsEmojiPanelOpen(prev => !prev);
//   };

//   const handleSendMessage = () => {
//     if (!message.trim()) return;
//     // Handle sending message logic here
//     setMessage('');
//   };


//   useEffect(() => {
//     if (!selectedUser && filteredUsers.length > 0) {
//       setSelectedUser(filteredUsers[0]);
//     }
//   }, [filteredUsers, selectedUser]);

//   return (
//     <div className="chat-page">
//       <div className="chatSidebar">
//         <div className="chatsidebar-header">
//           <div className="searchInputContainer">
//             <FaSearch size={14} color="#009693" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="searchInput"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <span><FaPlus size={15} color="#fff" /></span>
//         </div>

//         <div className="chatList">

//         </div>

//       </div>
//       <div className="chatArea">
//         <div className="chatHeader">
//           <div className="header-left">
//             <div className="avatar-container">

//             </div>
//           </div>
//         </div>

//         <div className="chatMessages">

//         </div>

//         <div className="inputBox">
//           <div className="message-input-container">
//             <FaPlus size={14} color="#009693" />
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   e.preventDefault();
//                   handleSendMessage();
//                 }
//               }}
//               placeholder="Type Message here....."
//               className="input"
//             />
//           </div>
//           <span ref={smileyRef} onClick={toggleEmojiPanel}>
//             <FaSmile size={18} color="#009693" />
//           </span>
//           <span className="sendButton" onClick={handleSendMessage}>
//             <FiSend size={20} color="#009693" />
//           </span>
//         </div>

//         {isEmojiPanelOpen && (
//           <div className="emoji-panel" ref={emojiRef}>
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatPage




// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
// import {
//   useFetchChatListQuery,
//   useFetchMessagesQuery,
//   useSendMessageMutation,
// } from '@/slices/chat/chatApi';

// function ChatPage() {
//   const [selectedUser, setSelectedUser] = useState<ChatListItem | null>(null);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
//   const [sendMessage] = useSendMessageMutation();
//   const emojiRef = useRef<HTMLDivElement>(null);
//   const smileyRef = useRef<HTMLDivElement>(null);
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   // WebSocket state
//   const [socket, setSocket] = useState<WebSocket | null>(null);
//   const [liveMessages, setLiveMessages] = useState<Message[]>([]);

//   const { data: chatListData } = useFetchChatListQuery();
//   const chatList: ChatListItem[] = chatListData?.latest_messages || [];

//   const selectedUserId = selectedUser?.other_participant?.user?.id;
//   const { data: messagesData, refetch } = useFetchMessagesQuery(selectedUserId!, {
//     skip: !selectedUserId,
//   });

//   const messages = messagesData?.messages || [];

//   // Combine messages from API and WebSocket
//   const combinedMessages = [...messages, ...liveMessages];

//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedUserId) return;
//     try {
//       await sendMessage({ id: selectedUserId, message }).unwrap();
//       setMessage('');
//       refetch(); // Fetch updated messages after send
//     } catch (err) {
//       console.error('Send failed:', err);
//     }
//   };

//   const handleUserClick = (user: ChatListItem) => {
//     setSelectedUser(user);
//     setLiveMessages([]); // reset live messages for new user
//   };

//   const toggleEmojiPanel = () => setIsEmojiPanelOpen(prev => !prev);

//   const handleEmojiClick = (emoji: EmojiClickData) => {
//     setMessage(prev => prev + emoji.emoji);
//   };

//   const filteredUsers = chatList.filter((user) => {
//     const name = user.other_participant.user.name.toLowerCase();
//     return name.includes(searchQuery.toLowerCase());
//   });

//   // Auto-select first user on load
//   useEffect(() => {
//     if (!selectedUser && filteredUsers.length > 0) {
//       setSelectedUser(filteredUsers[0]);
//     }
//   }, [filteredUsers, selectedUser]);

//   // // Scroll to bottom of chat
//   // useEffect(() => {
//   //   messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   // }, [combinedMessages]);

//   // WebSocket setup
//   // useEffect(() => {
//   //   if (!selectedUserId) return;

//   //   const ws = new WebSocket(`wss://your-server-url/ws/chats/${selectedUserId}/message`);

//   //   ws.onopen = () => {
//   //     console.log('WebSocket connected');
//   //   };

//   //   ws.onmessage = (event) => {
//   //     const data = JSON.parse(event.data);
//   //     setLiveMessages((prev) => [...prev, data]);
//   //   };

//   //   ws.onclose = () => console.log('WebSocket closed');
//   //   ws.onerror = (err) => console.error('WebSocket error', err);

//   //   setSocket(ws);

//   //   return () => ws.close();
//   // }, [selectedUserId]);
//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     if (selectedUserId) {
//   //       refetch(); // this will fetch new messages from your existing API
//   //     }
//   //   }, 3000); // poll every 3 seconds

//   //   return () => clearInterval(interval);
//   // }, [selectedUserId]);

//   return (
//     <div className="chat-page">
//       {/* Sidebar */}
//       <div className="chatSidebar">
//         <div className="chatsidebar-header">
//           <div className="searchInputContainer">
//             <FaSearch size={14} color="#009693" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="searchInput"
//             />
//           </div>
//           <span><FaPlus size={15} color="#fff" /></span>
//         </div>

//         <div className="chatList">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((chat) => {
//               const name = chat.other_participant.user.name;
//               const lastMsg = chat.latest_message?.body || '';
//               return (
//                 <div
//                   key={chat.thread_id}
//                   className={`chatItem ${selectedUser?.thread_id === chat.thread_id ? 'selected' : ''}`}
//                   onClick={() => handleUserClick(chat)}
//                 >
//                   <img
//                     src="https://randomuser.me/api/portraits/men/41.jpg"
//                     alt="avatar"
//                     className="avatar"
//                   />
//                   <div>
//                     <div className="chatName">{name}</div>
//                     <div className="chatMessage">{lastMsg}</div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div>No users found</div>
//           )}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="chatArea">
//         <div className="chatHeader">
//           <div className="header-left">
//             <strong>{selectedUser?.other_participant?.user?.name}</strong>
//           </div>
//         </div>

//         <div className="chatMessages">
//           {combinedMessages.map((msg, index) => (
//             <div
//               key={index}
//               className={`chat-bubble ${msg.sent_by_me ? 'my-message' : 'their-message'}`}
//             >
//               <div className="message-body">{msg.body}</div>
//               <div className="message-time">{new Date(msg.created_at).toLocaleTimeString()}</div>
//             </div>
//           ))}
//           <div ref={messageEndRef}></div>
//         </div>

//         <div className="inputBox">
//           <div className="message-input-container">
//             <FaPlus size={14} color="#009693" />
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') handleSendMessage();
//               }}
//               placeholder="Type Message here....."
//               className="input"
//             />
//           </div>
//           <span ref={smileyRef} onClick={toggleEmojiPanel}>
//             <FaSmile size={18} color="#009693" />
//           </span>
//           <span className="sendButton" onClick={handleSendMessage}>
//             <FiSend size={20} color="#009693" />
//           </span>
//         </div>

//         {isEmojiPanelOpen && (
//           <div className="emoji-panel" ref={emojiRef}>
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatPage;



'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useFetchChatListQuery, useFetchMessagesQuery, useSendMessageMutation } from '@/slices/chat/chatApi';

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<ChatThread | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);

  const { data: chatListData } = useFetchChatListQuery();
  const chatList: ChatThread[] = chatListData?.latest_messages || [];

  const filteredUsers = chatList.filter((user) => {
    const name = user.other_participant.user.name.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const selectedUserId = selectedUser?.other_participant?.user?.id;
  const { data: messagesData, refetch } = useFetchMessagesQuery(selectedUserId!, {
    skip: !selectedUserId,
  });

  const handleUserClick = (user: ChatThread) => {
    setSelectedUser(user);
  };

  const emojiRef = useRef<HTMLDivElement>(null);
  const smileyRef = useRef<HTMLDivElement>(null);


  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage(prev => prev + emoji.emoji);
  };

  const toggleEmojiPanel = () => {
    setIsEmojiPanelOpen(prev => !prev);
  };

  useEffect(() => {
    if (!selectedUser && filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
    }
  }, [filteredUsers, selectedUser]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle sending message logic here
    setMessage('');
  };

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
            <span><FaPlus size={15} color="#fff" /></span>
          </div>
          <div className="chatList">
            {filteredUsers.length > 0 ? (
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
                    <img
                      src="https://randomuser.me/api/portraits/men/41.jpg"
                      alt="avatar"
                      className="avatar"
                    />
                    <div>
                      <div className="chatName">{name}</div>
                      <div className="chatMessage">{lastMsg}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No users found</div>
            )}
          </div>
        </div>
        <div className="chatArea">
          <div className="chatHeader">
            <div className="header-left">
              <div className="avatar-container">
                <img
                  src="https://randomuser.me/api/portraits/men/41.jpg"
                  alt="avatar"
                  className="avatar"
                />
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

          <div className="chatMessages">
            {messagesData?.messages.map((msg) => (
              <div key={msg.id} className={msg.sent_by_me === true ? 'messageRight' : 'messageLeft'}>
                <p>{msg.body}</p>
              </div>
            ))}
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
            <span className="sendButton">
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