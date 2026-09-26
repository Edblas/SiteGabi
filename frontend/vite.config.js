import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        server: {
            host: true,
            port: 5173,
        },
        define: {
            __APP_VERSION__: JSON.stringify('1.0.0-fase1'),
        },
        envPrefix: 'VITE_',
    };
});
