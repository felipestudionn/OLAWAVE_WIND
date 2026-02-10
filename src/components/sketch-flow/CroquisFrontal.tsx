'use client';

interface CroquisFrontalProps {
  className?: string;
}

export default function CroquisFrontal({ className }: CroquisFrontalProps) {
  return (
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Center guideline */}
      <line x1="150" y1="18" x2="150" y2="485" stroke="#E8E8E8" strokeWidth="0.4" strokeDasharray="4 4" />

      {/* Head - oval */}
      <ellipse cx="150" cy="38" rx="16" ry="20" fill="none" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Hair indication */}
      <path d="M134 30 Q134 20 150 18 Q166 20 166 30" fill="none" stroke="#CCCCCC" strokeWidth="0.5" />

      {/* Face - minimal */}
      <circle cx="144" cy="34" r="1.2" fill="#CCCCCC" />
      <circle cx="156" cy="34" r="1.2" fill="#CCCCCC" />
      <line x1="150" y1="38" x2="150" y2="43" stroke="#CCCCCC" strokeWidth="0.4" />
      <path d="M146 48 Q150 50 154 48" fill="none" stroke="#CCCCCC" strokeWidth="0.4" />

      {/* Neck */}
      <line x1="144" y1="58" x2="144" y2="72" stroke="#CCCCCC" strokeWidth="0.75" />
      <line x1="156" y1="58" x2="156" y2="72" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Shoulders */}
      <path d="M144 72 Q140 74 95 83" fill="none" stroke="#CCCCCC" strokeWidth="0.75" />
      <path d="M156 72 Q160 74 205 83" fill="none" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Torso - left side */}
      <path d="M95 83 L92 95 L90 110 Q88 135 93 160 Q96 178 105 200 L110 210"
            fill="none" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Torso - right side */}
      <path d="M205 83 L208 95 L210 110 Q212 135 207 160 Q204 178 195 200 L190 210"
            fill="none" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Left arm */}
      <path d="M95 83 L85 100 L78 130 L74 160 L72 190 L71 210 L72 220"
            fill="none" stroke="#CCCCCC" strokeWidth="0.65" />
      {/* Left hand */}
      <path d="M72 220 L70 228 M72 220 L72 229 M72 220 L74 228"
            fill="none" stroke="#CCCCCC" strokeWidth="0.4" />

      {/* Right arm */}
      <path d="M205 83 L215 100 L222 130 L226 160 L228 190 L229 210 L228 220"
            fill="none" stroke="#CCCCCC" strokeWidth="0.65" />
      {/* Right hand */}
      <path d="M228 220 L226 228 M228 220 L228 229 M228 220 L230 228"
            fill="none" stroke="#CCCCCC" strokeWidth="0.4" />

      {/* Waist line subtle */}
      <line x1="93" y1="160" x2="207" y2="160" stroke="#E8E8E8" strokeWidth="0.3" strokeDasharray="2 3" />

      {/* Hips / Crotch */}
      <path d="M110 210 L115 230 L120 248 Q135 255 150 258 Q165 255 180 248 L185 230 L190 210"
            fill="none" stroke="#CCCCCC" strokeWidth="0.75" />

      {/* Left leg */}
      <path d="M120 248 L118 280 L117 310 L116 340 L117 370 L118 400 L119 430 L120 455"
            fill="none" stroke="#CCCCCC" strokeWidth="0.7" />
      {/* Left leg inner */}
      <path d="M150 258 L145 280 L140 310 L138 340 L137 370 L137 400 L137 430 L137 455"
            fill="none" stroke="#CCCCCC" strokeWidth="0.7" />

      {/* Right leg */}
      <path d="M180 248 L182 280 L183 310 L184 340 L183 370 L182 400 L181 430 L180 455"
            fill="none" stroke="#CCCCCC" strokeWidth="0.7" />
      {/* Right leg inner */}
      <path d="M150 258 L155 280 L160 310 L162 340 L163 370 L163 400 L163 430 L163 455"
            fill="none" stroke="#CCCCCC" strokeWidth="0.7" />

      {/* Left foot */}
      <path d="M120 455 L115 460 L110 462 L108 465 M137 455 L135 460 L130 462"
            fill="none" stroke="#CCCCCC" strokeWidth="0.5" />

      {/* Right foot */}
      <path d="M180 455 L185 460 L190 462 L192 465 M163 455 L165 460 L170 462"
            fill="none" stroke="#CCCCCC" strokeWidth="0.5" />

      {/* Bust line subtle */}
      <line x1="90" y1="110" x2="210" y2="110" stroke="#E8E8E8" strokeWidth="0.3" strokeDasharray="2 3" />

      {/* Hip line subtle */}
      <line x1="105" y1="200" x2="195" y2="200" stroke="#E8E8E8" strokeWidth="0.3" strokeDasharray="2 3" />
    </svg>
  );
}
