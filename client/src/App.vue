<template>
	<div class="d-flex justify-space-between align-center h-full">
		<FolderTable v-if="rootStore.selectedGame.length === 0" />
		<GameTable v-else />
		<VideoPlayer style="max-width: 80vw" />
	</div>
	<div class="settingsBtn">
		<v-btn class="btn my-4" color="secondary" variant="text" @click="rebuildGameDB">
			<v-icon start>mdi-refresh</v-icon>
			Rebuild Game DB
		</v-btn>
		<v-btn class="btn ma-4" color="primary" variant="text" @click="dialog = true">
			<v-icon start>mdi-cog-outline</v-icon>
			Settings
		</v-btn>
	</div>

	<SettingsDialog :dialog="dialog" @close-dialog="dialog = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FolderTable from './components/FolderTable.vue'
import GameTable from './components/GameTable.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import SettingsDialog from './components/SettingsDialog.vue'

import { useRootStore } from './stores/rootStore'
import { useClipQueueStore } from './stores/clipQueueStore'
import { useToast } from 'vue-toastification'
import { socket } from './socket'
const rootStore = useRootStore()
const toast = useToast()

const dialog = ref(false)

const rebuildGameDB = () => {
	rootStore.selectedClip = ''
	rootStore.selectedGame = ''

	fetch('http://localhost:6969/buildGameDB', {
		method: 'PUT',
	}).then(async (res) => {
		if (res.status === 200) {
			await rootStore.fetchGamesList()
			toast.success('Game DB rebuilt')
		}
	})
}

socket.on('progress', (data: { clip: string; progress: number }) => {
	try {
		console.log(data.progress, data.clip)
	} catch (error) {
		console.log(error)
	}
})

rootStore.fetchGamesList()
rootStore.fetchSettings()
</script>

<style>
.h-full {
	height: 100vh;
}

.w-full {
	width: 100vw;
}

.h-100 {
	height: 100%;
}

.w-100 {
	width: 100%;
}

.settingsBtn {
	position: absolute;
	top: 0;
	right: 0;
}
</style>
