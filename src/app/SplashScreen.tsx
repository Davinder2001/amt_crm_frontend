// "use client";

// import { useEffect, useState } from 'react';
// import './SplashScreen.scss';

// export default function SplashScreen() {
//     const [isVisible, setIsVisible] = useState(true);
//     const [animationStage, setAnimationStage] = useState(0);

//     useEffect(() => {
//         // Animation sequence
//         const timer1 = setTimeout(() => setAnimationStage(1), 200);
//         const timer2 = setTimeout(() => setAnimationStage(2), 500);
//         const timer3 = setTimeout(() => setAnimationStage(3), 900);
//         const timer4 = setTimeout(() => setAnimationStage(4), 1500);
//         const timer5 = setTimeout(() => setIsVisible(false), 3000);

//         // Create particle network
//         const particleContainer = document.createElement('div');
//         particleContainer.className = 'particle-network';

//         for (let i = 0; i < 30; i++) {
//             const particle = document.createElement('div');
//             particle.style.position = 'absolute';
//             particle.style.width = `${Math.random() * 5 + 1}px`;
//             particle.style.height = particle.style.width;
//             particle.style.backgroundColor = `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`;
//             particle.style.borderRadius = '50%';
//             particle.style.left = `${Math.random() * 100}%`;
//             particle.style.top = `${Math.random() * 100}%`;
//             particle.style.animation = `particle-move ${Math.random() * 5 + 3}s infinite alternate ease-in-out`;
//             particleContainer.appendChild(particle);
//         }

//         document.querySelector('.splash-screen')?.appendChild(particleContainer);

//         return () => {
//             clearTimeout(timer1);
//             clearTimeout(timer2);
//             clearTimeout(timer3);
//             clearTimeout(timer4);
//             clearTimeout(timer5);
//             particleContainer.remove();
//         };
//     }, []);

//     if (!isVisible) return null;

//     return (
//         <div className="splash-screen">
//             <div className="splash-content">
//                 <div className={`logo-container ${animationStage >= 1 ? 'scale-up' : ''}`}>
//                     <div className="logo"></div>
//                 </div>
//                 <div className={`text-container ${animationStage >= 2 ? 'slide-up' : ''}`}>
//                     <h1 className="app-name">AMT</h1>
//                     <p className={`app-tagline ${animationStage >= 3 ? 'show-tagline' : ''}`}>
//                         Himmanav Asset Management Technology
//                     </p>
//                 </div>
//                 <div className={`progress-bar ${animationStage >= 4 ? 'expand' : ''}`}>
//                     <div className="progress"></div>
//                 </div>
//             </div>
//         </div>
//     );
// }














"use client";

import { useEffect, useState } from 'react';
import './SplashScreen.scss';

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