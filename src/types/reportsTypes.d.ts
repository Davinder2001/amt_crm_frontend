interface SalesReportItem {
  item_name: string;
  quantity: number;
  sales: number;
}

interface SalesReportMonth {
  month: string;
  items: SalesReportItem[];
}

interface SalesReportResponse {
  year: number;
  data: SalesReportMonth[];
}

interface RevenueReportItem {
  item_name: string;
  revenue: number;
}

interface RevenueReportMonth {
  month: string;
  items: RevenueReportItem[];
}

interface RevenueReportResponse {
  year: number;
  data: RevenueReportMonth[];
}

interface MonthlySales {
  month: string;
  total_sales: number;
}

interface MonthlySalesResponse {
  year: number;
  data: MonthlySales[];
}

interface MonthlyRevenue {
  month: string;
  total_revenue: number;
}

interface MonthlyRevenueResponse {
  year: number;
  data: MonthlyRevenue[];
}

interface TopSellingItem {
  item_name: string;
  total_quantity: number;
  total_sales: number;
}

interface TopSellingItemsResponse {
  year: number;
  top_items: TopSellingItem[];
}
