// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import EmojiPicker from 'emoji-picker-react';
// import { EmojiClickData } from 'emoji-picker-react';

// interface User {
//   id: number;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   time: string;
//   messages: Message[];
// }

// interface Message {
//   sender: 'me' | 'them';
//   text: string;
//   time: string;
// }

// const users: User[] = [
//   {
//     id: 1,
//     name: 'Cameron Williamson',
//     avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
//     lastMessage: 'Thanks for reply',
//     time: '7:30 PM',
//     messages: [
//       { sender: 'them', text: 'Hey, Your order according to application yes? 😊', time: '01:14 PM' },
//       { sender: 'me', text: 'Hey, Yes My order according to application. Thank You 😂', time: '02:10 PM' },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Darrell Steward',
//     avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
//     lastMessage: 'I will check and update.',
//     time: '6:15 PM',
//     messages: [
//       { sender: 'them', text: 'Did you receive the package?', time: '12:00 PM' },
//       { sender: 'me', text: 'Yes, just now. Thanks!', time: '12:15 PM' },
//     ],
//   },
//   {
//     id: 3,
//     name: 'Courtney Henry',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     lastMessage: 'Let\'s talk tomorrow!',
//     time: '5:05 PM',
//     messages: [
//       { sender: 'them', text: 'Can we schedule a call?', time: '03:30 PM' },
//       { sender: 'me', text: 'Sure! Let\'s talk tomorrow.', time: '05:05 PM' },
//     ],
//   },
//   {
//     id: 4,
//     name: 'Wade Warren',
//     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
//     lastMessage: 'I\'ll email the document.',
//     time: '4:22 PM',
//     messages: [
//       { sender: 'them', text: 'Do you need the invoice?', time: '02:00 PM' },
//       { sender: 'me', text: 'Yes, please send it.', time: '02:15 PM' },
//       { sender: 'them', text: 'I\'ll email the document.', time: '04:22 PM' },
//     ],
//   },
// ];

// const ChatPage = () => {
//   const [selectedUser, setSelectedUser] = useState(users[0]);
//   const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const emojiRef = useRef<HTMLDivElement>(null);
//   const smileyRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const handleUserClick = (user: typeof users[0]) => {
//     setSelectedUser(user);
//   };

//   const handleEmojiClick = (emoji: EmojiClickData) => {
//     setMessage(prev => prev + emoji.emoji); // Works with latest emoji-picker-react
//   };

//   const toggleEmojiPanel = () => {
//     setIsEmojiPanelOpen(prev => !prev);
//   };
//   const handleSendMessage = () => {
//     if (message.trim() === '' || !selectedUser) return;

//     const newMessage: Message = {
//       sender: 'me',
//       text: message,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     const updatedUser = {
//       ...selectedUser,
//       messages: [...selectedUser.messages, newMessage],
//       lastMessage: message,
//       time: 'Just now'
//     };

//     setSelectedUser(updatedUser);
//     setMessage('');

//     // Update the user in the users array
//     // const updatedUsers = users.map(user =>
//     //   user.id === updatedUser.id ? updatedUser : user
//     // );
//     // In a real app, you would setUsers(updatedUsers) if using state for users
//   };

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Close emoji box on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         emojiRef.current &&
//         !emojiRef.current.contains(event.target as Node) &&
//         smileyRef.current &&
//         !smileyRef.current.contains(event.target as Node)
//       ) {
//         setIsEmojiPanelOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);


//   return (
//     <div className="chat-page">
//       {/* Sidebar */}
//       <div className="chatSidebar">
//         <div className="chatsidebar-header">
//           <div className="searchInputContainer">
//             <FaSearch size={14} color='#009693' />
//             <input
//               type="text"
//               placeholder="Search users..."
//               className="searchInput"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)} />
//           </div>
//           <span><FaPlus size={15} color='#fff' /></span>
//         </div>
//         <div className="chatList">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div
//                 key={user.id}
//                 className={`chatItem ${selectedUser?.id === user.id ? 'selected' : ''}`}
//                 onClick={() => handleUserClick(user)}
//               >
//                 <img src={user.avatar} alt="avatar" className="avatar" />
//                 <div>
//                   <div className="chatName">{user.name}</div>
//                   <div className="chatMessage">{user.lastMessage}</div>
//                 </div>
//                 <div className="chatTime">{user.time}</div>
//               </div>
//             ))
//           ) : (
//             <div className="no-users-message">
//               {searchQuery ? (
//                 <>
//                   <FaSearch size={24} />
//                   <p>No users found for &quot;{searchQuery}&quot;</p>
//                   <button
//                     className="clear-search-button"
//                     onClick={() => setSearchQuery('')}
//                   >
//                     Clear search
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <p>No users available</p>
//                   <p className="hint-text">Add new contacts to start chatting</p>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="chatArea">
//         <div className="chatHeader">
//           <img src={selectedUser.avatar} alt="avatar" className="avatar" />
//           <div>
//             <div className="chatName">{selectedUser.name}</div>
//             <div className="onlineStatus">Online</div>
//           </div>
//         </div>

//         <div className="chatMessages">
//           {selectedUser.messages.map((msg, index) => (
//             <div
//               key={index}
//               className={msg.sender === 'me' ? 'messageRight' : 'messageLeft'}
//             >
//               <p>{msg.text}</p>
//               <span className="timestamp">{msg.time}</span>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
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
// };

// export default ChatPage;













'use client';
import { useFetchConversationsQuery } from '@/slices/chat/chatApi';
import React from 'react'

function page() {
  const { data, isLoading } = useFetchConversationsQuery();
  return (
    <>
      <div>
        {isLoading && <p>Loading chats...</p>}
        {data?.data.map((chat, index) => (
          <div key={index}>
            <strong>{chat.user_name}</strong>
            <p>{chat.last_message}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default page