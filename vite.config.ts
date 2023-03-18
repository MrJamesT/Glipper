import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.IS_DEV !== 'true' ? './' : '/',
	build: {
		outDir: 'app/build'
	},
	plugins: [vue(), vuetify()],
	server: {
		port: 9696
	}
})
