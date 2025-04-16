'use client';

import React, { useState } from 'react';
import CheckoutPanel from './CheckoutPanel';
import InvoiceItems from './InvoiceItems';
import CategoriesMenu from './CategoriesMenu';

const MENU = {
    Food: {
        Fish: [
            { name: 'Ayirai Fish Varuval', price: 120 },
            { name: 'Eeral Varuval', price: 150 },
            { name: 'Grilled Salmon', price: 300 },
            { name: 'Tandoori Fish', price: 250 },
        ],
        Mutton: [
            { name: 'Mutton Fry', price: 250 },
            { name: 'Mutton Curry', price: 230 },
            { name: 'Mutton Biryani', price: 350 },
            { name: 'Mutton Korma', price: 280 },
        ],
        Paneer: [
            { name: 'Paneer Tikka', price: 180 },
            { name: 'Paneer Butter Masala', price: 200 },
            { name: 'Palak Paneer', price: 210 },
            { name: 'Shahi Paneer', price: 220 },
        ],
        Rice: [
            { name: 'Jeera Rice', price: 100 },
            { name: 'Vegetable Biryani', price: 150 },
            { name: 'Mutton Biryani', price: 250 },
            { name: 'Plain Rice', price: 80 },
        ],
        Breads: [
            { name: 'Garlic Naan', price: 50 },
            { name: 'Butter Naan', price: 60 },
            { name: 'Tandoori Roti', price: 40 },
            { name: 'Paratha', price: 70 },
        ]
    },
    Accessories: {
        Cables: [
            { name: 'HDMI Cable', price: 500 },
            { name: 'USB-C Cable', price: 250 },
            { name: 'Micro USB Cable', price: 150 },
            { name: 'DisplayPort Cable', price: 600 },
        ],
        Headphones: [
            { name: 'Wireless Earbuds', price: 2000 },
            { name: 'Over-ear Headphones', price: 3000 },
            { name: 'Noise-cancelling Headphones', price: 5000 },
        ],
        Chargers: [
            { name: 'Fast Charger', price: 1200 },
            { name: 'Standard Charger', price: 800 },
            { name: 'Car Charger', price: 900 },
        ]
    },
    Beverages: {
        Coffee: [
            { name: 'Espresso', price: 100 },
            { name: 'Americano', price: 120 },
            { name: 'Latte', price: 150 },
            { name: 'Cappuccino', price: 160 },
        ],
        Tea: [
            { name: 'Masala Chai', price: 50 },
            { name: 'Green Tea', price: 70 },
            { name: 'Lemon Tea', price: 60 },
        ],
        Juices: [
            { name: 'Orange Juice', price: 80 },
            { name: 'Apple Juice', price: 90 },
            { name: 'Carrot Juice', price: 85 },
        ]
    },
    Desserts: {
        Cakes: [
            { name: 'Chocolate Cake', price: 180 },
            { name: 'Cheesecake', price: 200 },
            { name: 'Fruit Cake', price: 160 },
        ],
        IceCream: [
            { name: 'Vanilla Ice Cream', price: 80 },
            { name: 'Chocolate Ice Cream', price: 90 },
            { name: 'Strawberry Ice Cream', price: 85 },
        ],
        Pastries: [
            { name: 'Fruit Pastry', price: 70 },
            { name: 'Chocolate Pastry', price: 80 },
            { name: 'Cupcake', price: 60 },
        ]
    },
    Snacks: {
        Chips: [
            { name: 'Lays Classic', price: 40 },
            { name: 'Doritos', price: 50 },
            { name: 'Pringles', price: 60 },
        ],
        Cookies: [
            { name: 'Chocolate Chip Cookies', price: 120 },
            { name: 'Oatmeal Cookies', price: 110 },
            { name: 'Butter Cookies', price: 90 },
        ]
    }
};

const TABS = ['DineIn', 'Delivery', 'Pickup'] as const;
type TabType = typeof TABS[number];

type ItemType = { name: string; price: number };
type OrderItem = ItemType & { qty: number };

export default function POSPage() {
    const [mainCategory, setMainCategory] = useState<keyof typeof MENU>('Food');
    const [selectedSubCat, setSelectedSubCat] = useState(
        Object.keys(MENU['Food'])[0]
    );
    const [activeTab, setActiveTab] = useState<TabType>('DineIn');
    const [carts, setCarts] = useState<Record<TabType, OrderItem[]>>({
        DineIn: [],
        Delivery: [],
        Pickup: [],
    });

    const addItemToCart = (item: ItemType) => {
        setCarts((prev) => {
            const updated = [...prev[activeTab]];
            const found = updated.find((i) => i.name === item.name);
            if (found) {
                return {
                    ...prev,
                    [activeTab]: updated.map((i) =>
                        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
                    ),
                };
            } else {
                return {
                    ...prev,
                    [activeTab]: [...updated, { ...item, qty: 1 }],
                };
            }
        });
    };

    const updateQty = (itemName: string, delta: number) => {
        setCarts((prev) => {
            const updated = prev[activeTab]
                .map((i) =>
                    i.name === itemName ? { ...i, qty: i.qty + delta } : i
                )
                .filter((i) => i.qty > 0);
            return { ...prev, [activeTab]: updated };
        });
    };

    const items =
        MENU[mainCategory][selectedSubCat as keyof typeof MENU[typeof mainCategory]];

    return (
        <div className="container">
            <CategoriesMenu
                menu={MENU}
                mainCategory={mainCategory}
                selectedSubCat={selectedSubCat}
                onMainCatChange={(cat) => {
                    setMainCategory(cat as keyof typeof MENU);
                    const firstSub = Object.keys(MENU[cat as keyof typeof MENU])[0];
                    setSelectedSubCat(firstSub);
                }}
                onSubCatChange={setSelectedSubCat}
            />
            <InvoiceItems items={items} onItemClick={addItemToCart} />
            <CheckoutPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                cart={carts[activeTab]}
                onQtyChange={updateQty}
            />

            <style jsx>{`
        .container {
          display: flex;
        }
      `}</style>
        </div>
    );
}
