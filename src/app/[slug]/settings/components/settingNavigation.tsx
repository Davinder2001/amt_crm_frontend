// import React from 'react'
// import Link from 'next/link';


// const SettingNavigation = () => {
//     return (
//         <>
//             <ul className=''>
//                 <li className=''>
//                     <Link href="settings/store-settings">Store Settings</Link>
//                 </li>
//                 <li className=''>
//                     <Link href="settings/shifts">Shifts</Link>
//                 </li>
//                 <li className=''>
//                     <Link href="settings/taxes">Taxes</Link>
//                 </li>
//             </ul>
//         </>
//     )
// }

// export default SettingNavigation






import React, { useState } from 'react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';

const settingItems = [
  { label: 'Store Settings', href: './settings/store-settings' },
  { label: 'Shifts', href: './settings/shifts' },
  { label: 'Taxes', href: './settings/taxes' },
];

const SettingNavigation = () => {
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (label: string) => {
    setToggles((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="settings-wrapper">
      <ul className="settings-list">
        {settingItems.map((item) => (
          <li key={item.label} className="settings-item">
            <div className="settings-info">
              {/* Left side: label + icon */}
              <div className="settings-info-inner">
                <Link href={item.href} className="settings-link">
                  {item.label}
                </Link>
                <div className='settings-btn-outer'>
                <Link href={item.href} className="settings-icon" aria-label={`Open ${item.label}`}>
                  <FaCog />
                </Link>
              </div>
</div>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingNavigation;
