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
            { label: "Total Revenue", value: "₹350.4", icon: FaMoneyBillWave, type: "revenue" },
            { label: "Total Sales", value: "₹574.34", extra: "+23% since last month", icon: FaShoppingCart, type: "sales" },
            { label: "Total Expenses", value: "₹874.34", extra: "+40% since last month", icon: FaWallet, type: "expenses" },
            { label: "Total Task", value: "642.39", icon: FaTasks, type: "tasks" },
            { label: "Total Order", value: "154", icon: FaClipboardList, type: "orders" },
            { label: "Total Earning", value: "₹10,000", icon: FaHandHoldingUsd, type: "earnings" },
            { label: "New Customer", value: "950", icon: FaUserPlus, type: "customers" },
            { label: "Total Employees", value: isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount, icon: FaUsers, type: "employees" },
            { label: "Total Vendor", value: "600", icon: FaStore, type: "vendors" },
            { label: "Total Customer", value: "2935", icon: FaUserFriends, type: "customers" },
            { label: "Receiveable", value: "2935", icon: FaUserFriends, type: "receivables" },
            { label: "Payable", value: "2935", icon: FaUserFriends, type: "payables" },
          ].map((item, index) => (
            <div key={index} className="card" data-card-type={item.type}>
              <span className="icon-shell">
                <item.icon size={20} />
              </span>
              <div className="dash-card-content">
                <p>{item.label}</p>
                <h3 className="value-count">{item.value}</h3>
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