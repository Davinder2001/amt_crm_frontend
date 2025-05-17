'use client';
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <>
            <div style={{
                backgroundColor: '#fff',
                color: '#222222',
                fontFamily: '"DMSans", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                padding: '20px',
                borderTop: '1px solid #f3f3f3',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                margin: '20px 0px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                }}>
                    <Link href={`/`} style={{
                        color: '#222222',
                        fontSize: '18px',
                        fontWeight: '600',
                    }}>
                        AMT CRM
                    </Link>
                    <div>
                        <Link href={`/privacy-policy`} style={{
                            color: '#222222',
                            textDecoration: 'none',
                            marginRight: '20px',
                            fontSize: '14px',
                            fontWeight: '400',
                            transition: 'color 0.3s',
                        }}>Privacy Policy</Link>
                        <Link href={`/terms-services`} style={{
                            color: '#222222',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '400',
                            transition: 'color 0.3s',
                        }}>Terms of Service</Link>
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#222222',
                    fontWeight: '300',
                }}>
                    © 2025 AMT CRM. All rights reserved.
                </div>
            </div>
        </>
    )
}

export default Footer
