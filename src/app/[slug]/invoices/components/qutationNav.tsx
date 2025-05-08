import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
const QutationNav = () => {
  return (
    <>
           <nav className='invoice-nav-section'>
            <ul  className='invoice-nav-buttons'>
                <li>
                    < Link href="qutations/add" className='buttons'> <FaPlus/>Add Qutation</Link>
                </li>
                
            </ul>
        </nav>
    </>
  )
}

export default QutationNav
