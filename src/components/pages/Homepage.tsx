'use client';
import { featurecardimg1, featurecardimg2, featurecardimg3, featurecardimg4, footerlogoimage,homeimg1,homeimg2,homeimg3,homelogo, manageimage } from '@/assets/useImage';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image';

export const UserNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [submenuOpen, setSubmenuOpen] = useState(false);
  return (
    <>
      <div className='header-outer'>
        <header className="header2">
          <div className="logo">
            <Link href="/">
              <img src={homelogo.src} alt="Logo" />
              <span>Asset Management Technology</span>
            </Link>
          </div>

          {/* Hamburger Icon */}
          {/* Hamburger or Close Icon */}
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✖' : '☰'}
          </div>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <Link href="/">Home</Link>
            <Link href="/about">Company</Link>
            <Link href="/about">Dashboard</Link>
            <Link href="#">Price</Link>
          </nav>

          <div className="header-buttons">
            <button className="btn-outline ">Sign Up</button>
            <button className="btn-filled " onClick={() => router.push('/login')}>Get Started</button>
          </div>
        </header>
      </div>
    </>
  )
}

export default function Homepage() {
  const router = useRouter();
  return (
    <div className='homepage-outer'>
      <div className="homepage">
        <div className='outer-div'>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-left">
              <h1>Modern Wealth<br />Management For</h1>
              <ul className="categories">
                <li>Founders</li>
                <li className="active">Business Owners</li>
                <li>Professionals</li>
                <li>Retirees</li>
                <li>Families</li>
              </ul>
              <div className="hero-actions">
                <button className="btn-filled buttons">Talk to an Advisor</button>
                <button className="btn-outline buttons" onClick={() => router.push('/login')}>Try The Deshboard</button>
              </div>
            </div>
            <div className="hero-right">
              <div className='hero-right-inner'>

              <Image src={homeimg2.src} alt="Woman working" className="main-image" width={841} height={523}/>
              <Image src={homeimg1.src} alt="Chart 1" className="chart top-left" width={287} height={144}/>
              <Image src={homeimg3.src} alt="Chart 2" className="chart bottom-right" width={236} height={214} />
            </div>
            </div>

          </section>
        </div>
        {/* Stats Section */}
        <div className='stats-section-outer-div'>
          <section className="stats-section">
            <div className='outer-div'>
              <h2>We Focus On Your Finances</h2>
              <p className="subtext">You Focus On What Matters Most</p>
              <div className="stats-grids">
                <div className="stat-box">
                  <h3>₹1.45B</h3>
                  <p>Assets Under Management</p>
                </div>
                <div className="stat-box">
                  <h3>₹1.15B</h3>
                  <p>Assets Under Management</p>
                </div>
                <div className="stat-box">
                  <h3>70+</h3>
                  <p>Assets Under Management</p>
                </div>
                <div className="stat-box">
                  <h3>25+</h3>
                  <p>Assets Under Management</p>
                </div>
              </div>
            </div>


          </section>
        </div>


        {/* Investment Feature Cards Section */}
        <div className='outer-div'>
          <nav className='feature-card-nav-bar'>
            <Link href="">Investing</Link>
            <Link href="">Taxes</Link>
            <Link href="">Borrowing</Link>
          </nav>
          <section className="features-sections">
            <div className="features-wrapper">
              <div className="feature-card">
                <div className='feature-card-text'>
                  <h3>We help diversify <br /> your investments</h3>
                  <p>We&apos;ll help you build an endowment-quality portfolio containing public investments and private opportunities across real estate, venture capital, and fixed credit.</p>
                  <p>Compound portfolios include tax-loss harvesting and are automatically rebalanced when the market changes.</p>
                  <p>Compound has an in-house investment management team, trading team, and equity research team.</p>
                </div>
                <div className='feature-card-image'>
                  <img src={featurecardimg1.src} alt="Investment Chart" />
                  <img src={featurecardimg2.src} alt="Investment Chart" className='absilute-image1' />

                </div>
              </div>
              <div className="feature-card">
                <div className='feature-card-text'>

                  <h3>We help manage your text</h3>
                  <p>We&apos;ll help you build an endowment-quality portfolio containing public investments and private opportunities across real estate, venture capital, and fixed credit.</p>
                  <p>Compound portfolios include tax-loss harvesting and are automatically rebalanced when the market changes.</p>
                  <p>Compound has an in-house investment management team, trading team, and equity research team.</p>
                </div>

                <div className='feature-card-image'>
                  <img src={featurecardimg3.src} alt="Management Chart" className='absilute-image2' />
                  <img src={featurecardimg4.src} alt="Management Chart" className='absilute-image3' />

                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Manage Everything Section */}
        <section className="manage-section">
          <div className='outer-div'>
            <div className="manage-container">
              <div className="manage-text">
                <h2>Manage Everything In <br /> One Place</h2>
                <p>
                  Managing your business doesn&apos;t have to involve juggling multiple tools and platforms. With our all-in-one CRM solution, you can centralize every aspect of your workflow into a single, easy-to-use dashboard. From managing customer relationships and tracking sales pipelines to organizing tasks, scheduling meetings, and monitoring team performance, everything you need is just a click away. Say goodbye to scattered spreadsheets, endless email threads, and disconnected systems.
                </p>
                <p>
                  Our CRM is designed to bring structure and clarity to your operations by unifying contacts, communications, documents, deals, and analytics in one place. Whether you&apos;re following up on leads, assigning tasks to your team, or analyzing customer behavior, you&apos;ll have the full picture without switching between apps. Automation features help reduce manual work, while real-time updates ensure everyone stays on the same page.
                </p>
                <p>
                  Ideal for businesses of all sizes, our CRM is scalable, customizable, and built to grow with you. Improve efficiency, enhance collaboration, and make smarter decisions with a tool that adapts to your needs. Take control of your customer experience and business processes—manage everything in one place, and do it better than ever before
                  Experience a new level of visibility, accountability, and ease. Empower your team to work smarter, close deals faster, and never miss a follow-up again. With everything unified, your business runs smoother—so you can focus on what matters most: growth.
                </p>

              </div>
              <div className="manage-image">
                <img src={manageimage.src} alt="Dashboard preview" />
              </div>
            </div>
          </div>
        </section>


        {/* Comparison Table Section */}
        {/* Feature Comparison Table Section */}
        <div className="outer-div comparison-section">
          <table className="comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>Traditional Firm</th>
                <th>Compound</th>
                <th>Custom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td>✔️</td>
                <td></td>
              </tr>
              <tr>
                <td>Dedicated financial advisor</td>
                <td>✔️</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* FAQ Section */}
        <section className="faq-section">
          <div className="outer-div">
            <h2>FAQ</h2>
            <div className="faq-list">
              {[
                "What is Compound’s mission?",
                "How does the client experience work?",
                "What services does Compound provide?",
                "Who are Compound’s typical clients?",
                "What is Compound’s approach to financial planning?",
                "Is Compound a fiduciary?",
                "Who does Compound use to custody my assets?",
                "Is Compound tax advisor?",
                "What investment opportunities are available on Compound?",
                "Can Compound help me set up an estate plan, a trust, a college fund, etc?"
              ].map((question, idx) => (
                <details key={idx} className="faq-item">
                  <summary>{question}</summary>
                  <p>Answer coming soon...</p>
                </details>
              ))}
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}

export const UserFooter = () => {
  // const router = useRouter();
  return (
    <>
      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-top outer-div">
          <div className="footer-columns">
            <div>
              <h3>Resources</h3>
              <ul>
                <li>Investment Research</li>
                <li>The Manual</li>
                <li>The Archives</li>
                <li>Other calculators</li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li>Team</li>
                <li><Link href={'/about'}>About</Link></li>
                <li>Careers</li>
                <li>Newsroom</li>
                <li>FAQ</li>
                <li><Link href={'/contact'}>Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3>Legal</h3>
              <ul>
                <li>Disclosures</li>
                <li><Link href={'/privacy-policy'}>Privacy</Link></li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h3>Competitors</h3>
              <ul>
                <li>Typical DIY</li>
                <li>Typical Financial Advisor</li>
                <li>Typical Robo Advisor</li>
              </ul>
            </div>
          </div>
          <div className="footer-logo">
            <div className='footer-logo-text'>
              <Link href="/"><img src={footerlogoimage.src} alt="Logo" />
                <span>Asset Management Technology</span></Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className='footer-bottom-inner'>
            <p>Copyright 2025 © Asset Management Technology</p>
          </div>
        </div>
      </footer>
    </>
  )
}