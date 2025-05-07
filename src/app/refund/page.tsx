import React from 'react'

function Refund() {
  return (
    <>
      <div className="refund-page">
        <div className="outer-div">
          <h1>Refund Policy</h1>
          <p>Effective Date: May 7, 2025</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              At Asset Management Technology, we strive to provide high-quality products and services. If you are not entirely satisfied with your purchase, we're here to help.
            </p>
          </section>

          <section>
            <h2>2. Eligibility for Refunds</h2>
            <p>To be eligible for a refund, your request must meet the following criteria:</p>
            <ul>
              <li>The request is made within 7 days of purchase</li>
              <li>The service/product was not used or accessed beyond reasonable evaluation</li>
              <li>You can provide proof of purchase</li>
            </ul>
          </section>

          <section>
            <h2>3. Non-Refundable Items</h2>
            <p>We do not offer refunds for:</p>
            <ul>
              <li>Services that have already been rendered</li>
              <li>Customized or personalized products</li>
              <li>Subscription plans after the billing cycle starts</li>
            </ul>
          </section>

          <section>
            <h2>4. Refund Process</h2>
            <p>
              Once your request is received and inspected, we will notify you of the status of your refund. If approved, the refund will be processed within 7–10 business days to your original payment method.
            </p>
          </section>

          <section>
            <h2>5. Late or Missing Refunds</h2>
            <p>
              If you haven’t received a refund yet:
            </p>
            <ul>
              <li>Check your bank account again</li>
              <li>Contact your credit card company—it may take some time before your refund is officially posted</li>
              <li>Contact your bank—there is often some processing time</li>
              <li>If you've done all of this and still haven't received your refund, contact us</li>
            </ul>
          </section>

          <section>
            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about our refund policy, please contact us:
              <br />
              Email: <a href="mailto:support@assettech.com">support@assettech.com</a>
              <br />
              Phone: +91-XXXXXXXXXX
              <br />
              Address: 123 Tech Street, Bengaluru, India
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default Refund
