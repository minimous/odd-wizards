"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn, formatDecimal } from "@/lib/utils";

export type NumberTickerRef = {
  start: () => void;
  reset: () => void;
  skipToEnd: () => void;
};

const NumberTicker = forwardRef<
  NumberTickerRef,
  {
    value: number;
    direction?: "up" | "down";
    className?: string;
    delay?: number;
    decimalPlaces?: number;
    autoPlay?: boolean;
    skipAnimation?: boolean;
  }
>(({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  autoPlay = true,
  skipAnimation = false,
}, ref) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(autoPlay);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: skipAnimation ? 0 : undefined,
  });
  const isInView = useInView(elementRef, { once: true, margin: "0px" });

  useImperativeHandle(ref, () => ({
    start: () => setShouldAnimate(true),
    reset: () => {
      setShouldAnimate(false);
      motionValue.set(direction === "down" ? value : 0);
    },
    skipToEnd: () => motionValue.set(direction === "down" ? 0 : value),
  }));

  useEffect(() => {
    if (skipAnimation) {
      motionValue.set(direction === "down" ? 0 : value);
      return;
    }

    if (isInView && shouldAnimate) {
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [motionValue, isInView, delay, value, direction, shouldAnimate, skipAnimation]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (elementRef.current) {
          elementRef.current.textContent = formatDecimal(latest.toFixed(decimalPlaces), 2);
        }
      }),
    [springValue, decimalPlaces]
  );

  return (
    <span
      className={cn("inline-block tabular-nums tracking-wider", className)}
      ref={elementRef}
    />
  );
});

NumberTicker.displayName = "NumberTicker";

export default NumberTicker;