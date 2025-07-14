"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new(
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout?: number;
              autoDisplay?: boolean;
            },
            element: string
          ): void;
          InlineLayout: {
            HORIZONTAL: number;
            SIMPLE: number;
            VERTICAL: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const languageOptions = [
  { code: "en", name: "English", flag: "https://flagcdn.com/w20/gb.png" },
  { code: "hi", name: "Hindi", flag: "https://flagcdn.com/w20/in.png" },
  { code: "bn", name: "Bengali", flag: "https://flagcdn.com/w20/bd.png" },
  { code: "ar", name: "Arabic", flag: "https://flagcdn.com/w20/sa.png" },
  { code: "ja", name: "Japanese", flag: "https://flagcdn.com/w20/jp.png" },
  { code: "iw", name: "Hebrew", flag: "https://flagcdn.com/w20/il.png" },
];

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(languageOptions[0]);

  useEffect(() => {
    // Check if we've already initialized
    if (window.googleTranslateElementInit) return;

    const addScript = () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) return;

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Initialize the Google Translate element
    window.googleTranslateElementInit = () => {
      const container = document.getElementById("google_translate_element");
      if (!container || !window.google?.translate?.TranslateElement) return;

      // Clear any existing content
      container.innerHTML = '';

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: languageOptions.map(lang => lang.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        "google_translate_element"
      );

      // Function to update current language
      const updateCurrentLanguage = () => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select) {
          const selectedLang = languageOptions.find(lang => lang.code === select.value);
          if (selectedLang) {
            setCurrentLanguage(selectedLang);
          }
        }
      };

      // Initial update
      updateCurrentLanguage();

      // Set up event listener for language changes
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.addEventListener('change', updateCurrentLanguage);
      }

      // Also check periodically in case the event listener doesn't catch all changes
      const interval = setInterval(updateCurrentLanguage, 1000);

      return () => {
        if (select) {
          select.removeEventListener('change', updateCurrentLanguage);
        }
        clearInterval(interval);
      };
    };

    // Add the script if Google Translate isn't already loaded
    if (!window.google?.translate) {
      addScript();
    } else if (window.google?.translate?.TranslateElement) {
      // If already loaded, initialize immediately
      window.googleTranslateElementInit();
    }

    return () => {
      // Clean up
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = langCode;
      const event = new Event('change');
      select.dispatchEvent(event);
    }
    setIsOpen(false);
  };

  return (
    <div className="google-translate-wrapper">
      {/* Remove display: 'none' to make the widget functional */}
      <div id="google_translate_element"></div>

      <div className="custom-translate-container">
        <button
          className="current-language-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change language"
        >
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            className="language-flag"
            width={20}
            height={20}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://flagcdn.com/w20/unknown.png';
            }}
          />
        </button>

        {isOpen && (
          <div className="language-dropdown">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${currentLanguage.code === lang.code ? 'active' : ''}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <Image
                  src={lang.flag}
                  alt={lang.name}
                  className="language-flag"
                  width={20}
                  height={20}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://flagcdn.com/w20/unknown.png';
                  }}
                />
                <span className="language-name">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;

// CSS styles
const styles = `
/* Google Translate default elements hiding */
.goog-te-gadget .goog-te-combo {
    margin: 0 !important;
}

.goog-te-banner-frame.skiptranslate {
    display: none !important;
}

body {
    top: 0 !important;
}

/* Custom translate styles */
.google-translate-wrapper {
    position: relative;
    display: inline-block;
}

.custom-translate-container {
    position: relative;
    z-index: 1000;
}

.current-language-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-radius: 4px;
    width: 20px;
    height: 20px;
}

.language-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    min-width: 150px;
    overflow: hidden;
    z-index: 1001;
    margin-top: 5px;
}

.language-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    color: #333;
    gap: 8px;
}

.language-option:hover {
    background: #f0f0f0;
}

.language-option.active {
    background: #e0e0e0;
    font-weight: bold;
}

.language-flag {
    width: 20px;
    height: 15px;
    object-fit: cover;
    border-radius: 2px;
}

.language-name {
    white-space: nowrap;
}
`;

// Add styles to the head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}