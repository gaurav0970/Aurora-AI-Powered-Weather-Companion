const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
      {/* Aurora layer 1 - Teal */}
      <div 
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[100%] animate-aurora-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(173 80% 50% / 0.15) 0%, transparent 70%)',
          transform: 'rotate(-12deg)',
        }}
      />
      
      {/* Aurora layer 2 - Purple */}
      <div 
        className="absolute -top-1/3 -right-1/4 w-[120%] h-[80%] animate-aurora-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(280 60% 50% / 0.12) 0%, transparent 60%)',
          transform: 'rotate(15deg)',
          animationDelay: '2s',
        }}
      />
      
      {/* Aurora layer 3 - Green */}
      <div 
        className="absolute top-1/4 -left-1/3 w-[100%] h-[60%] animate-aurora-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(160 70% 45% / 0.1) 0%, transparent 50%)',
          transform: 'rotate(-5deg)',
          animationDelay: '4s',
        }}
      />
      
      {/* Aurora layer 4 - Pink accent */}
      <div 
        className="absolute top-0 right-1/4 w-[80%] h-[50%] animate-aurora-pulse"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(330 70% 55% / 0.08) 0%, transparent 50%)',
          transform: 'rotate(20deg)',
          animationDelay: '6s',
        }}
      />

      {/* Flowing gradient overlay */}
      <div 
        className="absolute inset-0 animate-aurora-flow opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(173 80% 50% / 0.1) 0%, hsl(280 60% 50% / 0.1) 25%, hsl(160 70% 45% / 0.1) 50%, hsl(330 70% 55% / 0.1) 75%, hsl(173 80% 50% / 0.1) 100%)',
        }}
      />

      {/* Subtle stars/particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuroraBackground;
