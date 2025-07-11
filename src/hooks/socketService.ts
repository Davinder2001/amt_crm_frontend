import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('https://amt.sparkweb.sbs');
    }

    public connect() {
        this.socket.connect();
        this.socket.on('disconnect', () => {
            setTimeout(() => {
                this.socket.connect();
            }, 3000);
        });
    }

    public disconnect() {
        this.socket.disconnect();
    }

    public onMessage(callback: (message: ChatMessage) => void) {
        this.socket.on('message', callback);
    }

    public onUserStatusChange(callback: (status: UserStatus) => void) {
        this.socket.on('userStatus', callback);
    }

    public sendMessage(message: { recipient_id: number; body: string }) {
        this.socket.emit('message', message);
    }
}

const socketService = new SocketService();
export default socketService;
