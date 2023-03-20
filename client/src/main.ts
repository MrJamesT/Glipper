import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDataTable } from 'vuetify/labs/VDataTable'

import { createPinia } from 'pinia'
const pinia = createPinia()

// Toasts
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options: PluginOptions = {
	transition: 'Vue-Toastification__bounce',
	maxToasts: 20,
	newestOnTop: true
}

const vuetify = createVuetify({
	theme: {
		defaultTheme: 'dark'
	},
	components: {
		...components,
		VDataTable
	},
	directives
})

createApp(App).use(vuetify).use(pinia).use(Toast, options).mount('#app')
