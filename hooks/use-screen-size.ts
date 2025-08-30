"use client"

import { useState, useEffect } from 'react';

type ScreenSize = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768, // < 768px
        isTablet: width >= 768 && width < 1024, // 768px - 1023px
        isDesktop: width >= 1024, // >= 1024px
      });
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}
