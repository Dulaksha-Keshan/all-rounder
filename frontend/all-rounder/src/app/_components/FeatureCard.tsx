'use client';
import { Feature } from './Features';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const FeatureCard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all feature images on component mount
  useEffect(() => {
    Feature.forEach((feature) => {
      const img = new Image();
      img.src = feature.image;
    });
  }, []);

  useGSAP(() => {
    gsap.fromTo('#title', { opacity: 0 }, { opacity: 1, duration: 1 });
    gsap.fromTo('.feature-visual img', { opacity: 0, xPercent: -100 }, {
      xPercent: 0, opacity: 1, duration: 1, ease: 'power1.inOut'
    });
    gsap.fromTo('.details h2', { yPercent: 100, opacity: 0 }, {
      yPercent: 0, opacity: 1, ease: 'power1.inOut', duration: 0.8
    });
    gsap.fromTo('.details p', { yPercent: 100, opacity: 0 }, {
      yPercent: 0, opacity: 1, ease: 'power1.inOut', duration: 0.8, delay: 0.1
    });
  }, [currentIndex]);

  const totalFeatures = Feature.length;

  const goToSlide = (index: number) => {
    const newIndex = (index + totalFeatures) % totalFeatures;
    setCurrentIndex(newIndex);
  };

  const getFeatureAt = (indexOffset: number) => {
    return Feature[(currentIndex + indexOffset + totalFeatures) % totalFeatures];
  };

  const currentFeature = getFeatureAt(0);
  const prevFeature = getFeatureAt(-1);
  const nextFeature = getFeatureAt(1);

  return (
    <section id="features" aria-labelledby="features-heading" className="relative py-12 sm:py-16 px-4 sm:px-6 bg-purple-100">
  
      <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--gray-700)] mb-4 sm:mb-6 text-center">
        Platform Features
      </h2>

      {/* Feature Navigation Tabs */}
      <nav className="feature-tabs flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 text-sm sm:text-base lg:text-lg px-2" aria-label="Feature Navigation">
        {Feature.map((feature, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={feature.id}
              className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-[var(--primary-purple)] text-[var(--white)] border-[var(--primary-purple)] shadow-lg scale-105'
                  : 'bg-[var(--white)] text-[var(--accent-purple-darker)] border-[var(--secondary-light-lavender)] hover:bg-[var(--secondary-light-lavender)] hover:border-[var(--primary-purple)]'
              }`}
              onClick={() => goToSlide(index)}
              aria-current={isActive ? 'true' : 'false'}
            >
              {feature.name}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <div className="content max-w-7xl mx-auto">
        {/* Navigation Arrows */}
        <div className="arrows flex justify-between items-center mb-6 sm:mb-8 px-2 sm:px-4">
          <button
            className="flex items-center gap-2 sm:gap-3 text-[var(--primary-dark-purple)] hover:text-[var(--primary-purple)] transition-colors group text-lg sm:text-xl"
            onClick={() => goToSlide(currentIndex - 1)}
            aria-label={`Previous feature: ${prevFeature.name}`}
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6"/>
            <span className="font-medium hidden sm:inline text-sm sm:text-base lg:text-lg">{prevFeature.name}</span>
          </button>

          <button
            className="flex items-center gap-2 sm:gap-3 text-[var(--primary-dark-purple)] hover:text-[var(--primary-purple)] transition-colors group text-lg sm:text-xl"
            onClick={() => goToSlide(currentIndex + 1)}
            aria-label={`Next feature: ${nextFeature.name}`}
          >
            <span className="font-medium hidden sm:inline text-sm sm:text-base lg:text-lg">{nextFeature.name}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6"/>
          </button>
        </div>

        {/* Feature Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Feature Visual */}
          <div className="feature-visual flex justify-center order-2 md:order-1">
            <img 
              src={currentFeature.image} 
              alt={currentFeature.name}
              className="object-contain max-h-[250px] sm:max-h-[350px] lg:max-h-[400px] w-full"
            />
          </div>

          {/* Feature Information */}
          <div className="feature-info space-y-4 sm:space-y-6 order-1 md:order-2">
            <div ref={contentRef} className="info">
              <p className="text-[var(--primary-purple)] font-semibold text-xs sm:text-sm uppercase tracking-wide mb-1 sm:mb-2">
                Feature Highlight
              </p>
              <p 
                id="title" 
                className="text-[var(--primary-dark-purple)] text-2xl sm:text-3xl lg:text-4xl font-bold"
              >
                {currentFeature.name}
              </p>
            </div>

            <div className="details space-y-3 sm:space-y-4 overflow-hidden">
              <h2 className="text-[var(--primary-blue)] text-xl sm:text-2xl font-semibold">
                {currentFeature.title}
              </h2>
              <p className="text-[var(--primary-dark-purple)] text-base sm:text-lg leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            {/* Feature Counter */}
            <div className="flex items-center gap-2 mt-4 sm:mt-6">
              <div className="h-1 flex-1 bg-[var(--secondary-light-lavender)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary-purple)] transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / totalFeatures) * 100}%` }}
                />
              </div>
              <span className="text-[var(--primary-purple)] font-medium text-xs sm:text-sm">
                {currentIndex + 1} / {totalFeatures}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;