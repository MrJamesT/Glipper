<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px">
		<v-data-table
			:headers="headers"
			:items="rootStore.games"
			class="elevation-1 no-select h-100"
			items-per-page="22"
			@click:row="handleGameClick"
			style="width: 650px"
			:sort-by="[{ key: 'lastClipDate', order: 'desc' }]"
			must-sort
			:custom-key-sort="{ size: customFileSizeSort }"
		>
			<template v-slot:item.lastClipDate="{ item }">
				{{ format(new Date(item.raw.lastClipDate), 'dd. MM. yy HH:mm') }}
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { useRootStore } from '../stores/rootStore'
import { format } from 'date-fns'
const rootStore = useRootStore()

const headers = [
	{ title: 'Game name', key: 'name' },
	{ title: 'Number of Clips', key: 'nOfClips' },
	{ title: 'File size', key: 'size' },
	{ title: 'Last clip', key: 'lastClipDate' },
]

const handleGameClick = (e: Event, game: any) => {
	rootStore.selectedGame = game.item.raw.name
}

const customFileSizeSort = (a: string, b: string) => {
	const aSize = a.split(' ')[0]
	const bSize = b.split(' ')[0]
	return +aSize - +bSize
}
</script>

<style scoped>
.no-select {
	user-select: none;
}
</style>
