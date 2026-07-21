import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 768px is typical iPad/tablet portrait boundary
      setIsMobile(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force video to load first frame
    video.load();

    const setupScrubbing = () => {
      // Small timeout ensures video duration is fully parsed in some browsers
      setTimeout(() => {
        if (!video.duration) return;

        gsap.to(video, {
          currentTime: video.duration,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }, 100);
    };

    // Listen for metadata to be loaded so we know the duration
    if (video.readyState >= 1) {
      setupScrubbing();
    } else {
      video.addEventListener('loadedmetadata', setupScrubbing);
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-[600vh] z-0">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#FAF6F0]">
        <video 
          key={isMobile ? "mobile" : "desktop"}
          ref={videoRef}
          src={isMobile ? "/hero-video-mobile.mp4" : "/hero-video-scrub.mp4"}
          className="w-full h-full object-cover opacity-90"
          preload="auto"
          muted
          playsInline
        />
      </div>
    </div>
  );
}
