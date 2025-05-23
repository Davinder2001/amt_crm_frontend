// Define types for your Company and responses (adjust these interfaces as needed)
interface Company {
  id: number;
  name: string;
  company_slug: string;
  company_name: string;
  verification_status: string;
  description?: string;
  company_id: string;
  location?: string;
}

interface CompaniesResponse {
  companies: Company[];
  data: Company[];
}

interface Payment {
  id: number;
  order_id: string;
  user_id: number;
  transaction_id: string;
  payment_status: 'COMPLETED' | 'FAILED' | 'PENDING';
  payment_method: string;
  payment_fail_reason: string | null;
  payment_reason: string;
  transaction_amount: string;
  payment_date: string;
  payment_time: string;
}

interface AdminBillingResponse {
  success: boolean;
  payments: Payment[];
}

type Shift = {
  id: number;
  company_id: number;
  shift_name: string;
  start_time: string;
  end_time: string;
  weekly_off_day: string;
  created_at: string;
  updated_at: string;
};

type ShiftApiResponse = {
  message: string;
  data: Shift[];
};

type CreateShiftPayload = {
  shift_name: string;
  start_time: string;
  end_time: string;
};

type UpdateShiftPayload = {
  id: number;
  shift_name?: string;
  start_time?: string;
  end_time?: string;
};

type Tax = {
  id: number;
  company_id: number;
  name: string;
  rate: number;
  created_at: string;
  updated_at: string;
};

type TaxesResponse = {
  success: boolean;
  data: Tax[];
};
type CreateTaxPayload = {
  name: string;
  rate: number;
};

type UpdateTaxPayload = {
  id: number;
  name?: string;
  rate?: number;
};