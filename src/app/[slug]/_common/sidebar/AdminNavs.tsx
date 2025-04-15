import React from "react";
import { FaTachometerAlt, FaStore, FaUserTie, FaUserShield, FaCog, FaTasks, FaFileInvoice } from "react-icons/fa";
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
        { name: "Permissions", path: "permissions", icon: <FaUserShield /> },
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
                            className={`menu-item ${hasSubmenu ? "has-submenu" : ""}`}
                            style={{ backgroundColor: isActive ? "#F1F9F9" : "", position: "relative" }}
                            onClick={openMenu}
                        >
                            <Link href={`/${companySlug}/${path}`} className="menu-link">
                                <span className="menu-icon" style={{ color: isActive ? "#009693" : "#222" }}>
                                    {icon}
                                </span>
                                <span className="menu-text">{name}</span>
                                {hasSubmenu && <span className="submenu-icon">+</span>}
                            </Link>
                            {!isSidebarExpanded && (
                                <div className="tooltip"> {name}</div>
                            )}
                            {isActive && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        width: "3px",
                                        height: "100%",
                                        backgroundColor: "#009693",
                                        borderRadius: '2px'
                                    }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default AdminNavs;
