<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px">
		<v-btn class="w-100 my-2" @click="rootStore.deselectGame()">
			<v-icon start>mdi-arrow-left</v-icon>
			Back to Games List
		</v-btn>
		<v-data-table
			:headers="headers"
			:items="clips"
			class="elevation-1 no-select h-100"
			items-per-page="20"
			@click:row="handleClipClick"
			style="width: 650px"
		>
			<template v-slot:item.status="{ item }">
				<div class="h-100 w-100 d-flex justify-center align-center">
					<v-icon
						v-if="rootStore.selectedClip === item.raw.name"
						color="primary"
						size="x-small"
						class="text-center"
						>mdi-cursor-default-click-outline</v-icon
					>
					<v-icon v-else-if="item.raw.cut" color="success" size="x-small">mdi-content-cut</v-icon>
					<v-icon v-else color="warning" size="x-small">mdi-movie-open-off</v-icon>
				</div>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRootStore } from '../stores/rootStore'
const rootStore = useRootStore()

const headers = [
	{ title: 'Status', key: 'status', width: 20 },
	{ title: 'Clip name', key: 'name' },
	{ title: 'File size', key: 'size' },
]

// TODO: chagne to vuetify table sort-by prop when it's fixed
const clips = computed(() => {
	return rootStore.clips.sort((a: any, b: any) => {
		if (a.name < b.name) return -1
		if (a.name > b.name) return 1
		return 0
	})
})

const handleClipClick = (e: Event, game: any) => {
	rootStore.selectedClip = game.item.raw.name
}

rootStore.fetchClipsList()
</script>

<style scoped>
.no-select {
	user-select: none;
}

.selected {
	background-color: #e0e0e0;
}
</style>
