import React from 'react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export default function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl", className)} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stylized 'F' */}
        <path 
          d="M25 20H80C82.7614 20 85 22.2386 85 25V35C85 37.7614 82.7614 40 80 40H40V55H70C72.7614 55 75 57.2386 75 60V70C75 72.7614 72.7614 75 70 75H40V85C40 87.7614 37.7614 90 35 90H25C22.2386 90 20 87.7614 20 85V25C20 22.2386 22.2386 20 25 20Z" 
          fill="#003366" 
        />
        {/* Pill Icon at bottom right area */}
        <rect x="45" y="65" width="40" height="20" rx="10" fill="white" stroke="#00A396" strokeWidth="4" />
        <path d="M45 75C45 69.4772 49.4772 65 55 65H65V85H55C49.4772 85 45 80.5228 45 75Z" fill="#00A396" />
      </svg>
    </div>
  );
}
