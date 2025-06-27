import { motion } from 'framer-motion';

const JethalalMascot = ({ emotion = 'happy', size = 'large' }) => {
  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
    xlarge: 'w-56 h-56'
  };

  const getEmotionAnimation = () => {
    switch (emotion) {
      case 'happy':
        return { rotate: [0, 5, -5, 0], y: [0, -10, 0] };
      case 'worried':
        return { rotate: [0, -3, 3, 0], scale: [1, 0.95, 1] };
      case 'shocked':
        return { scale: [1, 1.1, 1], rotate: [-5, 5, -5, 5, 0] };
      default:
        return { rotate: [0, 0] };
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={getEmotionAnimation()}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circle */}
        <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" />
        
        {/* Face - rounder to match reference */}
        <circle cx="100" cy="100" r="75" fill="#F5DEB3" stroke="#8B6F47" strokeWidth="2"/>
        
        {/* Hair - shorter and more realistic */}
        <path d="M 35 75 C 35 45, 65 25, 100 30 C 135 25, 165 45, 165 75 L 165 80 C 160 70, 140 65, 100 65 C 60 65, 40 70, 35 80 Z" 
              fill="#1C1C1C" stroke="#000000" strokeWidth="1"/>
        
        {/* Eyes */}
        <g id="eyes">
          {/* Left eye */}
          <ellipse cx="75" cy="85" rx="12" ry="15" fill="white" stroke="#333" strokeWidth="1.5"/>
          <circle cx="75" cy="87" r="7" fill="#3E2723"/>
          <circle cx="76" cy="85" r="2" fill="black"/>
          <circle cx="73" cy="84" r="1" fill="white"/>
          
          {/* Right eye */}
          <ellipse cx="125" cy="85" rx="12" ry="15" fill="white" stroke="#333" strokeWidth="1.5"/>
          <circle cx="125" cy="87" r="7" fill="#3E2723"/>
          <circle cx="126" cy="85" r="2" fill="black"/>
          <circle cx="123" cy="84" r="1" fill="white"/>
          
          {/* Eyebrows - thicker and more expressive */}
          {emotion === 'worried' && (
            <>
              <path d="M 58 75 Q 75 68, 88 75" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
              <path d="M 112 75 Q 125 68, 142 75" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
            </>
          )}
          {emotion === 'shocked' && (
            <>
              <path d="M 58 68 Q 75 60, 88 68" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
              <path d="M 112 68 Q 125 60, 142 68" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
            </>
          )}
          {emotion === 'happy' && (
            <>
              <path d="M 58 78 Q 75 73, 88 78" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
              <path d="M 112 78 Q 125 73, 142 78" fill="none" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round"/>
            </>
          )}
        </g>
        
        {/* Nose - more prominent */}
        <path d="M 100 95 L 95 110 Q 100 115, 105 110 L 100 95" 
              fill="#E5C29F" stroke="#8B6F47" strokeWidth="1.5"/>
        
        {/* Mustache - Napoleon/toothbrush style */}
        <g id="mustache">
          <rect x="85" y="118" width="30" height="8" rx="1" fill="#1C1C1C" stroke="#000000" strokeWidth="0.5"/>
        </g>
        
        {/* Mouth based on emotion */}
        {emotion === 'happy' && (
          <>
            <path d="M 65 140 Q 100 160, 135 140" 
                  fill="#D2691E" stroke="#8B4513" strokeWidth="2"/>
            <path d="M 65 140 Q 100 155, 135 140" 
                  fill="white" stroke="none"/>
            {/* Teeth */}
            <rect x="80" y="142" width="8" height="8" fill="white" stroke="#999" strokeWidth="0.5"/>
            <rect x="88" y="143" width="8" height="9" fill="white" stroke="#999" strokeWidth="0.5"/>
            <rect x="96" y="143" width="8" height="9" fill="white" stroke="#999" strokeWidth="0.5"/>
            <rect x="104" y="143" width="8" height="9" fill="white" stroke="#999" strokeWidth="0.5"/>
            <rect x="112" y="142" width="8" height="8" fill="white" stroke="#999" strokeWidth="0.5"/>
          </>
        )}
        {emotion === 'worried' && (
          <path d="M 75 145 Q 100 140, 125 145" 
                fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
        )}
        {emotion === 'shocked' && (
          <ellipse cx="100" cy="145" rx="25" ry="20" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
        )}
        
        {/* Ears */}
        <ellipse cx="30" cy="100" rx="18" ry="28" fill="#F5DEB3" stroke="#8B6F47" strokeWidth="2"/>
        <ellipse cx="170" cy="100" rx="18" ry="28" fill="#F5DEB3" stroke="#8B6F47" strokeWidth="2"/>
        
        {/* Orange shirt with collar */}
        <path d="M 40 165 L 40 190 L 160 190 L 160 165 C 160 160, 155 155, 150 155 L 125 160 L 100 165 L 75 160 L 50 155 C 45 155, 40 160, 40 165 Z" 
              fill="#FF7F00" stroke="#E55100" strokeWidth="2"/>
        
        {/* Collar */}
        <path d="M 70 155 L 85 165 L 100 170 L 115 165 L 130 155" 
              fill="none" stroke="#E55100" strokeWidth="2"/>
        <path d="M 85 165 L 85 175" stroke="#E55100" strokeWidth="2"/>
        <path d="M 115 165 L 115 175" stroke="#E55100" strokeWidth="2"/>
        
        {/* Gradients */}
        <defs>
          <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#FFE4B5" />
          </radialGradient>
        </defs>
        
        {/* Emotion indicators */}
        {emotion === 'worried' && (
          <g>
            <circle cx="55" cy="105" r="4" fill="#4FC3F7" opacity="0.8">
              <animate attributeName="cy" values="105;112;105" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="60" cy="110" r="3" fill="#4FC3F7" opacity="0.6">
              <animate attributeName="cy" values="110;116;110" dur="1.5s" repeatCount="indefinite" begin="0.3s"/>
            </circle>
          </g>
        )}
        {emotion === 'shocked' && (
          <g>
            <text x="25" y="45" fontSize="24" fill="#FF4500" fontWeight="bold" fontFamily="Arial">!</text>
            <text x="155" y="45" fontSize="24" fill="#FF4500" fontWeight="bold" fontFamily="Arial">!</text>
            <line x1="70" y1="50" x2="75" y2="45" stroke="#FFD700" strokeWidth="2">
              <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/>
            </line>
            <line x1="125" y1="45" x2="130" y2="50" stroke="#FFD700" strokeWidth="2">
              <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite"/>
            </line>
          </g>
        )}
      </svg>
      
      {/* Speech bubble stem */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-[10px] border-l-transparent 
                      border-t-[10px] border-t-white 
                      border-r-[10px] border-r-transparent">
      </div>
    </motion.div>
  );
};

export default JethalalMascot;