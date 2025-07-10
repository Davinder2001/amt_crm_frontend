"use client";
import React from "react";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaWallet,
  FaTasks,
  // FaClipboardList,
  // FaHandHoldingUsd,
  FaFileInvoice,
  FaUsers,
  FaStore,
  FaUserFriends,
  FaSpinner,
} from "react-icons/fa";
import { useFetchEmployesQuery } from "@/slices/employe/employeApi";
import { useCompany } from "@/utils/Company";
import Link from "next/link";

const ListOverview = () => {
  const { data, error, isLoading } = useFetchEmployesQuery();
  const EmployeeCount = data ? data.employees.length : 0
  const { companySlug } = useCompany();

  const cards = [
    { label: "Monthly Sales", value: "₹574.34", icon: FaShoppingCart, type: "sales", link: "sales" },
    { label: "Expenses", value: "₹874.34", icon: FaWallet, type: "expenses", link: "expenditure" },
    { label: "Revenue", value: "₹350.4", icon: FaMoneyBillWave, type: "revenue", link: "revenue" },
    { label: "Task", value: "642.39", icon: FaTasks, type: "tasks", link: "tasks" },
    // { label: "Orders", value: "154", icon: FaClipboardList, type: "orders", link: "/orders" },
    // { label: "Earning", value: "₹10,000", icon: FaHandHoldingUsd, type: "earnings", link: "/earnings" },
    { label: "Invoices", value: "950", icon: FaFileInvoice, type: "invoices", link: "invoices" },
    {
      label: "Employees",
      value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount,
      icon: FaUsers,
      type: "employees",
      link: "hr/status-view",
    },
    { label: "Vendor", value: "600", icon: FaStore, type: "vendors", link: "store/vendors" },
    { label: "Customers", value: "2935", icon: FaUserFriends, type: "customers", link: "invoices/customers" },
    { label: "Receiveable", value: "2935", icon: FaUserFriends, type: "receivables", link: "credits" },
    { label: "Payable", value: "2935", icon: FaUserFriends, type: "payables", link: "payables" },
  ];

  return (
    <div className="dashboard-container">
      {error ? (
        <div className="error-box">
          <p>Error fetching users.</p>
        </div>
      ) : (
        <div className="overview-grid-container">
          {cards.map((item, index) => {
            const Icon = item.icon;
            const isClickable = !!item.link;
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
                  <h3 className="value-count">{item.value}</h3>
                  {/* {item.extra && <span className="green">{item.extra}</span>} */}
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