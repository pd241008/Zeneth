function seededRandom(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

export interface StarParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface StarLayerData {
  stars: StarParticle[];
  translateYRange: number;
  scaleMax: number;
  blurMax: number;
}

const LAYER_CONFIGS = [
  {
    count: 150,
    sizeRange: [0.5, 1.5] as const,
    opacityRange: [0.15, 0.4] as const,
    translateYRange: 5,
    scaleMax: 1,
    blurMax: 0,
  },
  {
    count: 80,
    sizeRange: [1.0, 3.0] as const,
    opacityRange: [0.3, 0.7] as const,
    translateYRange: 20,
    scaleMax: 1.15,
    blurMax: 0,
  },
  {
    count: 20,
    sizeRange: [3.0, 8.0] as const,
    opacityRange: [0.4, 0.8] as const,
    translateYRange: 45,
    scaleMax: 1,
    blurMax: 4,
  },
];

const SEEDS = [7919, 15887, 23857];

export function generateStarLayers(): StarLayerData[] {
  return LAYER_CONFIGS.map((cfg, i) => {
    const rand = seededRandom(SEEDS[i]);
    const stars: StarParticle[] = [];
    for (let j = 0; j < cfg.count; j++) {
      stars.push({
        x: rand(),
        y: rand(),
        size: cfg.sizeRange[0] + rand() * (cfg.sizeRange[1] - cfg.sizeRange[0]),
        opacity: cfg.opacityRange[0] + rand() * (cfg.opacityRange[1] - cfg.opacityRange[0]),
      });
    }
    return {
      stars,
      translateYRange: cfg.translateYRange,
      scaleMax: cfg.scaleMax,
      blurMax: cfg.blurMax,
    };
  });
}
