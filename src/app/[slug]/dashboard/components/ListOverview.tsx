// "use client";
// import React from "react";
// import {
//   FaMoneyBillWave,
//   FaShoppingCart,
//   FaWallet,
//   FaTasks,
//   FaClipboardList,
//   FaHandHoldingUsd,
//   FaUserPlus,
//   FaUsers,
//   FaStore,
//   FaUserFriends,
//   FaSpinner,
// } from "react-icons/fa";
// import { useFetchEmployesQuery } from "@/slices/employe/employe";

// const ListOverview = () => {
//   const { data, error, isLoading } = useFetchEmployesQuery();
//   const EmployeeCount = data ? data.employees.length : 0;

//   return (
//     <div className="dashboard-container">
//       {error ? (
//         <div className="error-box">
//           <p>Error fetching users.</p>
//         </div>
//       ) : (
//         <div className="overview-grid-container">
//           {[
//             { label: "Total Revenue", value: "₹350.4", icon: FaMoneyBillWave },
//             { label: "Total Sales", value: "₹574.34", extra: "+23% since last month", icon: FaShoppingCart },
//             { label: "Total Expenses", value: "₹874.34", extra: "+40% since last month", icon: FaWallet, className: "expenses" },
//             { label: "Total Task", value: "642.39", icon: FaTasks },
//             { label: "Total Order", value: "154", icon: FaClipboardList },
//             { label: "Total Earning", value: "₹10,000", icon: FaHandHoldingUsd },
//             { label: "New Customer", value: "950", icon: FaUserPlus },
//             { label: "Total Employees", value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount, icon: FaUsers },
//             { label: "Total Vendor", value: "600", icon: FaStore },
//             { label: "Total Customer", value: "2935", icon: FaUserFriends },
//             { label: "Receiveable", value: "2935", icon: FaUserFriends },
//             { label: "Payable", value: "2935", icon: FaUserFriends },
//           ].map((item, index) => (
//             <div key={index} className="card">
//               <span className="icon-shell">
//                 <item.icon color="#009693" size={20} />
//               </span>
//               <div className="dash-card-content">
//                 <p>{item.label}</p>
//                 <h3 className={`value-count ${item.className || ""}`}>{item.value}</h3>
//                 {item.extra && <span className="green">{item.extra}</span>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListOverview;











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
    { label: "Total Revenue", value: "₹350.4", icon: FaMoneyBillWave, type: "revenue", link: "/revenue" },
    { label: "Total Sales", value: "₹574.34", extra: "+23% since last month", icon: FaShoppingCart, type: "sales", link: "/sales" },
    { label: "Total Expenses", value: "₹874.34", extra: "+40% since last month", icon: FaWallet, type: "expenses", link: "/expenses" },
    { label: "Total Task", value: "642.39", icon: FaTasks, type: "tasks", link: "/tasks" },
    { label: "Total Order", value: "154", icon: FaClipboardList, type: "orders", link: "/orders" },
    { label: "Total Earning", value: "₹10,000", icon: FaHandHoldingUsd, type: "earnings", link: "/earnings" },
    { label: "New Customer", value: "950", icon: FaUserPlus, type: "customers", link: "/customers" },
    {
      label: "Total Employees",
      value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount,
      icon: FaUsers,
      type: "employees",
      link: "/hr/status-view",
    },
    { label: "Total Vendor", value: "600", icon: FaStore, type: "vendors", link: "/vendors" },
    { label: "Total Customer", value: "2935", icon: FaUserFriends, type: "customers", link: "/customers" },
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