export default function Horizon() {
  return (
    <>
      {/* Localized glow behind the ridgeline — airglow / town light pollution */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main central warm glow */}
        <div
          className="absolute rounded-[100%]"
          style={{
            left: '20%',
            bottom: '-25%',
            width: '60%',
            height: '50%',
            background: 'radial-gradient(ellipse at center, rgba(217,194,138,0.2) 0%, rgba(217,194,138,0.05) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        {/* Secondary left reddish glow */}
        <div
          className="absolute rounded-[100%]"
          style={{
            left: '0%',
            bottom: '-15%',
            width: '40%',
            height: '35%',
            background: 'radial-gradient(ellipse at center, rgba(255,106,57,0.15) 0%, rgba(255,106,57,0.02) 50%, transparent 80%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Secondary right cool glow */}
        <div
          className="absolute rounded-[100%]"
          style={{
            left: '60%',
            bottom: '-10%',
            width: '50%',
            height: '30%',
            background: 'radial-gradient(ellipse at center, rgba(143,180,255,0.15) 0%, rgba(143,180,255,0.02) 50%, transparent 80%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Mountain ridgeline silhouette - Jagged and uneven */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="
            0,75 2,72 5,74 8,65 11,68 13,63 17,66 20,55 24,59 27,64 30,58
            34,62 38,52 42,56 46,45 50,53 54,49 57,58 60,54 64,65 68,58 72,62
            75,54 79,66 82,60 86,63 90,56 94,62 97,58 100,64
            100,100 0,100
          "
          fill="#0A0D16"
        />
        {/* Second slightly lighter overlapping layer for depth/texture */}
        <polygon
          points="
            0,80 3,76 7,81 12,74 16,77 22,68 28,73 33,67 37,71 42,61 48,68
            54,63 60,71 65,66 70,74 76,69 82,78 88,72 95,76 100,70
            100,100 0,100
          "
          fill="#05070D"
        />
      </svg>

      {/* Town lights — small warm dots in ridge valleys */}
      <div
        className="absolute pointer-events-none"
        style={{ left: '26%', bottom: '40%', width: 2, height: 2 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: '#D9C28A', opacity: 0.6, filter: 'blur(0.8px)', boxShadow: '0 0 8px #D9C28A' }}
        />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{ left: '65%', bottom: '44%', width: 1.5, height: 1.5 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: '#FF6A39', opacity: 0.5, filter: 'blur(0.5px)', boxShadow: '0 0 6px #FF6A39' }}
        />
      </div>
    </>
  );
}
