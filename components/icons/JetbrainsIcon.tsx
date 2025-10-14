import React from 'react';

export const JetbrainsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M0 12l6-6v12l-6-6z"/>
        <path d="M18 0l-6 6h12l-6-6z"/>
        <path d="M6 6l6 6l-6 6l-6-6z"/>
        <path d="M18 12l6 6V6l-6 6z"/>
    </svg>
);
