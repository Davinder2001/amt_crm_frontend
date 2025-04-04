// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useFetchEmployesQuery } from '@/slices/employe/employe';
// import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
// import Link from 'next/link';
// import { useCompany } from '@/utils/Company';

// const HrHeroSection = () => {
//   const { data: employeesData } = useFetchEmployesQuery();
//   const employees = employeesData?.employees || [];
//   const totalEmployees = employeesData?.total || 0;
//   const activeEmployees = employees.filter((emp) => emp.user_status === 'active');
//   // const { companySlug } = useCompany();

//   return (
//     <div className="hr-hero-section">
//       {/* Left Section - Time & Attendance */}
//       <TimeSection />

//       {/* Middle Section - Stats Overview */}
//       <div className="stats-overview">
//         <StatCard icon={<FaUsers />} value={totalEmployees} label="Total Employees" />
//         <StatCard icon={<FaCheckCircle />} value="360" label="On Time" />
//         <StatCard icon={<FaTimesCircle />} value="30" label="Absent" />
//         <StatCard icon={<FaClock />} value="62" label="Late Arrival" />
//       </div>

//       {/* Right Section - Recent Active Employees */}
//       <div className="recent-employees">
//         <h3>Recent Active Employees</h3>
//         <ul>
//           {activeEmployees.slice(0, 5).map((employee) => (
//             <li key={employee.id}>
//               <div className="avatar">{employee.name.charAt(0)}</div>
//               <div className="info">
//                 <p>{employee.name}</p>
//                 <span className="active">{employee.user_status}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Internal CSS */}
//       <style jsx>{`
//         .hr-hero-section {
//           display: flex;
//           justify-content: space-between;
//           gap: 20px;
//           padding: 30px;
//           background: #f7f9fc;
//           border-radius: 10px;
//         }

//         .stats-overview {
//           display: grid;
//           width: 100%;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 15px;
//         }

//         .recent-employees {
//           background: white;
//           padding: 15px;
//           border-radius: 8px;
//         }

//         ul {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }

//         li {
//           display: flex;
//           align-items: center;
//           padding: 8px 0;
//           border-bottom: 1px solid #eee;
//         }

//         .avatar {
//           width: 35px;
//           height: 35px;
//           border-radius: 50%;
//           background: #007bff;
//           color: white;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           margin-right: 10px;
//         }

//         .info p {
//           margin: 0;
//           font-weight: bold;
//         }

//         .active {
//           color: green;
//         }
//       `}</style>
//     </div>
//   );
// };

// // TimeSection component for the time logic
// const TimeSection = React.memo(() => {
//   const [dateTime, setDateTime] = useState(new Date());
//   const { companySlug } = useCompany();
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDateTime(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const formatTime = (date: Date) => {
//     return date.toLocaleTimeString('en-IN', { hour12: true });
//   };

//   const formatDay = (date: Date) => {
//     const day = date.getDate();
//     const suffix =
//       day % 10 === 1 && day !== 11
//         ? 'st'
//         : day % 10 === 2 && day !== 12
//           ? 'nd'
//           : day % 10 === 3 && day !== 13
//             ? 'rd'
//             : 'th';
//     return `${day}${suffix}`;
//   };

//   return (
//     <div className="time-section">
//       <p className="time">{formatTime(dateTime)}</p>
//       <p className="date">
//         Today: {formatDay(dateTime)}{' '}
//         {dateTime.toLocaleString('default', { month: 'long' })} {dateTime.getFullYear()}
//       </p>
//       <Link className="attendance-btn" href={`/${companySlug}/hr/view-attendence`}>
//         View Attendance
//       </Link>
//       <style jsx>{`
//         .time-section {
//           background: white;
//           padding: 15px;
//           border-radius: 8px;
//           text-align: center;
//         }

//         .time {
//           font-size: 18px;
//           font-weight: bold;
//         }

//         .date {
//           color: gray;
//         }

//         .attendance-btn {
//           margin-top: 10px;
//           background: #007bff;
//           color: white;
//           padding: 8px 12px;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         }
//       `}</style>
//     </div>
//   );
// });
// TimeSection.displayName = 'TimeSection'; 

// // Reusable Stat Card Component
// const StatCard = React.memo(({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => {
//   // const { companySlug } = useCompany();
//   return (
//     <>
//       <div className="stat-card">
//         {icon}
//         <div>
//           <h2>{value}</h2>
//           <p>{label}</p>
//         </div>
//         <style jsx>{`
//       .stat-card {
//         display: flex;
//         align-items: center;
//         background: white;
//         padding: 15px;
//         border-radius: 8px;
//         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//       }

//       .stat-card h2 {
//         margin: 0;
//         font-size: 20px;
//       }

//       .stat-card p {
//         margin: 0;
//         color: gray;
//         font-size: 14px;
//       }
//     `}</style>
//       </div>
//     </>
//   )
// }
// );
// StatCard.displayName = 'StatCard';
 
// export default HrHeroSection;













'use client';
import React, { useEffect, useState } from 'react';
import { useFetchEmployesQuery } from '@/slices/employe/employe';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

const HrHeroSection = () => {
  const { data: employeesData } = useFetchEmployesQuery();
  const employees = employeesData?.employees || [];
  const totalEmployees = employeesData?.total || 0;
  const activeEmployees = employees.filter((emp) => emp.user_status === 'active');
  // const { companySlug } = useCompany();

  return (
    <div className="hr-hero-section">
     <div className="time_stats_container"> {/* Left Section - Time & Attendance */}
      <TimeSection />

      {/* Middle Section - Stats Overview */}
      <div className="stats-overview">
        <StatCard icon={<FaUsers />} value={totalEmployees} label="Total Employees" />
        <StatCard icon={<FaCheckCircle />} value="360" label="On Time" />
        <StatCard icon={<FaTimesCircle />} value="30" label="Absent" />
        <StatCard icon={<FaClock />} value="62" label="Late Arrival" />
      </div>
      </div>
      {/* Right Section - Recent Active Employees */}
      <div className="recent-active-employees">
        <h3>Recent Active Employees</h3>
        <ul>
          {activeEmployees.slice(0, 5).map((employee) => (
            <li key={employee.id}>
              <div className="avatar">{employee.name.charAt(0)}</div>
              <div className="info">
                <p>{employee.name}</p>
                <span className="active">{employee.user_status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

// TimeSection component for the time logic
const TimeSection = React.memo(() => {
  const [dateTime, setDateTime] = useState(new Date());
  const { companySlug } = useCompany();
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour12: true });
  };

  const formatDay = (date: Date) => {
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';
    return `${day}${suffix}`;
  };

  return (
    <div className="time-section">
      <p className="time">{formatTime(dateTime)}</p>
      <p className="date">
        Today: {formatDay(dateTime)}{' '}
        {dateTime.toLocaleString('default', { month: 'long' })} {dateTime.getFullYear()}
      </p>
      <Link className="attendance-btn" href={`/${companySlug}/hr/view-attendence`}>
        View Attendance
      </Link>
      <style jsx>{`
      


        

        .attendance-btn {
          margin-top: 10px;
          background: #007bff;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
});
TimeSection.displayName = 'TimeSection'; 

// Reusable Stat Card Component
const StatCard = React.memo(({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => {
  // const { companySlug } = useCompany();
  return (
    <>
      <div className="stat-card">
        
        <div>
          <h2>{value}</h2>
          <p>{label}</p>
        </div>
        {icon}
        <style jsx>{`
      


      .stat-card p {
        margin: 0;
        color: gray;
        font-size: 14px;
      }
    `}</style>
      </div>
    </>
  )
}
);
StatCard.displayName = 'StatCard';
 
export default HrHeroSection;
