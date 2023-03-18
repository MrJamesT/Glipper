<template>
	<div class="d-flex justify-space-evenly align-center h-full pa-8" style="gap: 16px">
		<FolderTable v-if="selectedGame.length === 0" @game-selected="handleGameSelected" />
		<GameTable v-else :gameName="selectedGame" @clip-selected="handleClipSelected" />
		<VideoPlayer :gameName="selectedGame" :clipName="selectedClip" class="flex-grow-1" style="max-width: 1000px" />
	</div>
</template>

<script setup lang="ts">
import FolderTable from './components/FolderTable.vue'
import GameTable from './components/GameTable.vue'
import VideoPlayer from './components/VideoPlayer.vue'
import { ref } from 'vue'

const selectedGame = ref<string>('')
const selectedClip = ref<string>('')

const handleGameSelected = (gameName: string) => {
	selectedGame.value = gameName
}

const handleClipSelected = (clipName: string) => {
	selectedClip.value = clipName
}
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
</style>
