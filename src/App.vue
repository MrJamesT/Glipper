<template>
	<div class="d-flex justify-space-evenly align-center h-full pa-8" style="gap: 16px;">
		<FolderTable />
		<VideoPlayer class="flex-grow-1" style="max-width: 1000px;" />
	</div>
</template>

<script setup lang="ts">
import FolderTable from './components/FolderTable.vue'
import VideoPlayer from './components/VideoPlayer.vue';
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
