import React, { useRef } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import clsx from 'clsx';

interface ImageScrollerProps {
  src: string;
  step?: number;          // px per click, default 200
  className?: string;     // extra utility classes
}

export default function ImageScroller({
  src,
  step = 200,
  className,
}: ImageScrollerProps) {
  const viewport = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) =>
    viewport.current?.scrollBy({ top: dir * step, behavior: 'smooth' });

  return (
    <div
      className={clsx('image-scroller-root', className)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        maxWidth: 800,
        margin: '0 auto',
        background: '#222',
      }}
    >
      {/* scrollable area */}
      <div
        ref={viewport}
        style={{
          maxHeight: '70vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <img
          src={src}
          alt=""
          style={{ width: '100%', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
        />
      </div>

      {/* controls */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(2px)',
          zIndex: 2,
        }}
        aria-label="Scroll up"
      >
        <ArrowUp />
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(2px)',
          zIndex: 2,
        }}
        aria-label="Scroll down"
      >
        <ArrowDown />
      </button>
    </div>
  );
} 