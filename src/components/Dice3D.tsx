import React, { useEffect, useState } from 'react';
import './Dice3D.css';

interface Dice3DProps {
  value: number;
  rolling: boolean;
}

const DiceFace = ({ value }: { value: number }) => {
  const dots = Array.from({ length: value });
  return (
    <div className={`dice-face face-${value}`}>
      {dots.map((_, i) => (
        <span key={i} className="dot" />
      ))}
    </div>
  );
};

export const Dice3D: React.FC<Dice3DProps> = ({ value, rolling }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (rolling) {
      // Random tumbling while rolling
      const interval = setInterval(() => {
        setRotation({
          x: Math.floor(Math.random() * 360),
          y: Math.floor(Math.random() * 360)
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      // Snap to specific face rotation
      const rotations: Record<number, { x: number, y: number }> = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: -90 },
        3: { x: -90, y: 0 },
        4: { x: 90, y: 0 },
        5: { x: 0, y: 90 },
        6: { x: 180, y: 0 }
      };
      setRotation(rotations[value] || { x: 0, y: 0 });
    }
  }, [value, rolling]);

  return (
    <div className={`dice-container ${rolling ? 'dice-shaking' : ''}`}>
      <div 
        className="dice" 
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: rolling ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <DiceFace value={1} />
        <DiceFace value={6} />
        <DiceFace value={3} />
        <DiceFace value={4} />
        <DiceFace value={2} />
        <DiceFace value={5} />
      </div>
    </div>
  );
};
