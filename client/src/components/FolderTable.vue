<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px">
		<v-data-table
			:headers="headers"
			:items="rootStore.games"
			class="elevation-1 no-select h-100"
			items-per-page="22"
			@click:row="handleGameClick"
			style="width: 650px"
		></v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { useRootStore } from '../stores/rootStore'
const rootStore = useRootStore()

const headers = [
	{ title: 'Game name', key: 'name' },
	{ title: 'Number of Clips', key: 'nOfClips' },
	{ title: 'File size', key: 'size' },
]

const handleGameClick = (e: Event, game: any) => {
	rootStore.selectedGame = game.item.raw.name
}
</script>

<style scoped>
.no-select {
	user-select: none;
}
</style>
