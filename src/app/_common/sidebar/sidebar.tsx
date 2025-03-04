import React from "react";
import Link from "next/link";

const Sidebar = () => {
    return (
        <div>
            <ul>
                <li>
                    <Link href="/">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/store">
                        Store
                    </Link>
                </li>
                <li>
                    <Link href="/hr">
                        hr
                    </Link>
                </li>
                <li>
                    <Link href="/permissions">
                       Permissions
                    </Link>
                </li>
                <li>
                    <Link href="/settings">
                        Settings
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
