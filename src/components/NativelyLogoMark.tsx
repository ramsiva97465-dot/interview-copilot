import React from 'react';
import MeetFlooLogo from '../assets/logo.webp';

/**
 * MeetFloo HQ logomark — Vibrant 3D purple ribbon "MF" brand mark.
 */
export const MeetFlooLogoMark: React.FC<{
    size?: number;
    className?: string;
}> = ({ size = 18, className = '' }) => (
    <img
        src={MeetFlooLogo}
        alt="MeetFloo"
        width={size}
        height={size}
        className={`object-contain inline-block shrink-0 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        draggable={false}
    />
);
