// 'use client';
// import { featurecardimg1, featurecardimg2, featurecardimg3, featurecardimg4, footerlogoimage, homeimg1, homeimg2, homeimg3, homelogo, manageimage } from '@/assets/useImage';
// import { useRouter } from 'next/navigation';
// import React, { useState } from 'react';
// import Link from 'next/link'
// import Image from 'next/image';

// export const UserNavbar = () => {
//   const router = useRouter();
//   // const [menuOpen, setMenuOpen] = useState(false);
//   // const [submenuOpen, setSubmenuOpen] = useState(false);
//   return (
//     <>
//       <div className='header-outer'>
//         <div className="header2">
//           <div className="logo">
//             <Link href="/">
//               <img src={homelogo.src} alt="Logo" />
//               <span>Asset Management Technology</span>
//             </Link>
//           </div>

//           {/* Hamburger Icon */}
//           {/* Hamburger or Close Icon */}
//           {/* <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
//             {menuOpen ? '✖' : '☰'}
//           </div> */}

//           {/* <nav className={`nav ${menuOpen ? 'open' : ''}`}>
//             <Link href="/">Home</Link>
//             <Link href="/about">Company</Link>
//             <Link href="/about">Dashboard</Link>
//             <Link href="#">Price</Link>
//           </nav> */}

//           <div className="header-buttons">
//             <button className="btn-outline " onClick={() => router.push('/login')}>Sign In</button>
//             <button className="btn-filled " onClick={() => router.push('/register-your-company')}>Get Started</button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default function Homepage() {
//   const router = useRouter();
//   return (
//     <div className='homepage-outer'>
//       <div className="homepage">
//         <div className='outer-div'>
//           {/* Hero Section */}
//           <section className="hero">
//             <div className="hero-left">
//             <h1>Modern Wealth Management<br />Tailored for Your Success</h1>
//               {/* <ul className="categories">
//                 <li>Founders</li>
//                 <li className="active">Business Owners</li>
//                 <li>Professionals</li>
//                 <li>Retirees</li>
//                 <li>Families</li>
//               </ul> */}
//               <p className="category-description">
//                 We cater to various clients with distinct needs, offering tailored solutions for Founders, Business Owners, Professionals, Retirees, and Families. Our services include dedicated strategies for entrepreneurs looking to grow and manage their wealth, comprehensive financial guidance for business owners, investment and tax planning for professionals, retirement solutions, and wealth management to secure your family’s future and legacy.
//               </p>
//               <div className="hero-actions">
//                 {/* <button className="btn-filled buttons">Talk to an Advisor</button> */}
//                 <button className="btn-outline buttons" onClick={() => router.push('/register-your-company')}>Try The Dashboard</button>
//               </div>
//             </div>
//             <div className="hero-right">
//               <div className='hero-right-inner'>

//                 <Image src={homeimg2.src} alt="Woman working" className="main-image" width={841} height={400} />
//                 <Image src={homeimg1.src} alt="Chart 1" className="chart top-left" width={200} height={100} />
//                 <Image src={homeimg3.src} alt="Chart 2" className="chart bottom-right" width={200} height={150} />
//               </div>
//             </div>

//           </section>
//         </div>
//         {/* Stats Section */}
//         {/* <div className='stats-section-outer-div'>
//           <section className="stats-section">
//             <div className='outer-div'>
//               <h2>We Focus On Your Finances</h2>
//               <p className="subtext">You Focus On What Matters Most</p>
//               <div className="stats-grids">
//                 <div className="stat-box">
//                   <h3>₹1.45B</h3>
//                   <p>Assets Under Management</p>
//                 </div>
//                 <div className="stat-box">
//                   <h3>₹1.15B</h3>
//                   <p>Assets Under Management</p>
//                 </div>
//                 <div className="stat-box">
//                   <h3>70+</h3>
//                   <p>Assets Under Management</p>
//                 </div>
//                 <div className="stat-box">
//                   <h3>25+</h3>
//                   <p>Assets Under Management</p>
//                 </div>
//               </div>
//             </div>


//           </section>
//         </div> */}


//         {/* Investment Feature Cards Section */}
//         <div className='investment-section'>
//           <div className='outer-div'>
//             <nav className='feature-card-nav-bar'>
//               <Link href="">Investing</Link>
//               <Link href="">Taxes</Link>
//               <Link href="">Borrowing</Link>
//             </nav>
//             <section className="features-sections">
//               <div className="features-wrapper">
//                 <div className="feature-card">
//                   <div className='feature-card-text'>
//                     <h3>We help diversify <br /> your investments</h3>
//                     <p>We&apos;ll help you build an endowment-quality portfolio containing public investments and private opportunities across real estate, venture capital, and fixed credit.</p>
//                     <p>Compound portfolios include tax-loss harvesting and are automatically rebalanced when the market changes.</p>
//                     <p>Compound has an in-house investment management team, trading team, and equity research team.</p>
//                   </div>
//                   <div className='feature-card-image'>
//                     <img src={featurecardimg1.src} alt="Investment Chart" />
//                     <img src={featurecardimg2.src} alt="Investment Chart" className='absilute-image1' />

//                   </div>
//                 </div>
//                 <div className="feature-card">
//                   <div className='feature-card-text'>

//                     <h3>We help manage your text</h3>
//                     <p>We&apos;ll help you build an endowment-quality portfolio containing public investments and private opportunities across real estate, venture capital, and fixed credit.</p>
//                     <p>Compound portfolios include tax-loss harvesting and are automatically rebalanced when the market changes.</p>
//                     <p>Compound has an in-house investment management team, trading team, and equity research team.</p>
//                   </div>

//                   <div className='feature-card-image'>
//                     <img src={featurecardimg3.src} alt="Management Chart" className='absilute-image2' />
//                     <img src={featurecardimg4.src} alt="Management Chart" className='absilute-image3' />

//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>

//         {/* Manage Everything Section */}
//         <section className="manage-section">
//           <div className='outer-div'>
//             <div className="manage-container">
//               <div className="manage-text">
//                 <h2>Manage Everything In <br /> One Place</h2>
//                 <p>
//                   Managing your business doesn&apos;t have to involve juggling multiple tools and platforms. With our all-in-one CRM solution, you can centralize every aspect of your workflow into a single, easy-to-use dashboard. From managing customer relationships and tracking sales pipelines to organizing tasks, scheduling meetings, and monitoring team performance, everything you need is just a click away. Say goodbye to scattered spreadsheets, endless email threads, and disconnected systems.
//                 </p>
//                 <p>
//                   Our CRM is designed to bring structure and clarity to your operations by unifying contacts, communications, documents, deals, and analytics in one place. Whether you&apos;re following up on leads, assigning tasks to your team, or analyzing customer behavior, you&apos;ll have the full picture without switching between apps. Automation features help reduce manual work, while real-time updates ensure everyone stays on the same page.
//                 </p>
//                 <p>
//                   Ideal for businesses of all sizes, our CRM is scalable, customizable, and built to grow with you. Improve efficiency, enhance collaboration, and make smarter decisions with a tool that adapts to your needs. Take control of your customer experience and business processes—manage everything in one place, and do it better than ever before
//                   Experience a new level of visibility, accountability, and ease. Empower your team to work smarter, close deals faster, and never miss a follow-up again. With everything unified, your business runs smoother—so you can focus on what matters most: growth.
//                 </p>

//               </div>
//               <div className="manage-image">
//                 <img src={manageimage.src} alt="Dashboard preview" />
//               </div>
//             </div>
//           </div>
//         </section>


//         {/* Comparison Table Section */}
//         {/* Feature Comparison Table Section */}
//         <div className="outer-div comparison-section">
//           <table className="comparison-table">
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Traditional Firm</th>
//                 <th>Compound</th>
//                 <th>Custom</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>Dedicated financial advisor</td>
//                 <td>✔️</td>
//                 <td>✔️</td>
//                 <td></td>
//               </tr>
//               <tr>
//                 <td>Comprehensive financial planning</td>
//                 <td>✔️</td>
//                 <td>✔️</td>
//                 <td>✔️</td>
//               </tr>
//               <tr>
//                 <td>Tax optimization strategies</td>
//                 <td></td>
//                 <td>✔️</td>
//                 <td>✔️</td>
//               </tr>
//               <tr>
//                 <td>Custom investment portfolios</td>
//                 <td></td>
//                 <td>✔️</td>
//                 <td>✔️</td>
//               </tr>
//               <tr>
//                 <td>Access to private investment opportunities</td>
//                 <td></td>
//                 <td>✔️</td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* FAQ Section */}
//         {/* <section className="faq-section">
//           <div className="outer-div">
//             <h2>FAQ</h2>
//             <div className="faq-list">
//               {[
//                 "What is Compound’s mission?",
//                 "How does the client experience work?",
//                 "What services does Compound provide?",
//                 "Who are Compound’s typical clients?",
//                 "What is Compound’s approach to financial planning?",
//                 "Is Compound a fiduciary?",
//                 "Who does Compound use to custody my assets?",
//                 "Is Compound tax advisor?",
//                 "What investment opportunities are available on Compound?",
//                 "Can Compound help me set up an estate plan, a trust, a college fund, etc?"
//               ].map((question, idx) => (
//                 <details key={idx} className="faq-item">
//                   <summary>{question}</summary>
//                   <p>Answer coming soon...</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section> */}


//       </div>
//     </div>
//   );
// }

// export const UserFooter = () => {
//   // const router = useRouter();
//   return (
//     <>
//       {/* Footer Section */}
//       <footer className="footer-section">
//         {/* <div className="footer-top outer-div">
//           <div className="footer-columns">
//             <div>
//               <h3>Resources</h3>
//               <ul>
//                 <li><Link href="/investment-research">Investment Research</Link></li>
//                 <li><Link href="/manual">The Manual</Link></li>
//                 <li><Link href="/archives">The Archives</Link></li>
//                 <li><Link href="/other-calculators">Other calculators</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h3>Company</h3>
//               <ul>
//                 <li><Link href={'/team'}>Team</Link></li>
//                 <li><Link href={'/about'}>About</Link></li>
//                 <li><Link href={'/careers'}>Careers</Link></li>
//                 <li><Link href={'/newsroom'}>Newsroom</Link></li>
//                 <li><Link href={'/faq'}>FAQ</Link></li>
//                 <li><Link href={'/contact'}>Contact Us</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h3>Legal</h3>
//               <ul>
//                 <li><Link href="/disclosures">Disclosures</Link></li>
//                 <li><Link href={'/privacy-policy'}>Privacy</Link></li>
//                 <li><Link href={'/terms-services'}>Terms of Service</Link></li>
//                 <li><Link href={'/refund'}>Cancelation and refund</Link></li>
//                 <li><Link href={'/shipping-policy'}>Shipping Policy</Link></li>
//                 <li><Link href="/security">Security</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h3>Competitors</h3>
//               <ul>
//                 <li>Typical DIY</li>
//                 <li>Typical Financial Advisor</li>
//                 <li>Typical Robo Advisor</li>
//               </ul>
//             </div>
//           </div>
//           <div className="footer-logo">
//             <div className='footer-logo-text'>
//               <Link href="/"><img src={footerlogoimage.src} alt="Logo" />
//                 <span>Asset Management Technology</span></Link>
//             </div>
//           </div>
//         </div> */}

//         <div className="footer-bottom">
//           <div className='footer-bottom-inner'>
//             <p>Copyright 2025 © Asset Management Technology</p>
//             <ul className='policy-links'>
//               <li><Link href={'/about'}>About</Link></li>
//               <li><Link href={'/privacy-policy'}>Privacy</Link></li>
//               <li><Link href={'/terms-services'}>Terms of Service</Link></li>
//               <li><Link href={'/refund'}>Cancelation and refund</Link></li>
//               <li><Link href={'/shipping-policy'}>Shipping Policy</Link></li>
//             </ul>
//             <div className="footer-logo">
//               <div className='footer-logo-text'>
//                 <Link href="/"><img src={footerlogoimage.src} alt="Logo" />
//                   <span>Asset Management Technology</span></Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   )
// }

























'use client';
import React, { useState } from 'react';
import { featurecardimg1, featurecardimg2, featurecardimg3, featurecardimg4, footerlogoimage, homeimg1, homeimg2, homeimg3, homelogo, manageimage } from '@/assets/useImage';
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
              <img src={homelogo.src} alt="Logo" />
              <span>Himmanav Asset Management Technology </span>
            </Link>
          </div>

          <div className="header-buttons">
            <button className="btn-outline " onClick={() => router.push('/login')}>Sign In</button>
            <button className="btn-filled " onClick={() => router.push('/register-your-company')}>Get Started</button>
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
                <button className="btn-outline buttons" onClick={() => router.push('/register-your-company')}>Try The Dashboard</button>
              </div>
            </div>
            <div className="hero-right">
              <div className='hero-right-inner'>
                <Image src={homeimg2.src} alt="Business Professional" className="main-image" width={841} height={400} />
                <Image src={homeimg1.src} alt="Workflow chart" className="chart top-left" width={200} height={100} />
                <Image src={homeimg3.src} alt="Team collaboration" className="chart bottom-right" width={200} height={150} />
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
                      <img src={featurecardimg1.src} alt="CRM Management" />
                      <img src={featurecardimg2.src} alt="Client Management" className='absilute-image1' />
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
                      <img src={featurecardimg3.src} alt="Business Operations" className='absilute-image2' />
                      <img src={featurecardimg4.src} alt="Business Dashboard" className='absilute-image3' />
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
                <img src={manageimage.src} alt="Business Dashboard preview" />
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
                <Link href="/"><img src={footerlogoimage.src} alt="Logo" />
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