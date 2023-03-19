<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px">
		<v-btn class="w-100 my-2" @click="rootStore.deselectGame()">
			<v-icon start>mdi-arrow-left</v-icon>
			Back to Games List
		</v-btn>
		<v-data-table
			v-model="selected"
			:headers="headers"
			:items="rootStore.clips"
			class="elevation-1 no-select h-100"
			items-per-page="22"
			@click:row="handleClipClick"
			style="width: 650px"
			item-value="name"
			show-select
		>
			<template v-slot:item.data-table-select="{ item }">
				<v-checkbox :value="handleCheckboxValue(item)" :disabled="true" hide-details></v-checkbox>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

import { useRootStore } from '../stores/rootStore'
const rootStore = useRootStore()

const headers = [
	{ title: 'Clip name', key: 'name' },
	{ title: 'File size', key: 'size' },
]
const selected = ref<string[]>([])

const handleClipClick = (e: Event, game: any) => {
	rootStore.selectedClip = game.item.raw.name
}

const handleCheckboxValue = (item: any) => {
	const isSelected = selected.value[0] === item.value
	return isSelected
}

watch(
	() => rootStore.selectedClip,
	(newVal) => {
		if (selected.value.length > 0) selected.value.pop()
		selected.value.push(newVal)
	},
)

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
