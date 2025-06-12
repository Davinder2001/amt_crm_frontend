'use client';
import React, { useState, ReactNode } from 'react';
import { FaBox, FaTag } from 'react-icons/fa';
import Attributes from '../../settings/components/Attributes';
import Variations from './Variations';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

interface Props {
    setVariants: (combinations: variations[]) => void;
    variants: variations[];
    collapsedSections: Record<string, boolean>;
    toggleSection: (key: string) => void;
}

const ItemsTab: React.FC<Props> = ({ setVariants, variants, collapsedSections, toggleSection }) => {
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
                    {variants.filter(v => v.attributes.length > 0 || v.sale_price > 0).length > 0 && (
                        <p className='variations-count'>
                            {variants.filter(v => v.attributes.length > 0 || v.sale_price > 0).length}
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
                <div className="basic_label_header">
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
                        <span
                            onClick={() => toggleSection('attributesVariations')}
                            style={{
                                color: '#384b70',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            aria-label="Toggle attributes and Variations Section"
                        >
                            {collapsedSections['attributesVariations'] ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />}
                        </span>
                    </aside>
                </div>
                {!collapsedSections['attributesVariations'] && (
                    <section className="tab-content fields-wrapper">
                        {tabs.find(tab => tab.key === activeTab)?.content}
                    </section>
                )}
            </div>
        </>
    );
};

export default ItemsTab;
