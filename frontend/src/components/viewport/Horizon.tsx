export default function Horizon() {
  return (
    <>
      {/* Warm glow band along ridgeline — airglow / light pollution */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 48%, rgba(217,194,138,0) 52%, rgba(217,194,138,0.06) 55%, rgba(217,194,138,0.12) 58%, rgba(217,194,138,0.04) 62%, transparent 68%)',
        }}
      />

      {/* Mountain ridgeline silhouette */}
      <svg
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points="
            0,68  3,65  7,69 11,60 15,63 19,54 24,58 28,61
            32,55 36,50 40,57 45,53 49,46 53,53 58,50
            62,57 66,48 70,54 74,58 78,51 82,56 86,61
            91,59 95,63 100,66
            100,100 0,100
          "
          fill="#0A0D16"
        />
      </svg>

      {/* Town lights — small warm dots in ridge valleys */}
      <div
        className="absolute pointer-events-none"
        style={{ left: '28%', bottom: '39%', width: 3, height: 3 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: '#D9C28A', opacity: 0.35, filter: 'blur(1px)' }}
        />
      </div>
      <div
        className="absolute pointer-events-none"
        style={{ left: '67%', bottom: '43%', width: 2, height: 2 }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: '#D9C28A', opacity: 0.25, filter: 'blur(0.8px)' }}
        />
      </div>
    </>
  );
}
