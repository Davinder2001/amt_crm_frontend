// src/types/StoreVendor.ts

export interface Vendor {
    id: number;
    company_id: number;
    vendor_name: string;
    created_at: string;
    updated_at: string;
  }
  
  export type VendorsResponse = Vendor[];
  
  export interface CreateVendorRequest {
    vendor_name: string;
  }
  