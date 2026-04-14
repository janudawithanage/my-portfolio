import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion animation variants for consistent motion design.
 */

type CustomEase = [number, number, number, number];
const springEase: CustomEase = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: springEase },
  },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Stagger container — children animate in sequence.
 */
export const staggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0
): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

/**
 * Child item for stagger containers.
 */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: springEase },
  },
};
