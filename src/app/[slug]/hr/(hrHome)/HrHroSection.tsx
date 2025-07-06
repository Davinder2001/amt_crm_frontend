'use client';
import React, { useEffect, useState } from 'react';
import { useFetchEmployesQuery } from '@/slices/employe/employe';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import { useFetchdashboardSummaryQuery } from '@/slices/hr/hr';

const HrHeroSection = () => {
  const { data: employeesData } = useFetchEmployesQuery();
  const employees = employeesData?.employees || [];
  const activeEmployees = employees.filter((emp) => emp.user_status === 'active');
  const { data: dashSummary } = useFetchdashboardSummaryQuery();

  return (
    <div className="hr-hero-wrapper">
      <div className="time-stats-wrapper">
        {/* Left Section - Time */}
        <TimeSection />

        {/* Middle Section - Stats */}
        <div className="stats-grid">
          <StatCard icon={<FaUsers />} value={dashSummary?.summary?.total_employees ?? 0} label="Total Employees" note={`+ ${dashSummary?.summary.total_employees ?? 0} new employees added!`} />
          <StatCard icon={<FaCheckCircle />} value={dashSummary?.summary?.present_today?.length ?? 0} label="Present" note="-10% Less than yesterday" />
          <StatCard icon={<FaTimesCircle />} value={dashSummary?.summary?.absent_today ?? 0} label="Absent" note="+3% Increase than yesterday" />
          <StatCard icon={<FaClock />} value={dashSummary?.lateArrival?.length ?? 0} label="Late Arrival" note="+3% Increase than yesterday" />
          <StatCard icon={<FaSignOutAlt />} value={dashSummary?.early_departures?.length ?? 0} label="Early Departures" note="-10% Less than yesterday" />
          <StatCard icon={<FaCalendarAlt />} value={dashSummary?.monthly_leaves?.length ?? 0} label="Time Off" note="+2% Increase than yesterday" />
        </div>
      </div>
      {/* Right Section - Active Employees */}
      {activeEmployees.length > 0 ?
        <div className="active-employee-box">
          <h3>Recent Active Employee</h3>
          <ul>
            {activeEmployees.slice(0, 5).map((emp) => (
              <li key={emp.id} className="employee-item">
                <div className="emp-avatar">{emp.name.charAt(0).toUpperCase()}</div>
                <div className="emp-info">
                  <p>{emp.name}</p>
                  <span className="emp-status active">Active</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        : ''
      }
    </div>
  );
};

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

  // Calculate progress based on current time
  const secondsInDay = 24 * 60 * 60;
  const secondsPassed =
    dateTime.getHours() * 3600 +
    dateTime.getMinutes() * 60 +
    dateTime.getSeconds();
  const progress = (secondsPassed / secondsInDay) * 100;

  return (
    <div className="time-section">
      <div className="sun-container">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <defs>
            <clipPath id="sun-fill-mask">
              <rect
                x="0"
                y="0"
                width="64"
                height={(100 - progress) / 100 * 64}
              />
            </clipPath>
          </defs>

          {/* Base sun design - gray outline */}
          <g stroke="#ddd" strokeWidth="2" fill="none">
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 32 + Math.cos(angle) * 20;
              const y1 = 32 + Math.sin(angle) * 20;
              const x2 = 32 + Math.cos(angle) * 28;
              const y2 = 32 + Math.sin(angle) * 28;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="32" cy="32" r="14" />
          </g>

          {/* Yellow overlay that decreases with time */}
          <g
            clipPath="url(#sun-fill-mask)"
            stroke="#f2c94c"
            strokeWidth="2"
            fill="none"
          >
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 32 + Math.cos(angle) * 20;
              const y1 = 32 + Math.sin(angle) * 20;
              const x2 = 32 + Math.cos(angle) * 28;
              const y2 = 32 + Math.sin(angle) * 28;
              return (
                <line
                  key={`filled-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="32" cy="32" r="14" fill="#f2c94c" />
          </g>
        </svg>
        <span className="realtime-label">Realtime Insight</span>
      </div>

      <p className="time">{formatTime(dateTime)}</p>
      <p className="date">
        Today: {formatDay(dateTime)}{' '}
        {dateTime.toLocaleString('default', { month: 'long' })}{' '}
        {dateTime.getFullYear()}
      </p>
      <Link className="attendance-btn" href={`/${companySlug}/hr/view-attendance`}>
        View Attendance
      </Link>
    </div>
  );
});
TimeSection.displayName = 'TimeSection';

const StatCard = React.memo(({ icon, value, label, note }: { icon: React.ReactNode; value: string | number; label: string; note: string }) => {
  return (
    <div className="stat-card-box">
      <div className="stat-card-inner">
        <div className="card-left">
          <h2>{value}</h2>
          <p className="label">{label}</p>
        </div>
        <div className="card-icon">{icon}</div>
      </div>
      <p className="note">{note}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';

export default HrHeroSection;
