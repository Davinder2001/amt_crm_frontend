'use client';
import React, { useState, ReactNode } from 'react';
import { FaBox, FaTag } from 'react-icons/fa';
import Attributes from '../../settings/components/Attributes';
import Variations from '../add-item/Variations';

interface Props {
    setVariants: (combinations: variations[]) => void;
    variants: variations[];
}

const ItemsTab: React.FC<Props> = ({ setVariants, variants }) => {
    const [activeTab, setActiveTab] = useState('variations');

    const tabs: { key: string; label: ReactNode; content: ReactNode }[] = [
        {
            key: 'attributes',
            label: <div className="tab-label">
                <FaTag className="tab-icon" /> <span className="tab-text">Attributes</span>
            </div>,
            content: <div className="tab-content"><Attributes /></div>
        },
        {
            key: 'variations',
            label: <div className="tab-label">
                <FaBox className="tab-icon" /> <span className="tab-text">Variations</span>
            </div>,
            content: <div className="tab-content"><Variations setVariants={setVariants} variants={variants} setShowModal={() => { }} /></div>
        },
    ];

    return (
        <>
            <div className="tabs-container">
                <aside className="tabs-sidebar">
                    {tabs.map(tab => (
                        <button
                            type="button"
                            key={tab.key}
                            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </aside>

                <section className="tab-content">
                    {tabs.find(tab => tab.key === activeTab)?.content}
                </section>
            </div>
        </>
    );
};

export default ItemsTab;
