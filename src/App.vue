<template>
	<div class="d-flex justify-space-between align-center h-full">
		<FolderTable v-if="rootStore.selectedGame.length === 0" />
		<GameTable v-else />
		<VideoPlayer style="max-width: 80vw" />
	</div>
</template>

<script setup lang="ts">
import FolderTable from './components/FolderTable.vue'
import GameTable from './components/GameTable.vue'
import VideoPlayer from './components/VideoPlayer.vue'

import { useRootStore } from './stores/rootStore'
const rootStore = useRootStore()

rootStore.fetchGamesList()
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
