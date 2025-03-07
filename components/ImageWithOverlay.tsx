
import { useEffect, useRef, useState } from "react";

interface ImageWithOverlayProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithOverlay = ({ src, alt, className = "" }: ImageWithOverlayProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-shimmer" 
               style={{ transform: "translateX(-100%)" }} />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      <div className={`absolute inset-0 bg-primary-600/10 transition-opacity duration-500 ${isInView ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
};

export default ImageWithOverlay;
