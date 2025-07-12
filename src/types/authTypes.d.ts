interface Meta {
  [key: string]: string | number | boolean | object; // Allow for flexible meta data
}

interface Company {
  id: number; // Updated to number
  admin_id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  created_at: string;
  payment_status: string;
  updated_at: string;
  verification_status: string;
  [key: string]: string | number; // Allow for additional fields
}

interface TransactionDetails {
  merchantOrderId: string;
  orderId: string;
  amount: number;
  state: string;
  paymentMode: string;
  transactionTimeout: number;
  postTransactionWaitTimeout: number;
  isRedirectionEnabled: boolean;
  orderType: string;
}

interface RegisterForm {
  user: UserProfile;
  packageId?: number;
  business_category_id?: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  number: string;
  business_address: string;
  pin_code: string;
  business_proof_type: string;
  business_id: string;
  aadhar_number: string;
  pan_number: string;
  website_url: string;
  business_proof_image_front: File | null;
  business_proof_image_back?: File | null;
  aadhar_image_front: File | null;
  aadhar_image_back: File | null;
  pan_image_front: File | null;
  pan_image_back: File | null;
  office_electricity_bill?: File | null;
  redirect_url?: string;
  transactionDetails?: TransactionDetails;
  orderId?: string;
  token: string;
}

interface SendOtpResponse {
  request_id: string;
}

interface AddCompany {
  company_name: string;
  company_logo?: File | null;
  business_address?: string;
  subscription_type: string | null; // allow null
  pin_code?: string;
  business_proof_type?: string;
  business_id?: string;
  business_proof_front?: File | null;
  business_proof_back?: File | null;
  redirect_url?: string;
  transactionDetails?: TransactionDetails;
  orderId?: string;
  business_category_id: number | null;
  package_id: number,
  categoryId: number,
}



interface UserProfile {
  roles: Role[];
  id: number;
  email: string;
  name: string;
  number: string;
  company_id: number;
  company_name: string;
  company_slug: string;
  meta: Meta;
  user_type: "admin" | "employee" | "user" | "super-admin"; // Union type for user_type
  password: string;
  companies: Company[];
  uid: string;
}

interface UsersResponse {
  message: string;
  user: UserProfile;
  users: UserProfile[];
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee" | "user" | "super-admin";
}

// Response type for fetching selected company
interface SelectedCompanyResponse {
  company_user_role: "admin" | "employee" | "user" | "super-admin";
  selected_company: Profile;
}

interface PackagePlan {
  id?: number;
  name: string;
  annual_price: number;
  three_years_price: number;
  employee_limit: number;
  package_type: 'general' | 'specific';
  user_id: number | null;
  task?: boolean;
  chat?: boolean;
  hr?: boolean;
  details: string[];
  business_categories: BusinessCategory[];
}

interface PackagePlanResponse {
  data: PackagePlan[];
}

interface BusinessCategory {
  id: number;
  name?: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}


interface LoginSession {
  token_id: number;
  token_name: string;
  created_at: string;
  last_used_at: string | null;
}

interface LoginSessionsResponse {
  total_logins: number;
  sessions: LoginSession[];
}