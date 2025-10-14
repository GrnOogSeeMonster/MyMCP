import React from 'react';

export const VscodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 21l-4.5-4.5M3 3l4.5 4.5"/>
        <path d="M21 3l-4.5 4.5"/>
        <path d="M3 21l4.5-4.5"/>
        <path d="M12 2v20"/>
        <path d="M22 12H2"/>
    </svg>
);
