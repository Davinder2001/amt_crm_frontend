import React from 'react'

function page() {
    return (
        <div>

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
    )
}

export default page