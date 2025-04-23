import Link from 'next/link'
import React from 'react'

const SideBar = () => {
  return (
   <>
      <nav>
        <ul>
          <li>
            <Link href='/superadmin/dashboard'>Dashnoard</Link>
          </li>
          <li>
            <Link href='/superadmin/companies'>Companies</Link>
          </li>
          <li>
            <Link href='/superadmin/settings'>Settings</Link>
          </li>
        </ul>
      </nav>
   </>
  )
}

export default SideBar