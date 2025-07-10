"use client";
import React from "react";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaWallet,
  FaTasks,
  FaFileInvoice,
  FaUsers,
  FaStore,
  FaUserFriends,
  FaSpinner,
} from "react-icons/fa";
import { useDashboardCardSummaryQuery } from "@/slices";
import { useCompany } from "@/utils/Company";
import Link from "next/link";

interface CardSummary {
  name: string;
  count: number;
}

interface CardItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  type: string;
  link: string;
  name: string;
}

const ListOverview = () => {
  const { data: cardsSummary, error, isLoading } = useDashboardCardSummaryQuery();
  const { companySlug } = useCompany();

  // Create a typed map of card names to their counts
  const cardCounts: Record<string, number> = {};
  if (cardsSummary) {
    cardsSummary.forEach((card: CardSummary) => {
      cardCounts[card.name] = card.count;
    });
  }

  const cards: CardItem[] = [
    { label: "Monthly Sales", icon: FaShoppingCart, type: "sales", link: "sales", name: "Monthly Sales" },
    { label: "Expenses", icon: FaWallet, type: "expenses", link: "expenditure", name: "Expenses" },
    { label: "Revenue", icon: FaMoneyBillWave, type: "revenue", link: "revenue", name: "Revenue" },
    { label: "Task", icon: FaTasks, type: "tasks", link: "tasks", name: "Task" },
    { label: "Invoices", icon: FaFileInvoice, type: "invoices", link: "invoices", name: "Invoices" },
    { label: "Employees", icon: FaUsers, type: "employees", link: "hr/status-view", name: "Employees" },
    { label: "Vendor", icon: FaStore, type: "vendors", link: "store/vendors", name: "Vendor" },
    { label: "Customers", icon: FaUserFriends, type: "customers", link: "invoices/customers", name: "Customers" },
    { label: "Receiveable", icon: FaUserFriends, type: "receivables", link: "credits", name: "Receiveable" },
    { label: "Payable", icon: FaUserFriends, type: "payables", link: "payables", name: "Payable" },
  ];

  return (
    <div className="dashboard-container">
      {error ? (
        <div className="error-box">
          <p>Error fetching dashboard data.</p>
        </div>
      ) : (
        <div className="overview-grid-container">
          {cards.map((item, index) => {
            const Icon = item.icon;
            const isClickable = !!item.link;
            const count = isLoading ? <FaSpinner className="item-loader" /> : (cardCounts[item.name] || 0);

            return (
              <Link
                href={isClickable ? `/${companySlug}/${item.link}` : "#"}
                key={index}
                className="card"
                data-card-type={item.type}
                style={{ cursor: isClickable ? "pointer" : "default" }}
                onClick={!isClickable ? (e) => e.preventDefault() : undefined}
              >
                <span className="icon-shell">{<Icon size={20} />}</span>
                <div className="dash-card-content">
                  <p>{item.label}</p>
                  <h3 className="value-count">{count}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListOverview;