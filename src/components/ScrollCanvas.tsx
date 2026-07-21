import { useEffect, useRef } from 'react';

const FRAME_COUNT = 300;

// Pad numbers to match `frame_0001.jpg` format
const currentFrame = (index: number) => (
  `/frames/frame_${index.toString().padStart(4, '0')}.jpg`
);

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(1);

  // Preload first few frames immediately, then lazy load the rest
  useEffect(() => {
    const initialLoad = 10;
    
    // 1. Load initial frames fast
    for (let i = 1; i <= initialLoad; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      imagesRef.current[i - 1] = img;
    }

    // 2. Load the rest in the background without freezing the browser
    let currentIndex = initialLoad + 1;
    
    const loadNextBatch = () => {
      if (currentIndex > FRAME_COUNT) return;
      
      const batchSize = 10;
      const end = Math.min(currentIndex + batchSize, FRAME_COUNT + 1);
      
      for (let i = currentIndex; i < end; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        imagesRef.current[i - 1] = img;
      }
      
      currentIndex = end;
      
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNextBatch);
      } else {
        setTimeout(loadNextBatch, 50);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadNextBatch);
    } else {
      setTimeout(loadNextBatch, 200);
    }
  }, []);

  // Set up Canvas and draw initial frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = currentFrame(1);
    
    img.onload = () => {
      // Set canvas dimensions strictly to viewport or desired responsive size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
  }, []);

  // Update canvas on scroll
  useEffect(() => {
    const updateImage = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      const img = imagesRef.current[index - 1]; // arrays are 0-indexed, frames are 1-indexed
      if (!img || !img.complete) return;

      // Handle window resize dynamically in drawing
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollTop = -rect.top;
      
      // Calculate max scrollable area relative to the sticky container height vs section height
      // The section height minus viewport height is the distance we can scrub
      const maxScrollTop = rect.height - window.innerHeight;
      
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScrollTop));
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(1, Math.ceil(scrollFraction * FRAME_COUNT))
      );

      if (frameIndex !== frameIndexRef.current) {
        requestAnimationFrame(() => updateImage(frameIndex));
        frameIndexRef.current = frameIndex;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-[600vh] z-0">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
}
