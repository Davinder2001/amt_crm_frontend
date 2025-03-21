interface StoreItem {
    id: number;
    sr_no: number;
    name: string;
    quantity: number;
    price: number;
}

interface StoreResponse {
    data: StoreItem[];
}

interface CreateStoreItemRequest {
    name: string;
    quantity: number;
    price: number;
}
interface OcrResponse {
    message: string;
    imageUrl?: string;
}