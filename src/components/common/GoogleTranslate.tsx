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
  // Add known methods if you use them
  // refresh?: () => void;
  // restore?: () => void;
  // For now we'll use this minimal definition since we don't call any methods
  _isGoogleTranslateElement: true;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (options: TranslateElementOptions, element: string): TranslateElementInstance;
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
    const addScript = () => {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,es,fr,zh,ar",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            "google_translate_element"
          );
        }
      };
    };

    addScript();

    return () => {
      const script = document.getElementById("google-translate-script");
      if (script) document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" />;
};

export default GoogleTranslate;