import React, { useState } from 'react';
import { FaUmbrellaBeach, FaCalendarAlt } from 'react-icons/fa';
import LeaveList from './Leaves/LeaveList';
import HolidayList from './holidays/HolidayList';

const LeavesAndHolidays: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="leave-holiday-container">
      <div className="tabs">
        <button
          className={activeTab === 0 ? 'tab active' : 'tab'}
          onClick={() => setActiveTab(0)}
        >
          <FaUmbrellaBeach style={{ marginRight: 5 }} />
          Leaves
        </button>
        <button
          className={activeTab === 1 ? 'tab active' : 'tab'}
          onClick={() => setActiveTab(1)}
        >
          <FaCalendarAlt style={{ marginRight: 5 }} />
          Holidays
        </button>
        
      </div>

      <div className="setting-tab-contenttab-content">
        {activeTab === 0 && <LeaveList />}
        {activeTab === 1 && <HolidayList />}
      </div>
    </div>
  );
};

export default LeavesAndHolidays;
