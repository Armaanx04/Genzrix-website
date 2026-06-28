import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';

function cleanUrlRoutes(): Plugin {
  return {
    name: 'clean-url-routes',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query = ''] = (req.url ?? '').split('?');
        if (pathname === '/about' || pathname === '/about/') {
          req.url = `/about.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [cleanUrlRoutes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        careers: resolve(__dirname, 'careers.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
