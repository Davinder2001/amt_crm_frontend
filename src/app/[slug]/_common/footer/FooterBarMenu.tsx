'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaHome, FaFileInvoice, FaUserTie, FaStore } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';

interface FooterBarMenuProps {
    openMenu: () => void;
}

const FooterBarMenu: React.FC<FooterBarMenuProps> = ({ openMenu }) => {
    const asPath = usePathname();
    const { companySlug, userType } = useCompany();

    const items = [
        {
            name: 'Home',
            href: `/${companySlug}${userType === 'employee' ? '/employee/dashboard' : '/dashboard'}`,
            icon: <FaHome size={20} />,
        },
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
