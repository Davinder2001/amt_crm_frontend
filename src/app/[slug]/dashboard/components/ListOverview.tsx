// "use client";
// import React from "react";
// import { useFetchUsersQuery } from "@/slices/users/userApi"; // Import the hook
// import { FaMoneyBillWave, FaShoppingCart, FaWallet, FaTasks, FaClipboardList, FaHandHoldingUsd, FaUserPlus, FaUsers, FaStore, FaUserFriends, FaSpinner } from "react-icons/fa";

// const ListOverview = () => {
//     // Fetch users data from the API
//     const { data, error, isLoading } = useFetchUsersQuery();

//     // Check if data is fetched and count the number of users
//     const EmployeeCount = data ? data.users.length : 0;

//     return (
//         <div className="dashboard-container">
//             {error ? (
//                 <p style={{ color: "red" }}>Error fetching users.</p>
//             ) : (
//                 <div className="grid-container">
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaMoneyBillWave color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Revenue</p>
//                             <h3 className="value-count">₹350.4</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaShoppingCart color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Sales</p>
//                             <h3 className="value-count">₹574.34</h3>
//                             <span className="green">+23% since last month</span>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaWallet color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Expenses</p>
//                             <h3 className="value-count expenses">₹874.34</h3>
//                             <span className="green">+40% since last month</span>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaTasks color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Task</p>
//                             <h3 className="value-count">642.39</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaClipboardList color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Order</p>
//                             <h3 className="value-count">154</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaHandHoldingUsd color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Earning</p>
//                             <h3 className="value-count">₹10,000</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaUserPlus color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>New Customer</p>
//                             <h3 className="value-count">950</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaUsers color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Employees</p>
//                             <h3 className="value-count">{isLoading ? <FaSpinner className="item-loader" /> : EmployeeCount}</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaStore color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Vendor</p>
//                             <h3 className="value-count">600</h3>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <span className="icon-shell">
//                             <FaUserFriends color="#009693" size={20} />
//                         </span>
//                         <div>
//                             <p>Total Customer</p>
//                             <h3 className="value-count">2935</h3>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <style jsx>{`
//         .grid-container {
//           display: grid;
//           grid-template-columns: repeat(5, 1fr);
//           gap: 15px;
//         }
//         .card {
//           background: white;
//           padding: 10px 15px;
//           border-radius: 12px;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }
//         .icon-shell {
//           background-color: #f1f9f9;
//           padding: 10px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 50px;
//           height: 50px;
//         }
//         .red,{
//           color: red;
//         }
//         .expenses {
//            color: #FF7F50;
//           }
//         .green {
//           color: green;
//         }
//         .red,.green{
//         font-size: 10px;
//         }
//         p {
//           margin: 0;
//           color: #6b7280;
//           font-size: 14px;
//         }
//         h3 {
//           margin: 5px 0;
//           font-size: 20px;
//         }
//         .item-loader {
//             animation: loadItem 1s linear infinite;
//             font-size: 18px;
//             display: inline-block;
//         }
//         @keyframes loadItem {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default ListOverview;














"use client";
import React from "react";
import { useFetchUsersQuery } from "@/slices/users/userApi";
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

const ListOverview = () => {
  const { data, error, isLoading } = useFetchUsersQuery();
  const EmployeeCount = data ? data.users.length : 0;

  return (
    <div className="dashboard-container">
      {error ? (
        <div className="error-box">
          <p>Error fetching users.</p>
        </div>
      ) : (
        <div className="grid-container">
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

      <style jsx>{`
        .dashboard-container {
          padding: 20px 0px;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .card {
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-3px);
        }
        .icon-shell {
          background-color: #f1f9f9;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
        }
        .value-count {
          font-size: 22px;
          font-weight: bold;
        }
        .expenses {
          color: #ff7f50;
        }
        .green {
          color: green;
          font-size: 12px;
        }
        p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
        }
        .error-box {
          background: #ffcccc;
          padding: 10px;
          color: red;
          text-align: center;
          border-radius: 8px;
          font-weight: bold;
        }
        .item-loader {
          animation: loadItem 1s linear infinite;
          font-size: 18px;
          display: inline-block;
        }
        @keyframes loadItem {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ListOverview;
