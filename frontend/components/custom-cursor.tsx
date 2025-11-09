"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Create main cursor element
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.innerHTML = "🍃";
    document.body.appendChild(cursor);

    // Trail configuration
    const trailLength = 8;
    const trail: Array<{ x: number; y: number; element: HTMLDivElement; life: number }> = [];
    let mouseX = 0;
    let mouseY = 0;
    let lastTime = Date.now();

    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
      const leafTrail = document.createElement("div");
      leafTrail.className = "cursor-trail";
      leafTrail.innerHTML = "🍃";
      leafTrail.style.opacity = String(1 - i / trailLength);
      leafTrail.style.transform = `scale(${1 - (i / trailLength) * 0.5})`;
      document.body.appendChild(leafTrail);

      trail.push({
        x: 0,
        y: 0,
        element: leafTrail,
        life: 1,
      });
    }

    // Track mouse position
    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    // Animate trail
    const animateTrail = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update first trail position to cursor
      trail[0].x = mouseX;
      trail[0].y = mouseY;

      // Update trail positions with smooth following
      for (let i = 1; i < trail.length; i++) {
        const target = trail[i - 1];
        const current = trail[i];

        // Smooth interpolation
        const speed = 0.15;
        current.x += (target.x - current.x) * speed;
        current.y += (target.y - current.y) * speed;

        // Update element position with slight rotation based on movement
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        current.element.style.left = `${current.x}px`;
        current.element.style.top = `${current.y}px`;
        current.element.style.transform = `translate(-50%, -50%) rotate(${angle - 45}deg) scale(${
          1 - (i / trailLength) * 0.6
        })`;
      }

      requestAnimationFrame(animateTrail);
    };

    document.addEventListener("mousemove", moveCursor);
    animateTrail();

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      cursor.remove();
      trail.forEach((t) => t.element.remove());
    };
  }, []);

  return null;
}
