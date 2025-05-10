import React from 'react'
import Link from 'next/link';


const SettingNavigation = () => {
    return (
        <>
            <ul className=''>
                <li className=''>
                    <Link href="settings/store-settings">Store Settings</Link>
                </li>
                <li className=''>
                    <Link href="settings/shifts">Shifts</Link>
                </li>
                <li className=''>
                    <Link href="settings/taxes">Taxes</Link>
                </li>
            </ul>
        </>
    )
}

export default SettingNavigation