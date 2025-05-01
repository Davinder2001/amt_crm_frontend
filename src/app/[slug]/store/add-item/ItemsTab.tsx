'use client';
import React, { useState, ReactNode } from 'react';
import { FaBox, FaTag, FaTimes } from 'react-icons/fa';
import Attributes from '../../settings/components/Attributes';
import Variations from './Variations';

interface Props {
    onChange: (combinations: variations[]) => void;
    variations: variations[];
}

const ItemsTab: React.FC<Props> = ({ onChange, variations }) => {
    const [showModal, setShowModal] = useState(false);
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
            content: <div className="tab-content"><Variations onChange={onChange} setShowModal={setShowModal} /></div>
        },


    ];

    return (
        <>
            <div className='add-items-form-input-label-container'>
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

                        <section className="tab-content container">
                            {tabs.find(tab => tab.key === activeTab)?.content}
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemsTab;
