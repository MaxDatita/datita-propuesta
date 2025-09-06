'use client';

import { useEffect, useState, useRef } from 'react';
import PrismaticBurst from './PrismaticBurst';

// Agregar estilos CSS para la animación
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 1s ease-out 0.5s forwards;
  }
`;

// Inyectar estilos en el head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Componente para animación de texto letra por letra
const AnimatedText = ({ text, className = '', delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {text.split('').map((char, charIndex) => (
        <span
          key={charIndex}
          className={`inline-block transition-all duration-500 ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-4'
          }`}
          style={{
            transitionDelay: `${(charIndex * 50)}ms`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

// Componente para animación de números
const AnimatedNumber = ({ value, suffix = '', className = '', delay = 0 }: { value: number, suffix?: string, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 segundos
      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Función de easing (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        setDisplayValue(Math.floor(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, value]);

  return (
    <div ref={ref} className={className}>
      <span className={`transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        {displayValue.toLocaleString()}{suffix}
      </span>
    </div>
  );
};

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      {/* Hero Section - Pantalla completa */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
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

       

        {/* Logo en la parte superior */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <img 
            src="/logoHero.webp" 
            alt="Datita" 
            className="h-22 md:h-26 lg:h-42"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            El futuro de tu negocio comienza con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-yellow-300 animate-pulse whitespace-nowrap">
              Inteligencia Artificial
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Descubrí cómo la IA en conjunto con la automatización pueden{' '}
            <span className="text-green-300 font-medium">reducir costos</span>,{' '}
            <span className="text-green-300 font-medium">ahorrar tiempo</span> y{' '}
            <span className="text-green-300 font-medium">abrir nuevas oportunidades</span> para tu empresa.
          </p>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-25 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center text-white/70">
            <span className="text-sm mb-2">Desliza para continuar</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Primera sección blanca */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 bg-white">
        <div className="text-center max-w-4xl mx-auto">
          <div className="text-4xl md:text-6xl lg:text-7xl font-sans font-light text-gray-900 mb-8 leading-tight">
            <AnimatedText
              text="Preparate para un"
              delay={200}
            />
            <span className="text-green-300 font-bold whitespace-nowrap">
              <AnimatedText
                text="cambio radical"
                delay={200}
              />
            </span>
          </div>
        </div>
      </section>

      {/* Segunda sección blanca - Frase del CEO de Google */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 bg-white overflow-hidden">
        <div className="text-center max-w-5xl mx-auto">
          <div className="text-2xl md:text-4xl lg:text-5xl font-sans font-light text-gray-800 leading-relaxed">
              <AnimatedText
                text="'La inteligencia artificial "
                delay={200}
              />
              <AnimatedText
                text="es como el"
                delay={200}
              />
            <span className="text-orange-600 whitespace-nowrap">
              <AnimatedText
                text="descubrimiento del fuego."
                delay={200}
              />
            </span>
            <AnimatedText
              text="Es una "
              delay={200}
            />
            <span className="text-blue-600 whitespace-nowrap">
              <AnimatedText
                text="herramienta fundamental"
                delay={200}
              />
            </span>
            <span className="whitespace-pre-wrap">
              <AnimatedText
                text=" que transformará todo lo que hacemos.'"
                delay={200}
              />
            </span>
          </div>
          <AnimatedText
            text="— Sundar Pichai, CEO de Google"
            className="block mt-8 text-lg md:text-xl text-gray-600 font-medium"
            delay={1200}
          />
        </div>

      </section>

      {/* Tercera sección - Presentación del personaje */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900"></div>

        {/* Logo desktop - alineado con la foto a la izquierda */}
        <div className="hidden lg:block absolute top-1/22 left-8 z-20">
          <img 
            src="/logoHero.webp" 
            alt="Datita" 
            className="h-24"
          />
        </div>

        {/* Logo mobile - alineado con la foto a la izquierda */}
        <div className="lg:hidden absolute top-1/8 left-4 z-20">
          <img 
            src="/logoMobile.webp" 
            alt="Datita" 
            className="h-10"
          />
        </div>

        {/* Contenido del personaje */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Foto del personaje */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto rounded-3xl overflow-hidden opacity-0 animate-fade-in">
              <img 
                src="/max-datita.webp" 
                alt="Max Datita" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
          </div>

          {/* Nombre del personaje */}
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white mb-3 sm:mb-4">
            Hola soy Maxi 👋🏼
          </h2>

          {/* Descripción */}
          <p className="text-base sm:text-2xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Y desde <span className="text-green-300 font-medium">Datita</span> ayudamos a empresas y emprendedores a adaptarse a la nueva era de la Inteligencia Artificial. Creemos que la IA no es solo tecnología, sino una herramienta para hacer más con menos, mejorar procesos y abrir nuevas oportunidades, por eso compartimos conocimiento, diseñamos soluciones prácticas y acompañamos a los negocios en su camino hacia la innovación.
          </p>
          {/* Botón de contacto */}
          {/* <button className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Contáctame
          </button> */}
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center text-white/70">
            <span className="text-sm mb-2">Desliza para continuar</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuarta sección - Estadísticas de IA */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900"></div>

        {/* Logo desktop - alineado arriba a la izquierda */}
        <div className="hidden lg:block absolute top-8 left-8 z-20">
          <img 
            src="/logoHero.webp" 
            alt="Datita" 
            className="h-24"
          />
        </div>

        {/* Logo mobile - alineado arriba a la izquierda */}
        <div className="lg:hidden absolute top-4 left-4 z-20">
          <img 
            src="/logoMobile.webp" 
            alt="Datita" 
            className="h-10"
          />
        </div>

        {/* Título arriba */}
        <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold">
            <AnimatedText
              text="La IA en números"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold bg-clip-text text-green-200 whitespace-nowrap"
              delay={200}
            />
          </h2>
        </div>

        {/* Contenido de estadísticas */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 mt-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Estadística 1 */}
            <div className="text-center">
              <div className="mb-4">
                <AnimatedNumber
                  value={80}
                  suffix="%"
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-cyan-300"
                  delay={400}
                />
              </div>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                de las empresas que implementan IA ya mejoraron su productividad
              </p>
            </div>

            {/* Estadística 2 */}
            <div className="text-center">
              <div className="mb-4">
                <AnimatedNumber
                  value={15.7}
                  suffix="$"
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-300"
                  delay={600}
                />
              </div>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                billones será el impacto económico global de la IA en 2030
              </p>
            </div>

            {/* Estadística 3 */}
            <div className="text-center">
              <div className="mb-4">
                <AnimatedNumber
                  value={75}
                  suffix="%"
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-orange-300"
                  delay={800}
                />
              </div>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                de los negocios reducen costos operativos al automatizar procesos
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center text-white/70">
            <span className="text-sm mb-2">Desliza para continuar</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quinta sección - Contacto */}
      <section className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900"></div>

        {/* Logo desktop - alineado arriba a la izquierda */}
        <div className="hidden lg:block absolute top-8 left-8 z-20">
          <img 
            src="/logoHero.webp" 
            alt="Datita" 
            className="h-24"
          />
        </div>

        {/* Logo mobile - alineado arriba a la izquierda */}
        <div className="lg:hidden absolute top-4 left-4 z-20">
          <img 
            src="/logoMobile.webp" 
            alt="Datita" 
            className="h-10"
          />
        </div>

        {/* Título arriba */}
        <div className="absolute top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold">
            <AnimatedText
              text="¿Listo para comenzar?"
              className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold bg-clip-text text-green-200 whitespace-nowrap"
              delay={200}
            />
          </h2>
        </div>

        {/* Contenido de contacto */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-8">
          <div className="space-y-12">
            {/* Descripción */}
            <div className="mb-12">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Estás a un paso de transformar tu negocio. Hoy podés empezar a ahorrar tiempo y reducir costos con IA 🚀
              </p>
            </div>

            {/* Botones de contacto */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl mx-auto">
              {/* Botón 1 - Agendar reunión */}
              <a 
                href="https://devcal.datitatech.com/maxichamas/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto sm:flex-1 justify-center"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <span>Agendar reunión</span>
              </a>

              {/* Botón 2 - Formulario de contacto */}
              <a 
                href="https://tally.so/r/3E24Ol" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto sm:flex-1 justify-center"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                <span>Formulario de contacto</span>
              </a>
            </div>

            {/* Texto adicional */}
            <div className="mt-8">
              <p className="text-gray-400 text-sm">
                Elige la opción que prefieras para comenzar
              </p>
            </div>

            {/* Información de DatitaTech */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <div className="text-center">
                <a 
                  href="https://datitatech.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                >
                  <span>Visitar datitatech.com</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
