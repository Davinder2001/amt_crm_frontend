import React from "react";
import { FaTachometerAlt, FaStore, FaUserTie, FaCog, FaTasks, FaFileInvoice, FaComments } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCompany } from "@/utils/Company";

interface admNavProps {
    isSidebarExpanded: boolean;
    isMobile: boolean;
    openMenu: () => void;
}

const AdminNavs: React.FC<admNavProps> = ({ isSidebarExpanded, openMenu }) => {
    const asPath = usePathname();
    const { companySlug } = useCompany();
    const menuItems = [
        { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
        // { name: "Catalogue", path: "catalogue", icon: <FaClipboardList /> },
        { name: "Store", path: "store", icon: <FaStore /> },
        // { name: "Services", path: "services", icon: <LuClipboardList /> },
        { name: "H.R", path: "hr", icon: <FaUserTie /> },
        { name: "Invoices", path: "invoices", icon: <FaFileInvoice />, hasSubmenu: true },
        { name: "Task", path: "tasks", icon: <FaTasks /> },
        // { name: "Vehicle", path: "vehicle", icon: <FaCar /> },
        // { name: "Quality Control", path: "quality-control", icon: <FaCheck /> },
        { name: "Chat", path: "chat", icon: <FaComments /> },
        // { name: "Permissions", path: "permissions", icon: <FaUserShield /> },
        // { name: "Orders", path: "orders", icon: <FaBox /> },
        { name: "Settings", path: "settings", icon: <FaCog /> },

    ];

    return (
        <nav>
            <ul className="menu-list">
                {menuItems.map(({ name, path, icon, hasSubmenu }) => {
                    const isActive = asPath === `/${companySlug}/${path}` || asPath.startsWith(`/${companySlug}/${path}/`);
                    return (
                        <li
                            key={path}
                            className={`menu-item ${hasSubmenu ? "has-submenu" : ""} ${isActive ? "active" : ""}`}
                            onClick={openMenu}
                        >
                            <Link href={`/${companySlug}/${path}`} className="menu-link">
                                <span className="menu-icon">
                                    {icon}
                                </span>
                                <span className="menu-text">{name}</span>
                                {hasSubmenu && <span className="submenu-icon">+</span>}
                            </Link>
                            {!isSidebarExpanded && (
                                <div className="tooltip"> {name}</div>
                            )}
                            {isActive && (
                                <span className="active-indicator"/>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default AdminNavs;
