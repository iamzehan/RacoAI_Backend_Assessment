import { useMediaQuery } from "./main";

export const useIsMobile = () =>
  useMediaQuery("(max-width: 767px)");

export const useIsTablet = () =>
  useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

export const useIsDesktop = () =>
  useMediaQuery("(min-width: 1024px)");

export const usePrefersDark = () =>
  useMediaQuery("(prefers-color-scheme: dark)");

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");