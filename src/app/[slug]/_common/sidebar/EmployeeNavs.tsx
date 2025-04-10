import React from "react";
import { FaTachometerAlt, FaClipboardList, FaTasks, FaUserTie } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCompany } from "@/utils/Company";

interface empNavProps {
    isSidebarExpanded: boolean;
    isMobile: boolean;
    openMenu: () => void;
}

const EmployeeNavs: React.FC<empNavProps> = ({isSidebarExpanded, isMobile, openMenu }) => {
    const asPath = usePathname();
    const { companySlug } = useCompany();
    const menuItems = [
        { name: "Dashboard", path: "dashboard", icon: <FaTachometerAlt /> },
        // { name: "Catalogue", path: "catalogue", icon: <FaClipboardList /> },
        { name: "Task", path: "tasks", icon: <FaTasks /> },
        { name: "H.R", path: "hr", icon: <FaUserTie /> },
    ];

    return (
        <nav>
            <ul className="menu-list">
                {menuItems.map(({ name, path, icon }) => {
                    const isActive = asPath.includes(path);
                    return (
                        <li
                            key={path}
                            className="menu-item"
                            style={{ backgroundColor: isActive ? "#F1F9F9" : "", position: "relative" }}
                            onClick={openMenu}
                        >
                            <Link href={`/${companySlug}/employee/${path}`} className="menu-link">
                                <span className="menu-icon" style={{ color: isActive ? "#009693" : "#222" }}>
                                    {icon}
                                </span>
                                <span className="menu-text">{name}</span>
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

export default EmployeeNavs;
