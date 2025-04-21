'use client';
import React, { useState, ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import Attributes from '../../settings/components/Attributes';
import UpdateCategory from './UpdateCategory';
import UpdateVariations from './UpdateVariations';

interface Props {
    setVariants: (combinations: variations[]) => void;
    variations: variations[];
    setSelectedCategories: (categories: Category[]) => void;
    selectedCategories: Category[];
}

const ItemsTab: React.FC<Props> = ({ setVariants, variations, setSelectedCategories, selectedCategories }) => {
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
            content: <UpdateVariations setVariants={setVariants} setShowModal={setShowModal} variants={variations}/>
        },
        {
            key: 'categories',
            label: 'Categories',
            content: <UpdateCategory setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}/>
        }
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemsTab;
