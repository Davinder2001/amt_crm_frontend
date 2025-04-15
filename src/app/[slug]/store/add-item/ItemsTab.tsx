'use client';
import React, { useState, ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import AddCategory from './AddCategory';
import Attributes from '../../settings/components/Attributes';
import Variations from './Variations';

interface Props {
    onChange: (combinations: variations[]) => void;
    variations: variations[];
}

const ItemsTab: React.FC<Props> = ({ onChange, variations }) => {
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
            content: <Variations onChange={onChange} setShowModal={setShowModal} />
        },
        {
            key: 'categories',
            label: 'Categories',
            content: <AddCategory />
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="attributes">Attributes</label>
                <button type="button" onClick={() => setShowModal(true)} className="buttons add-attr">
                    Add Attributes
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
