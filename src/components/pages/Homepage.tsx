'use client';
import React, { useState } from 'react';
import { featurecardimg1, featurecardimg2, footerlogoimage, homeimg2, homelogo, manageimage } from '@/assets/useImage';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image';
import Pricing from './PricingPage';

export const UserNavbar = () => {
  const router = useRouter();
  return (
    <>
      <div className='header-outer'>
        <div className="header2">
          <div className="logo">
            <Link href="/">
              <Image
                src={homelogo}
                alt="Logo"
                width={100}   // adjust to your preferred size
                height={100}
                layout='responsive'
              />

              <span>Himmanav Asset Management Technology </span>
            </Link>
          </div>

          <div className="header-buttons">
            <button className="btn-outline " onClick={() => router.push('/login')}>Sign In</button>
            <button className="btn-filled " onClick={() => router.push('/register')}>Get Started</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Homepage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('crm');
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className='homepage-outer'>
      <div className="homepage">
        <div className='outer-div'>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-left">
              <h1>Optimized Business Management<br />For Growth and Success</h1>
              <p className="category-description">
                We offer personalized solutions for founders, business owners, professionals, and families. Whether you&apos;re scaling your business, managing daily operations, or securing your family&apos;s future, our platform simplifies your workflow and enhances productivity. Our technology streamlines customer management, operational processes, and decision-making.
              </p>
              <div className="hero-actions">
                <button className="btn-outline buttons" onClick={() => router.push('/register')}>Try The Dashboard</button>
              </div>
            </div>
            <div className="hero-right">
              <div className='hero-right-inner'>
                <Image src={homeimg2.src} alt="Business Professional" className="main-image" width={841} height={400} />
              </div>
            </div>
          </section>
        </div>

        <div className='business-section'>
          <div className='outer-div'>
            <nav className='feature-card-nav-bar'>
              <span onClick={() => handleTabClick('crm')} className={activeTab === 'crm' ? 'active-tab' : ''}>CRM Management</span>
              <span onClick={() => handleTabClick('team')} className={activeTab === 'team' ? 'active-tab' : ''}>Team Collaboration</span>
            </nav>

            <section className="features-sections">
              {activeTab === 'crm' && (
                <div className="features-wrapper">
                  {/* CRM Management Card */}
                  <div className="feature-card">
                    <div className='feature-card-text'>
                      <h3>Manage Your Clients Effectively</h3>
                      <p>Our platform helps businesses manage their customer relationships and sales pipelines in one place. Easily track customer interactions, and sales progress.</p>
                      <p>With automatic updates and real-time data, you can provide your clients with timely responses and personalized service.</p>
                      <p>Our CRM solution is designed to scale as your business grows, offering advanced features to automate routine tasks and improve client satisfaction.</p>
                      <p>Additionally, you can set up custom notifications for follow-ups, track customer behavior, and even integrate with other marketing tools.</p>
                    </div>
                    <div className='feature-card-image'>
                      <Image
                        src={featurecardimg1.src}
                        alt="CRM Management"
                        width={400}
                        height={300}
                        unoptimized
                      />

                      <Image
                        src={featurecardimg2}
                        alt="Client Management"
                        className="absilute-image1"
                      />
                    </div>
                  </div>

                  {/* Operational Tools Card */}
                  <div className="feature-card">
                    <div className='feature-card-text'>
                      <h3>Enhance Operational Efficiency</h3>
                      <p>Centralize all your business processes in one platform. Manage tasks, meetings, and documents with ease. Automate workflows to save time and reduce human error.</p>
                      <p>Our platform integrates multiple tools and systems into a seamless dashboard, helping businesses run smoothly and efficiently.</p>
                      <p>With powerful analytics and reporting tools, gain insights into performance, track KPIs, and make data-driven decisions to boost productivity.</p>
                      <p>Our automation tools allow you to streamline repetitive tasks, reducing overhead and ensuring you focus on what matters most for your business growth.</p>
                    </div>
                    <div className='feature-card-image'>
                      <Image
                        src={featurecardimg2}
                        alt="Business Operations"
                        className="absilute-image2"
                      />

                      <Image
                        src={featurecardimg1}
                        alt="Business Dashboard"
                        className="absilute-image3"
                      />

                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="team-collaboration-content">
                  {/* Team Collaboration Section */}
                  <h3>Effective Team Collaboration</h3>
                  <p>Empowering teams to work together efficiently is at the heart of every successful organization. Our platform provides tools that help teams collaborate in real-time, ensuring smooth communication and progress on all projects.</p>

                  <h4>Key Features:</h4>
                  <ul>
                    <li><strong>Task Management:</strong> Assign tasks, set deadlines, and monitor team progress in real-time.</li>
                    <li><strong>Document Sharing:</strong> Easily share files and resources among team members.</li>
                    <li><strong>Real-time Messaging:</strong> Stay connected with built-in chat features for quick communication.</li>
                    <li><strong>Project Updates:</strong> Keep everyone on the same page with live project status updates and notifications.</li>
                  </ul>

                  <p>With our platform, remote teams and in-office teams alike can stay connected, ensuring that work gets done without unnecessary delays. Collaboration has never been so streamlined!</p>

                  <h4>Why Team Collaboration Matters</h4>
                  <p>Effective collaboration can significantly increase productivity, improve problem-solving, and boost employee morale. By ensuring that everyone is aligned, you can minimize misunderstandings and errors that slow down business operations.</p>
                  <p>Our tools are designed to support teams of any size, from small startups to large enterprises. Whether you&apos;re working on a single project or handling multiple departments, our platform adapts to your needs.</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Manage Everything Section */}
        <section className="manage-section">
          <div className='outer-div'>
            <div className="manage-container">
              <div className="manage-text">
                <h2>Manage Your Business In <br /> One Place</h2>
                <p>
                  Running a business doesn&apos;t have to be complicated. Our all-in-one platform simplifies operations by bringing all your business needs into a single dashboard. From managing customer data to scheduling meetings and tracking sales, everything is organized and accessible at a glance.
                </p>
                <p>
                  Automate key processes, centralize communications, and increase collaboration across teams, ensuring everyone stays aligned with the company&apos;s goals. Manage your team&apos;s workflow, track performance, and stay on top of deadlines with ease.
                </p>
                <p>
                  Our platform is designed to be adaptable, so whether you&apos;re a small startup or a growing enterprise, it scales with your needs. Make smarter decisions and drive your business forward with a tool that simplifies the complex.
                </p>
              </div>
              <div className="manage-image">
                <Image
                  src={manageimage}
                  alt="Business Dashboard preview"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <div className="outer-div comparison-section">
          <table className="comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>Traditional Systems</th>
                <th>Our Platform</th>
                <th>Custom Solutions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dedicated business tools</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Streamlined workflow management</td>
                <td>✔️</td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>Advanced task automation</td>
                <td></td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>Integrated team collaboration</td>
                <td></td>
                <td>✔️</td>
                <td>✔️</td>
              </tr>
              <tr>
                <td>Data analytics and reporting</td>
                <td></td>
                <td>✔️</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pricing />

      </div>
    </div>
  );
}

export const UserFooter = () => {
  return (
    <>
      <footer className="footer-section">
        <div className="footer-bottom">
          <div className='footer-bottom-inner'>
            <div className="footer-logo">
              <div className='footer-logo-text'>
                <Link href="/">
                  <Image src={footerlogoimage} alt="Logo" />
                  <span>Himmanav Asset Management Technology </span></Link>
              </div>
            </div>
            <ul className='policy-links'>
              <li><Link href={'/about'}>About</Link></li>
              <li><Link href={'/privacy-policy'}>Privacy</Link></li>
              <li><Link href={'/terms-services'}>Terms of Service</Link></li>
              <li><Link href={'/refund'}>Cancellation and Refund</Link></li>
              {/* <li><Link href={'/shipping-policy'}>Shipping Policy</Link></li> */}
            </ul>
            <p>Copyright 2025 © Himmanav Asset Management Technology </p>
          </div>
        </div>
      </footer>
    </>
  )
}