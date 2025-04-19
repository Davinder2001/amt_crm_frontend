import React from 'react'
import Link from 'next/link';


const SettingNavigation = () => {
    return (
        <><nav><ul>
            <li>
                <Link href="settings/store-settings">Store Settings</Link>
            </li>
            <li>
                <Link href="settings/shifts">Shifts</Link>
            </li>
            <li>
                <Link href="settings/taxes">Taxes</Link>
            </li>
        </ul>

        </nav>
        </>
    )
}

export default SettingNavigation