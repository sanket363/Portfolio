import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
    ],
    optimizeDeps: {
      include: [
        'lottie-web',
        'gsap',
        'animejs',
        '@studio-freight/lenis',
        'three'
      ],
      exclude: ['lucide-react'],
    },
    define: {
      __ANIMATION_PERFORMANCE_MODE__: JSON.stringify(isProduction),
      __ANIMATION_DEBUG_MODE__: JSON.stringify(!isProduction),
    },
    build: {
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        external: [
          /^gsap\/.+/,
          /^three\/.+/
        ],
      },
    },
    // allow importing 3D model and binary assets for Three.js/WebGL
    assetsInclude: [
      '**/*.glb',
      '**/*.gltf',
      '**/*.bin'
    ],
  };
});