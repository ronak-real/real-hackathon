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
        
        {/* Face */}
        <ellipse cx="100" cy="100" rx="70" ry="75" fill="#FDBCB4" stroke="#8B4513" strokeWidth="2"/>
        
        {/* Hair */}
        <path d="M 40 70 Q 30 50, 50 40 Q 70 30, 100 35 Q 130 30, 150 40 Q 170 50, 160 70" 
              fill="#2C1810" stroke="#1a0f08" strokeWidth="1"/>
        
        {/* Eyes */}
        <g id="eyes">
          {/* Left eye */}
          <ellipse cx="75" cy="85" rx="15" ry="18" fill="white" stroke="#333" strokeWidth="1"/>
          <circle cx="75" cy="87" r="8" fill="#4A2C17"/>
          <circle cx="77" cy="85" r="3" fill="black"/>
          
          {/* Right eye */}
          <ellipse cx="125" cy="85" rx="15" ry="18" fill="white" stroke="#333" strokeWidth="1"/>
          <circle cx="125" cy="87" r="8" fill="#4A2C17"/>
          <circle cx="127" cy="85" r="3" fill="black"/>
          
          {/* Eyebrows based on emotion */}
          {emotion === 'worried' && (
            <>
              <path d="M 60 75 Q 75 70, 90 75" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 110 75 Q 125 70, 140 75" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
            </>
          )}
          {emotion === 'shocked' && (
            <>
              <path d="M 60 70 Q 75 65, 90 70" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 110 70 Q 125 65, 140 70" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
            </>
          )}
          {emotion === 'happy' && (
            <>
              <path d="M 60 78 Q 75 73, 90 78" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
              <path d="M 110 78 Q 125 73, 140 78" fill="none" stroke="#2C1810" strokeWidth="3" strokeLinecap="round"/>
            </>
          )}
        </g>
        
        {/* Nose */}
        <path d="M 100 95 Q 95 110, 100 115 Q 105 110, 100 95" 
              fill="#E8A98C" stroke="#8B4513" strokeWidth="1"/>
        
        {/* Mustache */}
        <g id="mustache">
          <path d="M 70 120 Q 60 125, 55 130 Q 60 135, 75 130 Q 85 125, 100 125 Q 115 125, 125 130 Q 140 135, 145 130 Q 140 125, 130 120"
                fill="#2C1810" stroke="#1a0f08" strokeWidth="1"/>
        </g>
        
        {/* Mouth based on emotion */}
        {emotion === 'happy' && (
          <path d="M 70 140 Q 100 155, 130 140" 
                fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
        )}
        {emotion === 'worried' && (
          <path d="M 70 145 Q 100 140, 130 145" 
                fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"/>
        )}
        {emotion === 'shocked' && (
          <ellipse cx="100" cy="145" rx="20" ry="15" fill="#8B4513" opacity="0.3"/>
        )}
        
        {/* Ears */}
        <ellipse cx="35" cy="100" rx="15" ry="25" fill="#FDBCB4" stroke="#8B4513" strokeWidth="2"/>
        <ellipse cx="165" cy="100" rx="15" ry="25" fill="#FDBCB4" stroke="#8B4513" strokeWidth="2"/>
        
        {/* Shirt collar */}
        <path d="M 50 160 Q 100 170, 150 160 L 150 190 L 50 190 Z" 
              fill="#FF6B35" stroke="#D84315" strokeWidth="2"/>
        <path d="M 90 170 L 100 180 L 110 170" 
              fill="white" stroke="#D84315" strokeWidth="1"/>
        
        {/* Gradients */}
        <defs>
          <radialGradient id="bgGradient">
            <stop offset="0%" stopColor="#FFE5B4" />
            <stop offset="100%" stopColor="#FFCC99" />
          </radialGradient>
        </defs>
        
        {/* Emotion indicators */}
        {emotion === 'worried' && (
          <g>
            <circle cx="60" cy="110" r="3" fill="#87CEEB" opacity="0.7">
              <animate attributeName="cy" values="110;115;110" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="65" cy="115" r="2" fill="#87CEEB" opacity="0.5">
              <animate attributeName="cy" values="115;120;115" dur="1s" repeatCount="indefinite"/>
            </circle>
          </g>
        )}
        {emotion === 'shocked' && (
          <g>
            <text x="30" y="50" fontSize="20" fill="#FF6B35" fontWeight="bold">!</text>
            <text x="160" y="50" fontSize="20" fill="#FF6B35" fontWeight="bold">!</text>
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