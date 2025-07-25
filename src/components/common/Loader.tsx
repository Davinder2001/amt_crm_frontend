// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import {
//     FaMoneyBillWave,
//     FaShoppingCart,
//     FaWallet,
//     FaTasks,
//     FaClipboardList,
//     FaHandHoldingUsd,
//     FaUserPlus,
//     FaUsers,
//     FaStore,
//     FaUserFriends,
//     FaSpinner,
// } from "react-icons/fa";

// interface LoaderProps {
//     isLoading?: boolean;
// }

// const Loader: React.FC<LoaderProps> = ({isLoading}) => {
//     const icons = [
//         { icon: FaMoneyBillWave, color: '#384B70' },
//         { icon: FaShoppingCart, color: '#FF5722' },
//         { icon: FaWallet, color: '#2196F3' },
//         { icon: FaTasks, color: '#9C27B0' },
//         { icon: FaClipboardList, color: '#00BCD4' },
//         { icon: FaHandHoldingUsd, color: '#8BC34A' },
//         { icon: FaUserPlus, color: '#E91E63' },
//         { icon: FaUsers, color: '#3F51B5' },
//         { icon: FaStore, color: '#FF9800' },
//         { icon: FaUserFriends, color: '#009688' },
//         { icon: FaSpinner, color: '#607D8B' }
//     ];

//     const [currentIconIndex, setCurrentIconIndex] = useState(0);
//     const [progress, setProgress] = useState(0);
//     const [rotation, setRotation] = useState(0);
//     const [scale, setScale] = useState(1);
//     const [opacities, setOpacities] = useState([0.3, 0.6, 0.9]);
//     const animationRef = useRef<number | null>(null);

//     useEffect(() => {
//         // Reset progress when loading starts
//         if (!isLoading) {
//             setProgress(0);
//         }
//     }, [isLoading]);

//     useEffect(() => {
//         // Icon rotation
//         const iconInterval = setInterval(() => {
//             setCurrentIconIndex((prevIndex) =>
//                 prevIndex === icons.length - 1 ? 0 : prevIndex + 1
//             );
//         }, 150);

//         // Progress bar - only animate if not complete
//         const progressInterval = setInterval(() => {
//             if (!isLoading) {
//                 setProgress((prev) => {
//                     // Slow down as we approach 100%
//                     const increment = prev < 90 ? 1 : 0.5;
//                     return prev >= 99.5 ? 99.5 : prev + increment;
//                 });
//             }
//         }, 30);

//         // Rotation animation
//         const rotationInterval = setInterval(() => {
//             setRotation(prev => (prev + 2) % 360);
//         }, 16);

//         // Pulsing animation
//         let lastTime = 0;
//         const animate = (time: number) => {
//             if (!lastTime) lastTime = time;
//             lastTime = time;

//             // Scale animation
//             setScale(1 + Math.sin(time / 200) * 0.2);

//             // Dot opacities animation
//             setOpacities([
//                 0.3 + (Math.sin(time / 300 + 0) + 1) / 3,
//                 0.3 + (Math.sin(time / 300 + 1) + 1) / 3,
//                 0.3 + (Math.sin(time / 300 + 2) + 1) / 3
//             ]);

//             animationRef.current = requestAnimationFrame(animate);
//         };

//         animationRef.current = requestAnimationFrame(animate);

//         return () => {
//             clearInterval(iconInterval);
//             clearInterval(progressInterval);
//             clearInterval(rotationInterval);
//             if (animationRef.current) {
//                 cancelAnimationFrame(animationRef.current);
//             }
//         };
//     }, [icons.length, isLoading]);

//     // When loading is complete, animate to 100%
//     useEffect(() => {
//         if (isLoading) {
//             setProgress(100);
//             const timer = setTimeout(() => {
//                 // Optional: You could add a fade-out animation here
//             }, 500);
//             return () => clearTimeout(timer);
//         }
//     }, [isLoading]);

//     const CurrentIcon = icons[currentIconIndex].icon;
//     const currentColor = icons[currentIconIndex].color;

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(5px)',
//             zIndex: '999999999999999999999',
//             opacity: progress >= 100 ? 0 : 1,
//             transition: 'opacity 0.5s ease',
//             pointerEvents: progress >= 100 ? 'none' : 'auto'
//         }}>
//             {/* Static background element */}
//             <div style={{
//                 position: 'absolute',
//                 width: '200px',
//                 height: '200px',
//                 borderRadius: '50%',
//                 background: `radial-gradient(circle, ${currentColor}20 0%, transparent 70%)`,
//                 opacity: 0.3
//             }} />

//             <div style={{
//                 position: 'relative',
//                 width: '120px',
//                 height: '120px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: '2rem'
//             }}>
//                 {/* Pulsing icon */}
//                 <div style={{
//                     fontSize: '3.5rem',
//                     color: currentColor,
//                     transform: `scale(${scale})`,
//                     transition: 'all 0.3s ease',
//                     zIndex: 2
//                 }}>
//                     <CurrentIcon />
//                 </div>

//                 {/* Rotating border effect */}
//                 <div style={{
//                     position: 'absolute',
//                     width: '100%',
//                     height: '100%',
//                     border: `3px solid ${currentColor}20`,
//                     borderRadius: '50%',
//                     borderTopColor: currentColor,
//                     transform: `rotate(${rotation}deg)`,
//                     transition: 'transform 0.1s linear, border-color 0.3s ease'
//                 }} />
//             </div>

//             {/* Progress bar */}
//             <div style={{
//                 width: '200px',
//                 height: '6px',
//                 backgroundColor: '#f0f0f0',
//                 borderRadius: '3px',
//                 marginBottom: '1rem',
//                 overflow: 'hidden'
//             }}>
//                 <div style={{
//                     width: `${progress}%`,
//                     height: '100%',
//                     backgroundColor: currentColor,
//                     transition: 'width 0.3s ease, background-color 0.3s ease',
//                     borderRadius: '3px'
//                 }} />
//             </div>

//             {/* Loading text with color change */}
//             <p style={{
//                 color: currentColor,
//                 fontSize: '1.2rem',
//                 fontWeight: 500,
//                 margin: 0,
//                 textAlign: 'center',
//                 transition: 'color 0.3s ease'
//             }}>
//                 Loading your page... {Math.min(100, Math.floor(progress))}%
//             </p>

//             {/* Subtle dots animation */}
//             <div style={{ display: 'flex', marginTop: '0.5rem' }}>
//                 {opacities.map((opacity, i) => (
//                     <div key={i} style={{
//                         width: '8px',
//                         height: '8px',
//                         borderRadius: '50%',
//                         backgroundColor: currentColor,
//                         margin: '0 4px',
//                         opacity: opacity,
//                         transition: 'all 0.3s ease'
//                     }} />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Loader;

















"use client";

import { useEffect, useState } from 'react';
import '../../app/SplashScreen.scss';

export default function SplashScreen() {
    const [animationStage, setAnimationStage] = useState(0);

    useEffect(() => {
        // Animation sequence only (no hiding)
        const timer1 = setTimeout(() => setAnimationStage(1), 200);
        const timer2 = setTimeout(() => setAnimationStage(2), 500);
        const timer3 = setTimeout(() => setAnimationStage(3), 900);
        const timer4 = setTimeout(() => setAnimationStage(4), 1500);

        // Create particle network
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-network';

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 5 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
            particle.style.borderRadius = '50%';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animation = `particle-move ${Math.random() * 5 + 3}s infinite alternate ease-in-out`;
            particleContainer.appendChild(particle);
        }

        document.querySelector('.splash-screen')?.appendChild(particleContainer);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            particleContainer.remove();
        };
    }, []);

    return (
        <div className="splash-screen">
            <div className="splash-content">
                <div className={`logo-container ${animationStage >= 1 ? 'scale-up' : ''}`}>
                    <div className="logo"></div>
                </div>
                <div className={`text-container ${animationStage >= 2 ? 'slide-up' : ''}`}>
                    <h1 className="app-name">AMT</h1>
                    <p className={`app-tagline ${animationStage >= 3 ? 'show-tagline' : ''}`}>
                        Himmanav Asset Management Technology
                    </p>
                </div>
                <div className={`progress-bar ${animationStage >= 4 ? 'expand' : ''}`}>
                    <div className="progress"></div>
                </div>
            </div>
        </div>
    );
}