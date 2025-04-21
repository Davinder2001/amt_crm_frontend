import React from 'react'
import Link from 'next/link';


const SettingNavigation = () => {
    return (
        <><nav><ul className='settings-panel-buttons'>
            <li className='buttons'>
                <Link href="settings/store-settings">Store Settings</Link>
            </li>
            <li className='buttons'>
                <Link href="settings/shifts">Shifts</Link>
            </li>
            <li className='buttons'>
                <Link href="settings/taxes">Taxes</Link>
            </li>
        </ul>

        </nav>
        </>
    )
}

export default SettingNavigation