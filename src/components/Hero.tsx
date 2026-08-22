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

  @keyframes skipToContact {
    0%, 100% {
      opacity: 0.55;
      transform: translateY(-2px);
    }
    50% {
      opacity: 1;
      transform: translateY(2px);
    }
  }

  .skip-to-contact-chevron {
    animation: skipToContact 2.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .skip-to-contact-chevron {
      animation: none;
    }
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

  const tokens = text.split(/(\s+)/);
  let charOffset = 0;

  return (
    <div ref={ref} className={className}>
      {tokens.map((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          return <span key={tokenIndex}>{' '}</span>;
        }

        const start = charOffset;
        charOffset += token.length;

        return (
          <span key={tokenIndex} className="inline-block whitespace-nowrap">
            {token.split('').map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-4'
                }`}
                style={{
                  transitionDelay: `${(start + i) * 50}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
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
  const [skipTheme, setSkipTheme] = useState<'dark' | 'light'>('dark');
  const [showSkip, setShowSkip] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll<HTMLElement>('[data-skip-theme]');
    const ratios = new Map<Element, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target, entry.intersectionRatio);
        });

        const contact = contactSectionRef.current;
        if (contact && (ratios.get(contact) ?? 0) >= 0.4) {
          setShowSkip(false);
          return;
        }

        let best: HTMLElement | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, el) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el as HTMLElement;
          }
        });

        if (!best || bestRatio < 0.35) return;

        const active = best as HTMLElement;
        setShowSkip(active.dataset.skipHide !== 'true');
        setSkipTheme(active.dataset.skipTheme === 'light' ? 'light' : 'dark');
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const container = scrollContainerRef.current;
    const contact = contactSectionRef.current;
    if (!container || !contact) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.style.scrollSnapType = 'none';
    setShowSkip(false);
    container.scrollTo({
      top: contact.offsetTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    window.setTimeout(() => {
      container.style.scrollSnapType = '';
    }, prefersReducedMotion ? 0 : 1200);
  };

  const skipOnLight = skipTheme === 'light';

  return (
    <div className="relative h-screen">
      <div ref={scrollContainerRef} className="h-full snap-y snap-mandatory overflow-y-scroll">
      {/* Hero Section - Pantalla completa */}
      <section data-skip-theme="dark" className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
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
      <section data-skip-theme="light" className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 bg-white">
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
      <section data-skip-theme="light" className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 bg-white overflow-hidden">
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
            <AnimatedText
              text=" que transformará todo lo que hacemos.'"
              delay={200}
            />
          </div>
          <AnimatedText
            text="— Sundar Pichai, CEO de Google"
            className="block mt-8 text-lg md:text-xl text-gray-600 font-medium"
            delay={1200}
          />
        </div>

      </section>

      {/* Tercera sección - Presentación del personaje */}
      <section data-skip-theme="dark" className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-emerald-900"></div>

        {/* Logo desktop - alineado con la foto a la izquierda */}
        <div className="hidden lg:block absolute top-1/58 left-8 z-20">
          <img 
            src="/logoHero.webp" 
            alt="Datita" 
            className="h-24"
          />
        </div>

        {/* Logo mobile - alineado con la foto a la izquierda */}
        <div className="lg:hidden absolute top-1/28 left-4 z-20">
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
      <section data-skip-theme="dark" className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
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
      <section
        id="contacto"
        ref={contactSectionRef}
        data-skip-theme="dark"
        data-skip-hide="true"
        className="snap-start relative h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden"
      >
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
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-32 sm:mt-8">
          <div className="space-y-12">
            {/* Descripción */}
            <div className="mb-12">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Estás a un paso de transformar tu negocio. Hoy podés empezar a ahorrar tiempo y reducir costos con IA 🚀
              </p>
            </div>

            {/* Botones de contacto */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 justify-center items-center w-full max-w-2xl mx-auto">
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

              {/* Botón 3 - WhatsApp */}
              <a 
                href="https://wa.me/542302615587?text=Hola%20Maxi,%20me%20interesa%20conocer%20más%20sobre%20cómo%20la%20IA%20puede%20ayudar%20a%20mi%20negocio" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-[calc(50%-12px)] justify-center"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
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

        <div
          className={`skip-to-contact pointer-events-none absolute right-4 sm:right-8 z-30 inline-flex w-fit flex-col items-stretch gap-1.5 text-[11px] leading-none transition-opacity duration-300 ${
            showSkip ? 'opacity-100' : 'hidden opacity-0'
          }`}
          style={{ bottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem))' }}
          aria-hidden={!showSkip}
        >
          <label
            htmlFor="skip-to-contact"
            className={`pointer-events-auto cursor-pointer text-center font-light tracking-wide transition-colors duration-300 ${
              skipOnLight
                ? 'text-slate-700 hover:text-slate-900'
                : 'text-white/80 hover:text-white'
            } ${showSkip ? '' : 'pointer-events-none'}`}
          >
            Hablemos
          </label>
          <button
            id="skip-to-contact"
            type="button"
            onClick={scrollToContact}
            tabIndex={showSkip ? 0 : -1}
            aria-label="Hablemos"
            className={`pointer-events-auto flex h-[calc(1em+8px)] w-full items-center justify-center overflow-hidden rounded-full border p-0 backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
              skipOnLight
                ? 'border-slate-900/20 bg-slate-900/10 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.12)] hover:border-slate-900/35 hover:bg-slate-900/15 focus-visible:ring-cyan-700/50'
                : 'border-white/25 bg-white/10 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.28)] hover:border-white/40 hover:bg-white/16 hover:text-white focus-visible:ring-cyan-300/70'
            } ${showSkip ? '' : 'pointer-events-none'}`}
          >
            <svg
              className={`skip-to-contact-chevron h-[0.7em] w-[0.7em] ${
                skipOnLight ? 'text-cyan-700' : 'text-cyan-200'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
    </div>
  );
}
