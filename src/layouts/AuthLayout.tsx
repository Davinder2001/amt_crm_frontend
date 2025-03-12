'use client'

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
      <>
        <main className="auth-layout">{children}</main>
      </>
    );
}

export default AuthLayout