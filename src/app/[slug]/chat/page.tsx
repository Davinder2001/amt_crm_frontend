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

// import React, { useState, useRef, useEffect } from 'react';
// import { FaPlus, FaSearch, FaSmile, FaPaperclip, FaCheck, FaCheckDouble, FaTimes, FaPhone, FaVideo, FaEllipsisH, FaUserPlus, FaTrash, FaBan } from 'react-icons/fa';
// import { FiSend } from 'react-icons/fi';
// import EmojiPicker from 'emoji-picker-react';
// import { EmojiClickData } from 'emoji-picker-react';

// interface User {
//   id: number;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   time: string;
//   status: 'online' | 'offline' | 'typing';
//   messages: Message[];
// }

// interface Message {
//   id: string;
//   sender: 'me' | 'them';
//   text: string;
//   time: string;
//   status: 'sent' | 'delivered' | 'read';
//   type: 'text' | 'image' | 'file' | 'gallery';
//   content?: string | string[]; // For file URLs or image URLs
//   fileName?: string | string[]; // For file messages
// }

// const generateId = () => Math.random().toString(36).substring(2, 15);

// const users: User[] = [
//   {
//     id: 1,
//     name: 'Cameron Williamson',
//     avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
//     lastMessage: 'Thanks for reply',
//     time: '7:30 PM',
//     status: 'online',
//     messages: [
//       {
//         id: generateId(),
//         sender: 'them',
//         text: 'Hey, Your order according to application yes? 😊',
//         time: '01:14 PM',
//         status: 'read',
//         type: 'text'
//       },
//       {
//         id: generateId(),
//         sender: 'me',
//         text: 'Hey, Yes My order according to application. Thank You 😂',
//         time: '02:10 PM',
//         status: 'read',
//         type: 'text'
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Darrell Steward',
//     avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
//     lastMessage: 'I will check and update.',
//     time: '6:15 PM',
//     status: 'offline',
//     messages: [
//       {
//         id: generateId(),
//         sender: 'them',
//         text: 'Did you receive the package?',
//         time: '12:00 PM',
//         status: 'read',
//         type: 'text'
//       },
//       {
//         id: generateId(),
//         sender: 'me',
//         text: 'Yes, just now. Thanks!',
//         time: '12:15 PM',
//         status: 'read',
//         type: 'text'
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: 'Courtney Henry',
//     avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
//     lastMessage: 'Let\'s talk tomorrow!',
//     time: '5:05 PM',
//     status: 'online',
//     messages: [
//       {
//         id: generateId(),
//         sender: 'them',
//         text: 'Can we schedule a call?',
//         time: '03:30 PM',
//         status: 'read',
//         type: 'text'
//       },
//       {
//         id: generateId(),
//         sender: 'me',
//         text: 'Sure! Let\'s talk tomorrow.',
//         time: '05:05 PM',
//         status: 'read',
//         type: 'text'
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: 'Wade Warren',
//     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
//     lastMessage: 'I\'ll email the document.',
//     time: '4:22 PM',
//     status: 'online',
//     messages: [
//       {
//         id: generateId(),
//         sender: 'them',
//         text: 'Do you need the invoice?',
//         time: '02:00 PM',
//         status: 'read',
//         type: 'text'
//       },
//       {
//         id: generateId(),
//         sender: 'me',
//         text: 'Yes, please send it.',
//         time: '02:15 PM',
//         status: 'read',
//         type: 'text'
//       },
//       {
//         id: generateId(),
//         sender: 'them',
//         text: 'I\'ll email the document.',
//         time: '04:22 PM',
//         status: 'read',
//         type: 'text'
//       },
//     ],
//   },
// ];

// const ChatPage = () => {
//   const [selectedUser, setSelectedUser] = useState(users[0]);
//   const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
//   const [isAttachmentPanelOpen, setIsAttachmentPanelOpen] = useState(false);
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [usersList, setUsersList] = useState(users);
//   const [isTyping, setIsTyping] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [filePreviews, setFilePreviews] = useState<{ url: string, type: string, name: string }[]>([]);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [currentGallery, setCurrentGallery] = useState<string[]>([]);

//   const emojiRef = useRef<HTMLDivElement>(null);
//   const smileyRef = useRef<HTMLDivElement>(null);
//   const attachmentRef = useRef<HTMLDivElement>(null);
//   const plusRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUserClick = (user: User) => {
//     setSelectedUser(user);
//     setIsEmojiPanelOpen(false);
//     setIsAttachmentPanelOpen(false);
//   };

//   const handleEmojiClick = (emoji: EmojiClickData) => {
//     setMessage(prev => prev + emoji.emoji);
//   };

//   const toggleEmojiPanel = () => {
//     setIsEmojiPanelOpen(prev => !prev);
//     setIsAttachmentPanelOpen(false);
//   };

//   const toggleAttachmentPanel = () => {
//     setIsAttachmentPanelOpen(prev => !prev);
//     setIsEmojiPanelOpen(false);
//   };

//   const handleFileInputClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files);
//       setSelectedFiles([...selectedFiles, ...files]);

//       // Create previews
//       const newPreviews = files.map(file => ({
//         url: URL.createObjectURL(file),
//         type: file.type.startsWith('image/') ? 'image' : 'file',
//         name: file.name
//       }));
//       setFilePreviews([...filePreviews, ...newPreviews]);
//     }
//   };

//   const removeFile = (index: number) => {
//     const newFiles = [...selectedFiles];
//     const newPreviews = [...filePreviews];

//     // Revoke the object URL to avoid memory leaks
//     URL.revokeObjectURL(newPreviews[index].url);

//     newFiles.splice(index, 1);
//     newPreviews.splice(index, 1);

//     setSelectedFiles(newFiles);
//     setFilePreviews(newPreviews);
//   };

//   const handleSendMessage = () => {
//     if ((message.trim() === '' && selectedFiles.length === 0) || !selectedUser) return;

//     let newMessage: Message;

//     if (selectedFiles.length > 0) {
//       if (selectedFiles.length === 1) {
//         // Single file message
//         const file = selectedFiles[0];
//         newMessage = {
//           id: generateId(),
//           sender: 'me',
//           text: message,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: 'sent',
//           type: file.type.startsWith('image/') ? 'image' : 'file',
//           content: URL.createObjectURL(file),
//           fileName: file.name
//         };
//       } else {
//         // Multiple files message (gallery)
//         // const allImages = selectedFiles.every(f => f.type.startsWith('image/'));
//         newMessage = {
//           id: generateId(),
//           sender: 'me',
//           text: message,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: 'sent',
//           type: 'gallery',
//           content: selectedFiles.map(f => URL.createObjectURL(f)),
//           fileName: selectedFiles.map(f => f.name)
//         };
//       }
//     } else {
//       // Text message
//       newMessage = {
//         id: generateId(),
//         sender: 'me',
//         text: message,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         status: 'sent',
//         type: 'text'
//       };
//     }

//     const simulateReply = (user: User) => {
//       const replies = [
//         "Thanks for your message!",
//         "I'll get back to you soon.",
//         "Interesting point!",
//         "Can we discuss this tomorrow?",
//         "I appreciate your feedback.",
//         "Let me check and confirm.",
//         "Sounds good to me!",
//         "I'm currently busy, will reply properly later."
//       ];

//       const replyMessage = replies[Math.floor(Math.random() * replies.length)];

//       const newMessage: Message = {
//         id: generateId(),
//         sender: 'them',
//         text: replyMessage,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         status: 'delivered', // Explicitly cast to the correct literal type
//         type: 'text'
//       };

//       const updatedUser = {
//         ...user,
//         status: 'typing',
//         messages: [...user.messages, newMessage],
//         lastMessage: replyMessage,
//         time: 'Just now'
//       };

//       setSelectedUser({ ...updatedUser, status: updatedUser.status as 'online' | 'offline' | 'typing' });
//       updateUsersList({ ...updatedUser, status: updatedUser.status as 'typing' | 'online' | 'offline' });

//       // Show typing indicator for 1-2 seconds before message appears
//       setTimeout(() => {
//         setSelectedUser(prev => ({
//           ...prev,
//           status: 'online'
//         }));

//         const updatedUsers = usersList.map(u =>
//           u.id === updatedUser.id ? { ...u, status: 'online' } : u
//         );
//         setUsersList(updatedUsers as User[]);
//       }, 1000 + Math.random() * 1000);
//     };

//     const updatedUser = {
//       ...selectedUser,
//       messages: [...selectedUser.messages, newMessage],
//       lastMessage: newMessage.text || (newMessage.type === 'image' ? 'Photo' :
//         newMessage.type === 'gallery' ? `${selectedFiles.length} files` :
//           `File: ${newMessage.fileName}`),
//       time: 'Just now'
//     };

//     setSelectedUser(updatedUser);
//     updateUsersList(updatedUser);
//     setMessage('');
//     setSelectedFiles([]);
//     setFilePreviews([]);
//     setIsTyping(false);

//     // Simulate reply after 1-3 seconds
//     if (Math.random() > 0.3) {
//       setTimeout(() => {
//         simulateReply(updatedUser);
//       }, 1000 + Math.random() * 2000);
//     }
//   };

//   const updateUsersList = (updatedUser: User) => {
//     const updatedUsers = usersList.map(user =>
//       user.id === updatedUser.id ? updatedUser : user
//     );
//     setUsersList(updatedUsers.map(user => ({
//       ...user,
//       status: user.status as 'typing' | 'online' | 'offline'
//     })));
//   };

//   const filteredUsers = usersList.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setMessage(e.target.value);

//     // Show typing indicator if user starts typing
//     if (e.target.value.length > 0 && !isTyping) {
//       setIsTyping(true);

//       // Update the selected user's status in the users list
//       const updatedUsers = usersList.map(user =>
//         user.id === selectedUser.id ? { ...user, status: 'typing' } : user
//       );
//       setUsersList(updatedUsers.map(user => ({
//         ...user,
//         status: user.status as 'typing' | 'online' | 'offline'
//       })));
//     } else if (e.target.value.length === 0 && isTyping) {
//       setIsTyping(false);

//       // Reset the typing status
//       const updatedUsers = usersList.map(user =>
//         user.id === selectedUser.id ? { ...user, status: 'online' } : user
//       );
//       setUsersList(updatedUsers.map(user => ({
//         ...user,
//         status: user.status as 'online' | 'offline' | 'typing'
//       })));
//     }
//   };

//   // Close panels on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         (emojiRef.current && !emojiRef.current.contains(event.target as Node) &&
//           smileyRef.current && !smileyRef.current.contains(event.target as Node)) ||
//         (attachmentRef.current && !attachmentRef.current.contains(event.target as Node) &&
//           plusRef.current && !plusRef.current.contains(event.target as Node)
//         )) {
//         setIsEmojiPanelOpen(false);
//         setIsAttachmentPanelOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // // Auto-scroll to bottom of messages
//   // useEffect(() => {
//   //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   // }, [selectedUser.messages]);

//   // Update message status to "read" when viewing messages
//   useEffect(() => {
//     const updatedMessages = selectedUser.messages.map(msg =>
//       msg.sender === 'them' && msg.status !== 'read'
//         ? { ...msg, status: 'read' }
//         : msg
//     );

//     if (updatedMessages.some(msg => msg.status !== selectedUser.messages.find(m => m.id === msg.id)?.status)) {
//       const updatedUser = {
//         ...selectedUser,
//         messages: updatedMessages
//       };
//       setSelectedUser(updatedUser as User);
//       updateUsersList({
//         ...updatedUser,
//         messages: updatedUser.messages.map(msg => ({
//           ...msg,
//           status: msg.status as 'sent' | 'delivered' | 'read'
//         }))
//       });
//     }
//   }, [selectedUser.messages]);

//   const clearChat = () => {
//     const updatedUser = {
//       ...selectedUser,
//       messages: [], // Clear all messages
//       lastMessage: '', // Clear last message
//       time: '' // Clear time
//     };

//     setSelectedUser(updatedUser);

//     // Also update the usersList to reflect this change
//     const updatedUsers = usersList.map(user =>
//       user.id === updatedUser.id ? updatedUser : user
//     );
//     setUsersList(updatedUsers);
//   };

//   const renderMessageContent = (msg: Message) => {
//     switch (msg.type) {
//       case 'image':
//         return (
//           <div className="image-message">
//             <img src={msg.content as string} alt="Sent content" className="message-image" />
//             {msg.text && <p>{msg.text}</p>}
//           </div>
//         );
//       case 'file':
//         return (
//           <div className="file-message">
//             <div className="file-container">
//               <FaPaperclip size={16} />
//               <a href={msg.content as string} download={msg.fileName as string} className="file-link">
//                 {msg.fileName as string}
//               </a>
//             </div>
//             {msg.text && <p>{msg.text}</p>}
//           </div>
//         );
//       case 'gallery':
//         const galleryImages = msg.content as string[];
//         const totalImages = galleryImages.length;
//         const displayImages = totalImages > 4 ? galleryImages.slice(0, 3) : galleryImages;

//         return (
//           <div className="gallery-message">
//             <div className="gallery-grid">
//               {displayImages.map((url, index) => (
//                 <div key={index} className="gallery-item">
//                   <img src={url} alt={`Gallery item ${index}`} />
//                 </div>
//               ))}
//               {totalImages > 4 && (
//                 <div
//                   className="gallery-item count-item"
//                   onClick={() => {
//                     setCurrentGallery(galleryImages);
//                     setIsGalleryOpen(true);
//                   }}
//                 >
//                   <div className="gallery-count">+{totalImages - 3}</div>
//                   <img src={galleryImages[3]} alt="Gallery item" />
//                 </div>
//               )}
//             </div>
//             {msg.text && <p>{msg.text}</p>}
//           </div>
//         );
//       default:
//         return <p>{msg.text}</p>;
//     }
//   };


//   const renderStatusIcon = (status: Message['status']) => {
//     switch (status) {
//       case 'sent':
//         return <FaCheck size={12} color="#94A3B8" />;
//       case 'delivered':
//         return <FaCheckDouble size={12} color="#3B82F6" />;
//       case 'read':
//         return <FaCheckDouble size={12} color="#1D4ED8" />;
//       default:
//         return null;
//     }
//   };

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
//                 <div className="avatar-container">
//                   <img src={user.avatar} alt="avatar" className="avatar" />
//                   <div className={`status-indicator ${user.status}`}>
//                     {user.status === 'typing' && <div className="typing-dots"><div></div><div></div><div></div></div>}
//                   </div>
//                 </div>
//                 <div className="chat-info">
//                   <div className="chatName">{user.name}</div>
//                   <div className="chatMessage">
//                     {user.status === 'typing' ? 'typing...' : user.lastMessage}
//                   </div>
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
//           <div className="header-left">
//             <div className="avatar-container">
//               <img src={selectedUser.avatar} alt="avatar" className="avatar" />
//               <div className={`status-indicator ${selectedUser.status}`}>
//                 {selectedUser.status === 'typing' && <div className="typing-dots"><div></div><div></div><div></div></div>}
//               </div>
//             </div>
//             <div className="user-info">
//               <div className="chatName">{selectedUser.name}</div>
//               <div className="onlineStatus">
//                 {selectedUser.status === 'online' ? 'Online' :
//                   selectedUser.status === 'offline' ? 'Offline' : 'Typing...'}
//               </div>
//             </div>
//           </div>

//           <div className="header-right">
//             {/* Voice Call Button */}
//             <button className="header-button" title="Voice call">
//               <FaPhone size={18} color="#009693" />
//             </button>

//             {/* Video Call Button */}
//             <button className="header-button" title="Video call">
//               <FaVideo size={18} color="#009693" />
//             </button>

//             {/* More Options Menu */}
//             <div className="chatheader-dropdown">
//               <button className="header-button" title="More options">
//                 <FaEllipsisH size={18} color="#009693" />
//               </button>
//               <div className="chatheader-dropdown-content">
//                 <button className="dropdown-item">
//                   <FaUserPlus size={14} /> Add to contacts
//                 </button>
//                 <button className="dropdown-item" onClick={clearChat}>
//                   <FaTrash size={14} /> Clear chat
//                 </button>
//                 <button className="dropdown-item">
//                   <FaBan size={14} /> Block user
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="chatMessages">
//           {selectedUser.messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={msg.sender === 'me' ? 'messageRight' : 'messageLeft'}
//             >
//               {renderMessageContent(msg)}
//               <div className="message-meta">
//                 <span className="timestamp">{msg.time}</span>
//                 {msg.sender === 'me' && (
//                   <span className="message-status">
//                     {renderStatusIcon(msg.status)}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//           {isGalleryOpen && (
//             <div className="gallery-popup">
//               <div className="gallery-popup-header">
//                 <button
//                   className="close-gallery"
//                   onClick={() => setIsGalleryOpen(false)}
//                 >
//                   <FaTimes size={20} />
//                 </button>
//                 <div className="gallery-title">
//                   {currentGallery.length} Photos
//                 </div>
//               </div>
//               <div className="gallery-popup-content">
//                 {currentGallery.map((url, index) => (
//                   <div key={index} className="gallery-popup-item">
//                     <img src={url} alt={`Gallery item ${index}`} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         {/* File preview area */}
//         {filePreviews.length > 0 && (
//           <div className="file-preview-container">
//             <div className="file-previews">
//               {filePreviews.map((preview, index) => (
//                 <div key={index} className="file-preview">
//                   {preview.type === 'image' ? (
//                     <img src={preview.url} alt={`Preview ${index}`} />
//                   ) : (
//                     <div className="file-preview-document">
//                       <FaPaperclip size={24} />
//                       <span>{preview.name}</span>
//                     </div>
//                   )}
//                   <button
//                     className="remove-file-btn"
//                     onClick={() => removeFile(index)}
//                   >
//                     <FaTimes size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="inputBox">
//           <div className="message-input-container">
//             <div ref={plusRef} onClick={toggleAttachmentPanel} className="icon-button">
//               <FaPlus size={16} color="#009693" />
//             </div>

//             {isAttachmentPanelOpen && (
//               <div className="attachment-panel" ref={attachmentRef}>
//                 <div className="attachment-option" onClick={handleFileInputClick}>
//                   <FaPaperclip size={18} />
//                   <span>File</span>
//                 </div>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   style={{ display: 'none' }}
//                   accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
//                   multiple
//                 />
//               </div>
//             )}

//             <input
//               type="text"
//               value={message}
//               onChange={handleInputChange}
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
//           <span ref={smileyRef} onClick={toggleEmojiPanel} className="icon-button">
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
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaSearch, FaSmile } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';
import { useFetchConversationsQuery } from '@/slices/chat/chatApi';

// Interfaces
interface SenderReceiver {
  id: number | null;
  name: string;
  last_read: string | null;
}

interface ChatListItem {
  user_id: number | null;
  name: string;
  last_message: string | null;
  last_message_time?: string | null;
  sender: SenderReceiver;
  receiver: SenderReceiver;
  messages?: { text: string; time: string; sender: string }[]; // Add messages here for demo
}

function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<ChatListItem | null>(null);
  const { data } = useFetchConversationsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
  const [message, setMessage] = useState('');
  const emojiRef = useRef<HTMLDivElement>(null);
  const smileyRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleUserClick = (user: ChatListItem) => {
    setSelectedUser(user);
  };

  // Filter by receiver name (assuming the current user is sender)
  const filteredUsers: ChatListItem[] = (data?.data || []).filter(
    (user: ChatListItem) =>
      user.last_message &&
      (user.receiver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.sender.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage(prev => prev + emoji.emoji);
  };

  const toggleEmojiPanel = () => {
    setIsEmojiPanelOpen(prev => !prev);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle sending message logic here
    setMessage('');
  };

  // Assume "chat partner" is whoever is NOT the current user.
  const getChatPartner = (chat: ChatListItem): SenderReceiver => {
    const currentUserId = 1; // Replace with actual logged-in user ID
    return chat.sender.id === currentUserId ? chat.receiver : chat.sender;
  };

  useEffect(() => {
    if (!selectedUser && filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
    }
  }, [filteredUsers, selectedUser]);

  return (
    <div className="chat-page">
      <div className="chatSidebar">
        <div className="chatsidebar-header">
          <div className="searchInputContainer">
            <FaSearch size={14} color="#009693" />
            <input
              type="text"
              placeholder="Search users..."
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span><FaPlus size={15} color="#fff" /></span>
        </div>

        <div className="chatList">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((chat, index) => {
              const chatPartner = getChatPartner(chat);
              return (
                <div
                  key={index}
                  className={`chatItem ${selectedUser?.user_id === chat.user_id ? 'selected' : ''}`}
                  onClick={() => handleUserClick(chat)}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="avatar"
                    className="avatar"
                  />
                  <div>
                    <div className="chatName">{chatPartner.name}</div>
                    <div className="chatMessage">{chat.last_message}</div>
                  </div>
                  <div className="chatTime">{chat.last_message_time}</div>
                </div>
              );
            })
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
      <div className="chatArea">
        <div className="chatHeader">
          <div className="header-left">
            <div className="avatar-container">
              {selectedUser && (
                <>
                  <h1>{getChatPartner(selectedUser).name.charAt(0).toUpperCase()}</h1>
                  <div>
                    <div className="chatName">{getChatPartner(selectedUser).name}</div>
                    <div className="onlineStatus">Online</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="chatMessages">
          {selectedUser?.messages?.map((msg, index) => (
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
    </div>
  );
}

export default ChatPage