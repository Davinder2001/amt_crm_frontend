'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaHome, FaFileInvoice, FaUserTie, FaStore, FaBuilding, FaCube } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

interface FooterBarMenuProps {
    openMenu: () => void;
}

const FooterBarMenu: React.FC<FooterBarMenuProps> = ({ openMenu }) => {
    const asPath = usePathname();
    const { companySlug, userType } = useCompany();

    // Common items for all user types
    const commonItems = [
        {
            name: 'Home',
            href: userType === 'super-admin' 
                ? '/superadmin/dashboard' 
                : `/${companySlug}${userType === 'employee' ? '/employee/dashboard' : '/dashboard'}`,
            icon: <FaHome size={20} />,
        }
    ];

    // Items for regular users/employees
    const regularUserItems = [
        {
            name: 'Store',
            href: `/${companySlug}${userType === 'employee' ? '/employee/store' : '/store'}`,
            icon: <FaStore size={20} />,
        },
        {
            name: 'Hr',
            href: `/${companySlug}${userType === 'employee' ? '/employee/hr' : '/hr'}`,
            icon: <FaUserTie size={20} />,
        },
        {
            name: 'Invoices',
            href: `/${companySlug}${userType === 'employee' ? '/employee/invoices' : '/invoices'}`,
            icon: <FaFileInvoice size={20} />,
        },
    ];

    // Items for super admin
    const superAdminItems = [
        {
            name: 'Business Users',
            href: '/superadmin/admins',
            icon: <FaUserTie size={20} />,
        },
        {
            name: 'Companies',
            href: '/superadmin/companies',
            icon: <FaBuilding size={20} />,
        },
        {
            name: 'Packages',
            href: '/superadmin/packages',
            icon: <FaCube size={20} />,
        }
    ];

    // Determine which items to show based on user type
    const items = userType === 'super-admin'
        ? [...commonItems, ...superAdminItems]
        : [...commonItems, ...regularUserItems];

    const isActive = (href: string) =>
        asPath === href || asPath.startsWith(`${href}/`);

    return (
        <>
            <div className="footer-bar">
                <ul className="footer-bar-items">
                    {items.map(({ name, href, icon }) => (
                        <li key={name} className={`footer-bar-item ${isActive(href) ? 'active' : ''}`}>
                            <Link href={href}>
                                <div className="icon-text-outer">
                                    {isActive(href) && <span className="top-indicator" />}
                                    {icon}
                                    <span className='icon-text'>{name}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                    <li className="footer-bar-item" onClick={openMenu}>
                        <div className="icon-text-outer">
                            <FaBars size={20} />
                            <span className='icon-text'>Menu</span>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default FooterBarMenu;