"use client";

import React, { useEffect, useRef, useState } from "react";

interface Leaf {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speedX: number;
  speedY: number;
  opacity: number;
  emoji: string;
  velocityX: number;
  velocityY: number;
}

export default function FloatingLeaves() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);

  const leafEmojis = ["🍃", "🌿", "🍂"];

  useEffect(() => {
    // Initialize leaves
    const initialLeaves: Leaf[] = [];
    const leafCount = 12;

    for (let i = 0; i < leafCount; i++) {
      initialLeaves.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 15 + 18,
        rotation: Math.random() * 360,
        speedX: (Math.random() - 1) * 0.25,
        speedY: Math.random() * 0.4 + 0.12,
        opacity: Math.random() * 0.2 + 0.15,
        emoji: leafEmojis[Math.floor(Math.random() * leafEmojis.length)],
        velocityX: 0,
        velocityY: 0,
      });
    }

    setLeaves(initialLeaves);

    // Mouse move handler with throttling
    let lastMouseUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseUpdate > 16) {
        // ~60fps throttle
        mousePos.current = { x: e.clientX, y: e.clientY };
        lastMouseUpdate = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      setLeaves((prevLeaves) =>
        prevLeaves.map((leaf) => {
          // Base movement
          let velocityX = leaf.velocityX * 0.95; // Damping
          let velocityY = leaf.velocityY * 0.95;

          // Calculate distance from mouse
          const dx = mousePos.current.x - leaf.x;
          const dy = mousePos.current.y - leaf.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Smooth repel from cursor with easing
          if (distance > 0 && distance < 200) {
            const force = Math.pow((200 - distance) / 200, 2) * 0.8;
            velocityX -= (dx / distance) * force;
            velocityY -= (dy / distance) * force;
          }

          // Apply base drift
          velocityX += leaf.speedX;
          velocityY += leaf.speedY;

          // Limit velocity to prevent leaves going too fast
          const maxVelocity = 5;
          const currentSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
          if (currentSpeed > maxVelocity) {
            velocityX = (velocityX / currentSpeed) * maxVelocity;
            velocityY = (velocityY / currentSpeed) * maxVelocity;
          }

          // Update position
          let newX = leaf.x + velocityX;
          let newY = leaf.y + velocityY;
          let newRotation = leaf.rotation + 0.5 + Math.abs(velocityX) * 0.5;

          // Wrap around screen smoothly
          if (newX < -50) {
            newX = window.innerWidth + 50;
            velocityX *= 0.5;
          }
          if (newX > window.innerWidth + 50) {
            newX = -50;
            velocityX *= 0.5;
          }
          if (newY > window.innerHeight + 50) {
            newY = -50;
            newX = Math.random() * window.innerWidth;
            velocityY *= 0.5;
          }
          if (newY < -50) {
            newY = window.innerHeight + 50;
            velocityY *= 0.5;
          }

          return {
            ...leaf,
            x: newX,
            y: newY,
            rotation: newRotation,
            velocityX,
            velocityY,
          };
        })
      );

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}px`,
            top: `${leaf.y}px`,
            fontSize: `${leaf.size}px`,
            transform: `translate(-50%, -50%) rotate(${leaf.rotation}deg)`,
            opacity: leaf.opacity,
            filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.2))",
            transition: "transform 0.1s linear",
            willChange: "transform",
          }}
        >
          {leaf.emoji}
        </div>
      ))}
    </div>
  );
}
