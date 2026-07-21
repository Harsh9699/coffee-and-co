import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          ref={videoRef}
          src="/hero-video.mp4"
          className="w-full h-full object-cover opacity-90"
          preload="auto"
          muted
          playsInline
        />
      </div>
    </div>
  );
}
