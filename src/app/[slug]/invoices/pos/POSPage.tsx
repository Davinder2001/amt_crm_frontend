'use client';

import React, { useEffect, useState } from 'react';
import CheckoutPanel from './CheckoutPanel';
import InvoiceItems from './InvoiceItems';
import CategoriesMenu from './CategoriesMenu';
import { useFetchCategoriesAndItemsQuery } from '@/slices/store/storeApi';

type ItemType = { name: string; price: number };
type OrderItem = ItemType & { qty: number };
type TabType = 'DineIn' | 'Delivery' | 'Pickup';

type MenuNode = {
    soreItems?: ItemType[];
    [key: string]: any;
};

const MENU: Record<string, MenuNode> = {
    Food: {
        soreItems: [
            { name: 'Veg Thali', price: 180 },
            { name: 'Mixed Platter', price: 320 },
        ],
        NorthIndian: {
            soreItems: [
                { name: 'Paneer Butter Masala', price: 210 },
                { name: 'Rajma Chawal', price: 150 },
            ],
            Punjabi: {
                soreItems: [
                    { name: 'Sarson Da Saag', price: 180 },
                    { name: 'Makki Di Roti', price: 80 },
                ],
            },
            Rajasthani: {
                soreItems: [
                    { name: 'Dal Baati Churma', price: 220 },
                    { name: 'Gatte ki Sabzi', price: 180 },
                ],
            },
        },
        SouthIndian: {
            soreItems: [
                { name: 'Masala Dosa', price: 120 },
                { name: 'Idli Vada', price: 90 },
            ],
            Tamil: {
                soreItems: [
                    { name: 'Sambar Rice', price: 110 },
                    { name: 'Rasam', price: 60 },
                ],
            },
        },
        Chinese: {
            soreItems: [
                { name: 'Veg Noodles', price: 130 },
                { name: 'Manchurian', price: 150 },
            ],
            StreetStyle: {
                soreItems: [
                    { name: 'Chowmein', price: 120 },
                    { name: 'Spring Roll', price: 100 },
                ],
                SpicyZone: {
                    soreItems: [
                        { name: 'Dragon Chicken', price: 200 },
                        { name: 'Schezwan Noodles', price: 160 },
                    ],
                },
            },
        },
    },
    Beverages: {
        soreItems: [
            { name: 'Mineral Water', price: 20 },
            { name: 'Energy Drink', price: 100 },
        ],
        Hot: {
            soreItems: [
                { name: 'Hot Chocolate', price: 90 },
            ],
            Tea: {
                soreItems: [
                    { name: 'Masala Chai', price: 60 },
                    { name: 'Ginger Tea', price: 50 },
                ],
                Herbal: {
                    soreItems: [
                        { name: 'Tulsi Tea', price: 70 },
                        { name: 'Chamomile Tea', price: 80 },
                    ],
                },
            },
            Coffee: {
                soreItems: [
                    { name: 'Cappuccino', price: 150 },
                    { name: 'Espresso', price: 100 },
                ],
            },
        },
        Cold: {
            soreItems: [
                { name: 'Iced Tea', price: 70 },
                { name: 'Cold Coffee', price: 90 },
            ],
            Juices: {
                soreItems: [
                    { name: 'Mango Juice', price: 90 },
                    { name: 'Apple Juice', price: 80 },
                ],
                FreshPressed: {
                    soreItems: [
                        { name: 'Carrot Beet Mix', price: 110 },
                        { name: 'Orange Mint', price: 100 },
                    ],
                },
            },
            SoftDrinks: {
                soreItems: [
                    { name: 'Coca-Cola', price: 40 },
                    { name: 'Sprite', price: 35 },
                ],
            },
        },
    },
    Desserts: {
        soreItems: [
            { name: 'Gajar Halwa', price: 120 },
            { name: 'Rasgulla', price: 100 },
        ],
        IceCreams: {
            soreItems: [
                { name: 'Vanilla', price: 120 },
                { name: 'Choco-Chip', price: 130 },
            ],
            Premium: {
                soreItems: [
                    { name: 'Belgian Chocolate', price: 180 },
                    { name: 'Strawberry Cheesecake', price: 170 },
                ],
            },
        },
        Cakes: {
            soreItems: [
                { name: 'Black Forest', price: 180 },
                { name: 'Red Velvet', price: 200 },
            ],
        },
    },
    Alcohol: {
        soreItems: [
            { name: 'Whiskey Shot', price: 180 },
            { name: 'Mojito', price: 250 },
        ],
        Beer: {
            soreItems: [
                { name: 'Kingfisher', price: 180 },
                { name: 'Heineken', price: 200 },
            ],
        },
        Whiskey: {
            soreItems: [
                { name: 'Jack Daniel’s', price: 500 },
                { name: 'Chivas Regal', price: 550 },
            ],
            Aged: {
                soreItems: [
                    { name: 'Glenfiddich 15yr', price: 750 },
                    { name: 'Macallan 18yr', price: 1200 },
                ],
            },
        },
        Wine: {
            soreItems: [
                { name: 'Sula Red', price: 350 },
                { name: 'Jacob’s Creek', price: 400 },
            ],
        },
    },
};

const getItemsForPath = (path: string[], menu: MenuNode): ItemType[] => {
    let current = menu;
    for (const segment of path) {
        if (!current[segment]) return [];
        current = current[segment];
    }

    if (current.soreItems?.length) return current.soreItems;

    for (const key in current) {
        if (key === 'soreItems') continue;
        const items = getItemsForPath([...path, key], menu);
        if (items.length) return items;
    }

    return [];
};

export default function POSPage() {
    const [mainCategory, setMainCategory] = useState<string>('Food');
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('DineIn');
    const [carts, setCarts] = useState<Record<TabType, OrderItem[]>>({
        DineIn: [],
        Delivery: [],
        Pickup: [],
    });
    const { data } = useFetchCategoriesAndItemsQuery();
    console.log('cat-with-data', data);


    useEffect(() => {
        const initialPath = findFirstPathWithItems(MENU[mainCategory]);
        if (initialPath) setSelectedPath(initialPath);
    }, [mainCategory]);

    const findFirstPathWithItems = (node: MenuNode, path: string[] = []): string[] | null => {
        if (node.soreItems?.length) return path;

        for (const key in node) {
            if (key === 'soreItems') continue;
            const result = findFirstPathWithItems(node[key], [...path, key]);
            if (result) return result;
        }
        return null;
    };

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

    const items = getItemsForPath([mainCategory, ...selectedPath], MENU);

    return (
        <div className="container">
            <CategoriesMenu
                menu={MENU}
                mainCategory={mainCategory}
                selectedPath={selectedPath}
                onMainCatChange={(cat) => {
                    setMainCategory(cat);
                }}
                onPathChange={setSelectedPath}
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
