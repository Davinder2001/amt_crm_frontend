"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaWallet,
  FaTasks,
  FaClipboardList,
  FaHandHoldingUsd,
  FaUserPlus,
  FaUsers,
  FaStore,
  FaUserFriends,
  FaSpinner,
} from "react-icons/fa";
import { useFetchEmployesQuery } from "@/slices/employe/employe";
import { useCompany } from "@/utils/Company";

const ListOverview = () => {
  const { data, error, isLoading } = useFetchEmployesQuery();
  const EmployeeCount = data ? data.employees.length : 0;
  const router = useRouter();
  const { companySlug } = useCompany();

  const cards = [
    { label: "Sales", value: "₹574.34", extra: "+23% since last month", icon: FaShoppingCart, type: "sales", link: "/sales" },
    { label: "Expenses", value: "₹874.34", extra: "+40% since last month", icon: FaWallet, type: "expenses", link: "/expenses" },
    { label: "Revenue", value: "₹350.4", icon: FaMoneyBillWave, type: "revenue", link: "/revenue" },
    { label: "Task", value: "642.39", icon: FaTasks, type: "tasks", link: "/tasks" },
    { label: "Orders", value: "154", icon: FaClipboardList, type: "orders", link: "/orders" },
    { label: "Earning", value: "₹10,000", icon: FaHandHoldingUsd, type: "earnings", link: "/earnings" },
    { label: "New Customer", value: "950", icon: FaUserPlus, type: "customers", link: "/customers" },
    {
      label: "Employees",
      value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount,
      icon: FaUsers,
      type: "employees",
      link: "/hr/status-view",
    },
    { label: "Vendor", value: "600", icon: FaStore, type: "vendors", link: "/vendors" },
    { label: "Customer", value: "2935", icon: FaUserFriends, type: "customers", link: "/customers" },
    { label: "Receiveable", value: "2935", icon: FaUserFriends, type: "receivables", link: "/receivables" },
    { label: "Payable", value: "2935", icon: FaUserFriends, type: "payables", link: "/payables" },
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
              <div
                key={index}
                className="card"
                data-card-type={item.type}
                onClick={isClickable ? () => router.push(`/${companySlug}/${item.link}`) : undefined}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                <span className="icon-shell">{<Icon size={20} />}</span>
                <div className="dash-card-content">
                  <p>{item.label}</p>
                  <h3 className="value-count">{item.value}</h3>
                  {item.extra && <span className="green">{item.extra}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListOverview;