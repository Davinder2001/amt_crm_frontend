'use client';
import React from 'react';

function Pricing() {
    const plans = [
        {
            duration: '01 Year Plan',
            price: '2500/ Per Year',
            employees: '05 Employee Based',
            current: true,
        },
        {
            duration: '01 Year Plan',
            price: '5000/ Per Year',
            employees: '12 Employee Based',
            current: false,
        },
        {
            duration: '01 Year Plan',
            price: '9000/ Per Year',
            employees: '20 Employee Based',
            current: false,
        },
    ];

    const features = ['Store', 'Catalogue', 'Service', 'Order'];

    return (
        <>
            <div className="pricing-container">
                <div className="outer-div">
                    <h2 className="price-heading">Pick Your Perfect Plan</h2>
                    <div className="plans">
                        {plans.map((plan, index) => (
                            <div key={index} className="planCard">
                                <h3 className="planTitle">{plan.duration}</h3>
                                <p className="planPrice">₹{plan.price}</p>
                                <ul className="features">
                                    <li>✓ {plan.employees}</li>
                                    {features.map((feature, i) => (
                                        <li key={i}>✓ {feature}</li>
                                    ))}
                                </ul>
                                <div className="pricing-buttons">
                                    <button className={plan.current ? 'btnPrimary' : 'btnSecondary'}>
                                        {plan.current ? 'Your Plan' : 'Upgrad Plan'}
                                    </button>
                                    <button className="btnOnline">✓ Online</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Pricing;
