import { defineStore } from 'pinia'

export const useClipQueueStore = defineStore('clipQueue', {
	state: () => ({
		processedClip: '',
		progress: 0,
		clipQueue: [] as string[],
	}),
	actions: {},
})
