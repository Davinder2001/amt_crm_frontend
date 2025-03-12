'use client'

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
    return (
      <>
        <main className="super-admin-layout">{children}</main>
      </>
    );
}

export default SuperAdminLayout