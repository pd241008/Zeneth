import { SVGProps } from 'react';

export default function TelescopeSilhouette(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Glass interior vignette: transparent center, dark edge */}
        <radialGradient id="glass-grad" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="rgba(10, 13, 22, 0)" />
          <stop offset="90%" stopColor="rgba(10, 13, 22, 0.4)" />
          <stop offset="100%" stopColor="rgba(5, 7, 13, 0.95)" />
        </radialGradient>

        {/* Specular highlight for glass reflection */}
        <radialGradient id="specular-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(143, 180, 255, 0.15)" />
          <stop offset="50%" stopColor="rgba(143, 180, 255, 0.05)" />
          <stop offset="100%" stopColor="rgba(143, 180, 255, 0)" />
        </radialGradient>

        {/* Shading for the mount/tripod */}
        <linearGradient id="mount-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#05070D" />
          <stop offset="30%" stopColor="#0A0D16" />
          <stop offset="70%" stopColor="#121826" />
          <stop offset="100%" stopColor="#05070D" />
        </linearGradient>

        {/* Leg shading */}
        <linearGradient id="leg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#05070D" />
          <stop offset="50%" stopColor="#0A0D16" />
          <stop offset="100%" stopColor="#010204" />
        </linearGradient>
      </defs>

      {/* --- Tripod Legs --- */}
      {/* Left leg */}
      <path d="M185 270 L100 400 L130 400 L195 270 Z" fill="url(#leg-grad)" />
      {/* Right leg */}
      <path d="M215 270 L300 400 L270 400 L205 270 Z" fill="url(#leg-grad)" />
      {/* Center/Back leg (darker, in shadow) */}
      <path d="M200 270 L215 400 L185 400 Z" fill="#020306" />

      {/* --- Mount and Knobs --- */}
      {/* Base cylinder */}
      <rect x="175" y="270" width="50" height="15" rx="3" fill="url(#mount-grad)" />
      {/* Vertical fork/pillar */}
      <rect x="180" y="220" width="40" height="50" fill="url(#mount-grad)" />
      {/* Central hinge/knob */}
      <circle cx="200" cy="225" r="15" fill="#0A0D16" />
      <circle cx="200" cy="225" r="8" fill="#05070D" />
      
      {/* Side adjustment knobs */}
      <rect x="160" y="235" width="20" height="20" rx="4" fill="#05070D" />
      <rect x="220" y="235" width="20" height="20" rx="4" fill="#0A0D16" />
      
      {/* --- Telescope Barrel (foreshortened) --- */}
      {/* Outer rim/back of barrel, partially visible */}
      <circle cx="200" cy="150" r="115" fill="#05070D" />
      {/* Secondary step-down ring */}
      <circle cx="200" cy="150" r="105" fill="#0A0D16" />

      {/* --- Eyepiece Ring (Outer) --- */}
      <circle cx="200" cy="150" r="95" fill="#0A0D16" />
      
      {/* Top rim-light on the outer ring to show metallic edge */}
      <path 
        d="M 105,150 A 95,95 0 0,1 295,150" 
        fill="none" 
        stroke="rgba(143,180,255,0.25)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />

      {/* Inner bezel / step-down to glass */}
      <circle cx="200" cy="150" r="85" fill="#020306" />
      
      {/* Inner rim-light (bottom edge catches ambient light) */}
      <path 
        d="M 115,150 A 85,85 0 0,0 285,150" 
        fill="none" 
        stroke="rgba(255,255,255,0.08)" 
        strokeWidth="1" 
        strokeLinecap="round"
      />

      {/* --- Glass --- */}
      {/* Transparent glass area with vignette to let stars show through */}
      <circle cx="200" cy="150" r="84" fill="url(#glass-grad)" />
      
      {/* Specular highlight reflection on the glass */}
      {/* Soft large flare */}
      <ellipse cx="145" cy="100" rx="35" ry="15" fill="url(#specular-grad)" transform="rotate(-35 145 100)" />
      {/* Sharp curved crescent reflection */}
      <path 
        d="M 125,120 A 75,75 0 0,1 175,85" 
        fill="none" 
        stroke="rgba(255,255,255,0.12)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        filter="blur(1px)"
      />
    </svg>
  );
}
