// "use client";

// import React, { useEffect } from "react";

// type TranslateLayout = 'simple' | 'horizontal' | 'vertical';

// interface TranslateElementOptions {
//   pageLanguage: string;
//   includedLanguages: string;
//   layout?: TranslateLayout;
//   autoDisplay?: boolean;
//   multilanguagePage?: boolean;
// }

// interface TranslateElementInstance {
//   // Add known methods if you use them
//   // refresh?: () => void;
//   // restore?: () => void;
//   // For now we'll use this minimal definition since we don't call any methods
//   _isGoogleTranslateElement: true;
// }

// declare global {
//   interface Window {
//     googleTranslateElementInit?: () => void;
//     google?: {
//       translate: {
//         TranslateElement: {
//           new (options: TranslateElementOptions, element: string): TranslateElementInstance;
//           InlineLayout: {
//             SIMPLE: TranslateLayout;
//             HORIZONTAL: TranslateLayout;
//             VERTICAL: TranslateLayout;
//           };
//         };
//       };
//     };
//   }
// }

// const GoogleTranslate: React.FC = () => {
//   useEffect(() => {
//     const addScript = () => {
//       if (document.getElementById("google-translate-script")) return;

//       const script = document.createElement("script");
//       script.id = "google-translate-script";
//       script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       script.async = true;
//       document.body.appendChild(script);

//       window.googleTranslateElementInit = () => {
//         if (window.google?.translate?.TranslateElement) {
//           new window.google.translate.TranslateElement(
//             {
//               pageLanguage: "en",
//               includedLanguages: "en,hi,es,fr,zh,ar",
//               layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//             },
//             "google_translate_element"
//           );
//         }
//       };
//     };

//     addScript();

//     return () => {
//       const script = document.getElementById("google-translate-script");
//       if (script) document.body.removeChild(script);
//       delete window.googleTranslateElementInit;
//     };
//   }, []);

//   return <div id="google_translate_element" />;
// };

// export default GoogleTranslate;




















"use client";

import React, { useEffect } from "react";

type TranslateLayout = 'simple' | 'horizontal' | 'vertical';

interface TranslateElementOptions {
  pageLanguage: string;
  includedLanguages: string;
  layout?: TranslateLayout;
  autoDisplay?: boolean;
  multilanguagePage?: boolean;
}

interface TranslateElementInstance {
  _isGoogleTranslateElement: true;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new(options: TranslateElementOptions, element: string): TranslateElementInstance;
          InlineLayout: {
            SIMPLE: TranslateLayout;
            HORIZONTAL: TranslateLayout;
            VERTICAL: TranslateLayout;
          };
        };
      };
    };
  }
}

const GoogleTranslate: React.FC = () => {
  useEffect(() => {
    // Flag to track if we've initialized
    let initialized = false;

    const addScript = () => {
      // Check if already initialized or script exists
      if (initialized || document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;

      script.onload = () => {
        if (!window.googleTranslateElementInit) {
          window.googleTranslateElementInit = initializeTranslate;
        }
      };

      document.body.appendChild(script);
    };

    const initializeTranslate = () => {
      if (initialized || !window.google?.translate?.TranslateElement) return;

      initialized = true;

      // Clear any existing content
      const container = document.getElementById("google_translate_element");
      if (container) container.innerHTML = '';

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: true,
          includedLanguages: "en,bn,ar,zh-CN,hi,es,ja",
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
        },
        "google_translate_element"
      );

      // Apply styles after initialization
      setTimeout(applyStyles, 100);
    };

    const applyStyles = () => {
      const styleId = "google-translate-custom-styles";
      if (document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        body {
          top: 0 !important;
        }
        
        body>.skiptranslate, .goog-logo-link, .gskiptranslate, 
        .goog-te-gadget span, .goog-te-banner-frame, #goog-gt-tt, 
        .goog-te-balloon-frame, div#goog-gt-tt {
          display: none !important;
        }
        
        .goog-te-gadget {
          color: transparent !important;
          font-size: 0px;
        }
        
        .goog-text-highlight {
          background: transparent !important;
          box-shadow: transparent !important;
        }
        
        #google_translate_element select {
          color: #333333;
          border: none;
          font-weight: bold;
          cursor: pointer;
          padding: 0px;
          margin: 0px;
          width: auto;
        }
        
        /* Hide duplicate dropdown if it appears */
        .goog-te-combo:not(:first-child) {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Set up initialization function
    window.googleTranslateElementInit = initializeTranslate;

    // If Google Translate is already loaded, initialize immediately
    if (window.google?.translate?.TranslateElement) {
      initializeTranslate();
    } else {
      addScript();
    }

    return () => {
      // Clean up
      const script = document.getElementById("google-translate-script");
      if (script) document.body.removeChild(script);

      const style = document.getElementById("google-translate-custom-styles");
      if (style) style.remove();

      // Clear the container
      const container = document.getElementById("google_translate_element");
      if (container) container.innerHTML = '';

      // Reset initialization flag
      initialized = false;

      // Only remove our init function if it's ours
      if (window.googleTranslateElementInit === initializeTranslate) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;