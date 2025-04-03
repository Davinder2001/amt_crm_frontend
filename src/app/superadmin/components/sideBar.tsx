import Link from 'next/link'
import React from 'react'

const SideBar = () => {
  return (
   <>
      <nav>
        <ul>
          <li>
            <Link href='dashboard'>Dashnoard</Link>
          </li>
          <li>
            <Link href='companies'>Companies</Link>
          </li>
          <li>
            <Link href='settings'>Settings</Link>
          </li>
        </ul>
      </nav>
   </>
  )
}

export default SideBar