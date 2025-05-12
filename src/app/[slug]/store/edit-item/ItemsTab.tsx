'use client';
import React, { useState, ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import Attributes from '../../settings/components/Attributes';
import UpdateVariations from './UpdateVariations';

interface Props {
    setVariants: (combinations: variations[]) => void;
    variations: variations[];
    setSelectedCategories: (categories: Category[]) => void;
    selectedCategories: Category[];
}

const ItemsTab: React.FC<Props> = ({ setVariants, variations,selectedCategories }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('variations');

    const tabs: { key: string; label: string; content: ReactNode }[] = [
        {
            key: 'attributes',
            label: 'Attributes',
            content: <Attributes />
        },
        {
            key: 'variations',
            label: 'Variations',
            content: <UpdateVariations setVariants={setVariants} variants={variations} />
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attributes">Attributes</label>
                <button type="button" onClick={() => setShowModal(true)} className="buttons add-attr">
                    Update Attributes
                    {variations.filter(v => v.attributes.length > 0 || v.price > 0).length > 0 && (
                        <span>
                            {variations.filter(v => v.attributes.length > 0 || v.price > 0).length}
                        </span>
                    )}
                </button>
            </div>

            <div className={`modal-overlay ${showModal ? 'show' : 'hide'}`}>
                <div className="modal-content">
                    <span onClick={() => setShowModal(false)} className="close-modal">
                        <FaTimes />
                    </span>
                    <div className="modal-inner">
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
                        
                        <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                className="buttons"
                                onClick={() => setShowModal(false)} // Cancel action
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="buttons primary"
                                onClick={() => {
                                    // Optional: You can trigger a callback or save logic here
                                    setShowModal(false); // Done action
                                }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemsTab;
