"use client";

import { useEffect } from "react";

type MotionWindow = Window & { __motionReady?: boolean };

/**
 * Inline script for <head>: marks the document as scripted before first paint so
 * reveal targets start hidden, and un-hides everything if the app has not
 * started after four seconds (for example when a script fails to load).
 */
export const motionBootstrap = 'document.documentElement.classList.add("js");setTimeout(function(){if(!window.__motionReady)document.documentElement.classList.remove("js")},4000);';

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/**
 * The page's whole motion layer, mounted once in the root layout:
 * - one IntersectionObserver reveals [data-reveal] elements and the children of
 *   [data-stagger] once, as they enter the viewport;
 * - [data-tilt] cards lean toward the pointer and carry a light highlight;
 * - [data-magnetic] buttons follow the pointer a few pixels;
 * - the scroll progress bar falls back to a passive listener where CSS
 *   scroll-driven animations are unsupported.
 * Pointer effects run only for a mouse on a fine pointer, never with reduced motion.
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement;
    (window as MotionWindow).__motionReady = true;

    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "");
        reveal.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    document.querySelectorAll("[data-reveal]:not([data-shown]), [data-stagger]:not([data-shown])").forEach(node => reveal.observe(node));

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let latest: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;
    const settle = (node: HTMLElement | null, properties: string[]) => properties.forEach(property => node?.style.removeProperty(property));
    const apply = () => {
      frame = 0;
      const event = latest;
      if (!event) return;
      const target = event.target instanceof Element ? event.target : null;
      const tilt = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      const magnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (tilted !== tilt) settle(tilted, ["--rx", "--ry"]);
      if (pulled !== magnet) settle(pulled, ["--tx", "--ty"]);
      tilted = tilt;
      pulled = magnet;
      if (tilt) {
        const box = tilt.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        tilt.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        tilt.style.setProperty("--my", (y * 100).toFixed(1) + "%");
        tilt.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
        tilt.style.setProperty("--ry", ((x - 0.5) * 8).toFixed(2) + "deg");
      }
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        magnet.style.setProperty("--tx", clamp((event.clientX - box.left - box.width / 2) * 0.25, 10).toFixed(1) + "px");
        magnet.style.setProperty("--ty", clamp((event.clientY - box.top - box.height / 2) * 0.35, 8).toFixed(1) + "px");
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) return;
      latest = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onPointerLeave = () => {
      latest = null;
      settle(tilted, ["--rx", "--ry"]);
      settle(pulled, ["--tx", "--ty"]);
      tilted = pulled = null;
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const scrollTimelines = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    let progressFrame = 0;
    const updateProgress = () => {
      progressFrame = 0;
      const range = root.scrollHeight - window.innerHeight;
      bar?.style.setProperty("--progress", range > 0 ? Math.min(1, window.scrollY / range).toFixed(4) : "0");
    };
    const onScroll = () => { if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress); };
    if (bar && !scrollTimelines) {
      updateProgress();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    return () => {
      reveal.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(progressFrame);
    };
  }, []);
  return null;
}
