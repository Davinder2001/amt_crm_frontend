"use client";

import { useEffect } from 'react';
import './SplashScreen.scss';

export default function SplashScreen() {

    useEffect(() => {
        // Immediately create particle network (no animation delays)
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
            particleContainer.remove();
        };
    }, []);

    return (
        <div className="splash-screen">
            <div className="splash-content">
                <div className={`logo-container scale-up`}>
                    <div className="logo"></div>
                </div>
                <div className={`text-container slide-up`}>
                    <h1 className="app-name">AMT</h1>
                    <p className={`app-tagline show-tagline`}>
                        Himmanav Asset Management Technology
                    </p>
                </div>
                <div className={`progress-bar expand`}>
                    <div className="progress"></div>
                </div>
            </div>
        </div>
    );
}