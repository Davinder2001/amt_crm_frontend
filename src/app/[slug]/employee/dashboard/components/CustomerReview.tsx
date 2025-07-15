// app/dashboard/components/CustomerReview.tsx
import React from 'react';

const CustomerReview = () => {
    const reviews = new Array(3).fill({
        name: 'Keith Jensen Requested For Room.',
        description: '2 HoLorem Ipsum Dolor Sit Amet, Consectetur',
    });

    return (
        <div className="card customer-review">
            <div className="card-header">
                <h3>Customer Review</h3>
                <button className="view-all">View All</button>
            </div>
            <ul className="review-list">
                {reviews.map((review, i) => (
                    <li key={i} className="review-item">
                        <div className="avatar">AB</div>
                        <div className="review-content">
                            <div className="r-title">{review.name}</div>
                            <div className="desc">{review.description}</div>
                        </div>
                        <div className="star">⭐</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerReview;
