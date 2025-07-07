"use client";
import React from "react";
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
import { useFetchEmployesQuery } from "@/slices";

const ListOverview = () => {
  const { data, error, isLoading } = useFetchEmployesQuery();
  const EmployeeCount = data ? data.employees.length : 0;

  return (
    <div className="dashboard-container">
      {error ? (
        <div className="error-box">
          <p>Error fetching users.</p>
        </div>
      ) : (
        <div className="overview-grid-container">
          {[
            { label: "Total Revenue", value: "₹350.4", icon: FaMoneyBillWave },
            { label: "Total Sales", value: "₹574.34", extra: "+23% since last month", icon: FaShoppingCart },
            { label: "Total Expenses", value: "₹874.34", extra: "+40% since last month", icon: FaWallet, className: "expenses" },
            { label: "Total Task", value: "642.39", icon: FaTasks },
            { label: "Total Order", value: "154", icon: FaClipboardList },
            { label: "Total Earning", value: "₹10,000", icon: FaHandHoldingUsd },
            { label: "New Customer", value: "950", icon: FaUserPlus },
            { label: "Total Employees", value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount, icon: FaUsers },
            { label: "Total Vendor", value: "600", icon: FaStore },
            { label: "Total Customer", value: "2935", icon: FaUserFriends },
          ].map((item, index) => (
            <div key={index} className="card">
              <span className="icon-shell">
                <item.icon color="#009693" size={20} />
              </span>
              <div>
                <p>{item.label}</p>
                <h3 className={`value-count ${item.className || ""}`}>{item.value}</h3>
                {item.extra && <span className="green">{item.extra}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListOverview;
