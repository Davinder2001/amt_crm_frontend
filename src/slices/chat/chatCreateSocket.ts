// // chatCreateSocket.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import socketService from '@/hooks/socketService';

// // Define the types for your state
// interface ChatState {
//     messages: ChatMessage[];
//     userStatus: Record<string, string>;
// }

// // Initial state
// const initialState: ChatState = {
//     messages: [],
//     userStatus: {},
// };

// // Create the chat slice
// const chatSlice = createSlice({
//     name: 'chat',
//     initialState,
//     reducers: {
//         addMessage(state, action: PayloadAction<ChatMessage>) { 
//             state.messages.push(action.payload);
//         },
//         updateUserStatus(state, action: PayloadAction<{ user_id: string; status: string }>) {
//             const { user_id, status } = action.payload;
//             state.userStatus[user_id] = status;
//         },
//     },
// });

// // Export actions
// export const { addMessage, updateUserStatus } = chatSlice.actions;

// // Start WebSocket connection
// export const startSocketConnection = () => (dispatch: any) => {
//     socketService.connect();

//     socketService.onMessage((message: ChatMessage) => {
//         dispatch(addMessage(message));
//     });

//     socketService.onUserStatusChange((status: UserStatus) => {
//         dispatch(updateUserStatus({ ...status, user_id: status.user_id.toString() }));
//     });
// };

// export default chatSlice.reducer;
