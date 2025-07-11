export interface SalesReportItem {
    item_name: string;
    quantity: number;
    sales: number;
}

export interface SalesReportMonth {
    month: string;
    items: SalesReportItem[];
}

export interface SalesReportResponse {
    year: number;
    data: SalesReportMonth[];
}

export interface RevenueReportItem {
    item_name: string;
    revenue: number;
}

export interface RevenueReportMonth {
    month: string;
    items: RevenueReportItem[];
}

export interface RevenueReportResponse {
    year: number;
    data: RevenueReportMonth[];
} 

export interface MonthlySales {
  month: string;
  total_sales: number;
}

export interface MonthlySalesResponse {
  year: number;
  data: MonthlySales[];
}

export interface MonthlyRevenue {
  month: string;
  total_revenue: number;
}

export interface MonthlyRevenueResponse {
  year: number;
  data: MonthlyRevenue[];
}
