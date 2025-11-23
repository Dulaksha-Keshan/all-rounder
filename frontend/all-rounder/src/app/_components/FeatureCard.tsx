'use client';
import { Feature } from './Features';
import {  ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const FeatureCard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section id="features" aria-labelledby="features-heading" className="relative py-16 px-4 bg-purple-100">
  
    <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-700 mb-6 text-center">
      Platform Features
    </h2>

      {/* Feature Navigation Tabs */}
      <nav className="feature-tabs flex flex-wrap justify-center gap-4 mb-12 text-lg" aria-label="Feature Navigation">
        {Feature.map((feature, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={feature.id}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-[#8387CC] text-white border-[#8387CC] shadow-lg scale-105'
                  : 'bg-white text-[#6a6dad] border-[#DCD0FF] hover:bg-[#DCD0FF] hover:border-[#8387CC]'
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
        <div className="arrows flex justify-between items-center mb-8 px-4">
          <button
            className="flex items-center gap-3 text-[#34365C] hover:text-[#8387CC] transition-colors group text-xl"
            onClick={() => goToSlide(currentIndex - 1)}
            aria-label={`Previous feature: ${prevFeature.name}`}
          >

            <ArrowLeft/>
            <span className="font-medium hidden sm:inline">{prevFeature.name}</span>
          </button>

          <button
            className="flex items-center gap-3 text-[#34365C] hover:text-[#8387CC] transition-colors group text-xl"
            onClick={() => goToSlide(currentIndex + 1)}
            aria-label={`Next feature: ${nextFeature.name}`}
          >
            <span className="font-medium hidden sm:inline">{nextFeature.name}</span>
            <ArrowRight/>
          </button>
        </div>

        {/* Feature Display Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Feature Visual */}
          <div className="feature-visual flex justify-center">
            <img 
              src={currentFeature.image} 
              alt={currentFeature.name}
              className="object-contain max-h-[400px] w-full"
            />
          </div>

          {/* Feature Information */}
          <div className="feature-info space-y-6">
            <div ref={contentRef} className="info">
              <p className="text-[#8387CC] font-semibold text-sm uppercase tracking-wide mb-2">
                Feature Highlight
              </p>
              <p 
                id="title" 
                className="text-[#34365C] text-4xl font-bold"
              >
                {currentFeature.name}
              </p>
            </div>

            <div className="details space-y-4 overflow-hidden">
              <h2 className="text-[#4169E1] text-2xl font-semibold">
                {currentFeature.title}
              </h2>
              <p className="text-[#34365C] text-lg leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            {/* Feature Counter */}
            <div className="flex items-center gap-2 mt-6">
              <div className="h-1 flex-1 bg-[#DCD0FF] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8387CC] transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / totalFeatures) * 100}%` }}
                />
              </div>
              <span className="text-[#8387CC] font-medium text-sm">
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

