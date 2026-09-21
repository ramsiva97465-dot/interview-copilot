import React from 'react';

/**
 * Xivora logomark — "X" letterform inscribed in a circle.
 * Rendered as inline SVG so it inherits `color` (currentColor) and
 * can be styled freely with className.
 */
export const NativelyLogoMark: React.FC<{
    size?: number;
    className?: string;
}> = ({ size = 18, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
    >
        {/* Outer circle */}
        <circle
            cx="50"
            cy="50"
            r="47"
            stroke="currentColor"
            strokeWidth="5"
        />

        {/* Diagonal 1: Top-Left to Bottom-Right */}
        <line
            x1="28" y1="28"
            x2="72" y2="72"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
        />

        {/* Diagonal 2: Top-Right to Bottom-Left */}
        <line
            x1="72" y1="28"
            x2="28" y2="72"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
        />
    </svg>
);
