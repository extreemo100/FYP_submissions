export default function Home() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 800px 1000px at center center,
          #B8FF3C 0%,
          #95E030 10%,
          #6FB828 20%,
          #4A8428 30%,
          #2D4D1A 40%,
          #1A2D14 50%,
          #1B1034 65%,
          #110822 80%,
          #0A0416 100%)`,
      }}
    >
      {/* Content Container */}
      <div className="flex flex-col items-center justify-center">
        {/* Title */}
        <h1 
          className="text-white text-[60px] font-bold text-center mb-8"
          style={{ 
            fontFamily: 'Orbitron, system-ui, sans-serif', 
            letterSpacing: '0.01em',
            lineHeight: '1.1'
          }}
        >
          Talk to Rick<br />Sanchez
        </h1>

        {/* Button */}
        <button 
          className="bg-[#00FFFF] text-black text-[20px] font-semibold py-4 px-16 mb-6 hover:bg-[#00E0E7] active:scale-95 transition-all"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '25px'
          }}
        >
          Enter Rick's Lab
        </button>

        {/* Subtitle */}
        <p 
          className="text-white text-[18px] text-center font-semibold"
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '0.01em'
          }}
        >
          Enable camera & grant mic access
        </p>
      </div>
    </div>
  );
}