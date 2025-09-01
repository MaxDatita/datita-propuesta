'use client';

import PrismaticBurst from './PrismaticBurst';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern - PrismaticBurst */}
      <div className="absolute inset-0 bg-black">
        <PrismaticBurst
          intensity={3}
          speed={0.3}
          animationType="rotate3d"
          colors={['#006581', '#e8c827', '#6ae16a']}
          distort={1.2}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.3}
          rayCount={32}
          mixBlendMode="lighten"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-green-200">
          proximamente
        </h1>
      </div>
    </section>
  );
}
