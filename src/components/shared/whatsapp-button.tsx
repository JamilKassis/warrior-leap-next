'use client';

import React, { useState } from 'react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, message }) => {
  const [isMobileTooltipVisible, setIsMobileTooltipVisible] = useState(false);

  const formattedPhone = phoneNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  const toggleMobileTooltip = () => {
    setIsMobileTooltipVisible(!isMobileTooltipVisible);
    if (!isMobileTooltipVisible) {
      setTimeout(() => {
        setIsMobileTooltipVisible(false);
      }, 2000);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768 && e.target === e.currentTarget) {
      e.preventDefault();
      toggleMobileTooltip();
      return;
    }
    if (typeof window !== 'undefined' && (window as any).gtag_report_conversion) {
      (window as any).gtag_report_conversion(whatsappUrl);
    }
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 pb-safe pr-safe z-[60] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#1da851] transition-all duration-300 hover:scale-110 group animate-whatsapp-pulse"
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' }}
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60 duration-1000 hidden group-hover:block" />

      <svg
        width="28"
        height="28"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="md:w-9 md:h-9 flex items-center justify-center m-auto"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.6066 3.39344C14.8135 1.60034 12.4475 0.603881 9.9536 0.601562C5.05437 0.601562 1.06696 4.58852 1.06328 9.48879C1.06204 11.0408 1.45479 12.5587 2.19655 13.9108L1 19L6.19888 17.8318C7.50221 18.5096 8.96362 18.8661 10.4503 18.8667H10.4545C15.3526 18.8667 19.3406 14.8791 19.3443 9.97897C19.346 7.48892 18.3536 5.17906 16.6066 3.39344ZM9.9536 17.3337H9.95031C8.61525 17.3331 7.30603 16.9934 6.14661 16.3536L5.8511 16.1842L3.24909 16.8699L3.94573 14.3316L3.7593 14.0225C3.05333 12.8251 2.68311 11.4436 2.68451 10.0278C2.68732 5.53505 5.94245 1.87356 9.95689 1.87356C12.0207 1.87542 13.9669 2.7074 15.4152 4.18642C16.8635 5.66545 17.6648 7.63422 17.663 9.70044C17.6602 14.1932 14.405 17.3337 9.9536 17.3337ZM14.2164 11.4489C13.9697 11.3255 12.8185 10.7592 12.591 10.6749C12.3634 10.5907 12.1976 10.5486 12.0318 10.7952C11.866 11.0419 11.4191 11.5662 11.2753 11.732C11.1315 11.8978 10.9877 11.9189 10.741 11.7954C10.4943 11.6719 9.72136 11.4228 8.82078 10.6147C8.11931 9.9779 7.64562 9.19669 7.50181 8.94997C7.35807 8.70325 7.48637 8.57182 7.60942 8.45188C7.71988 8.344 7.85403 8.16816 7.97676 8.02438C8.09949 7.8806 8.14158 7.7754 8.22581 7.60962C8.31004 7.44385 8.26795 7.30007 8.20477 7.17661C8.14158 7.05316 7.67049 5.90114 7.46388 5.40723C7.26349 4.92769 7.0604 4.99087 6.90812 4.98253C6.76435 4.97466 6.59858 4.97324 6.4328 4.97324C6.26702 4.97324 5.99767 5.03642 5.77013 5.28315C5.54258 5.52987 4.93412 6.09616 4.93412 7.24815C4.93412 8.40014 5.79117 9.51001 5.9139 9.67579C6.03664 9.84157 7.64281 12.3323 10.1142 13.3306C10.7318 13.595 11.2133 13.7535 11.5889 13.8727C12.2083 14.0673 12.7699 14.0394 13.2156 13.975C13.7143 13.9031 14.6515 13.4054 14.8581 12.8274C15.0647 12.2495 15.0647 11.7556 14.9917 11.638C14.9188 11.5203 14.7632 11.4594 14.5164 11.336L14.2164 11.4489Z"
          fill="white"
        />
      </svg>

      <span className="absolute right-full mr-3 whitespace-nowrap bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium hidden md:group-hover:block transition-opacity">
        Chat on WhatsApp
        <span className="absolute top-1/2 right-0 -mt-1.5 -mr-1.5 border-4 border-transparent border-l-white" />
      </span>

      {isMobileTooltipVisible && (
        <span className="absolute right-full mr-3 whitespace-nowrap bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium block md:hidden animate-scale-fade-in">
          Chat on WhatsApp
          <span className="absolute top-1/2 right-0 -mt-1.5 -mr-1.5 border-4 border-transparent border-l-white" />
        </span>
      )}
    </a>
  );
};

export default WhatsAppButton;
