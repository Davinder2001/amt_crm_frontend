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
            content: <Attributes />
        },
        {
            key: 'variations',
            label: <div className="tab-label">
                <FaBox className="tab-icon" /> <span className="tab-text">Variations
                    {variants.filter(v => v.attributes.length > 0 || v.price > 0).length > 0 && (
                        <p className='variations-count'>
                            {variants.filter(v => v.attributes.length > 0 || v.price > 0).length}
                        </p>
                    )}
                </span>
            </div>,
            content: <Variations setVariants={setVariants} variants={variants} setShowModal={() => { }} />
        },
    ];

    return (
        <>
            <div className="tabs-container">
                <div className="variation-tabs-header">
                    <h2 className="basic_label">Attributes & Variations</h2>
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
                </div>

                <section className="tab-content">
                    {tabs.find(tab => tab.key === activeTab)?.content}
                </section>
            </div>
        </>
    );
};

export default ItemsTab;
