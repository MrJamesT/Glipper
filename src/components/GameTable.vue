<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px;">
		<v-btn class="w-100 my-2" @click="$emit('game-deselected')">
			<v-icon start>mdi-arrow-left</v-icon>
			Back to Games List
		</v-btn>
		<v-data-table :headers="headers" :items="clips" class="elevation-1 no-select h-100" items-per-page="22" @click:row="handleClipClick" style="width: 650px;"> </v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Game } from '../models/Game'

const props = defineProps(['gameName'])
const emit = defineEmits(['clip-selected', 'game-deselected'])

const headers = [
	{ title: 'Clip name', key: 'name' },
	{ title: 'File size', key: 'size' }
]
const clips = ref<Game[]>([])

const handleClipClick = (e: Event, game: any) => {
	emit('clip-selected', game.item.raw.name)
}

fetch('http://localhost:6969/clipsList', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({ game: props.gameName })
})
	.then((response) => response.json())
	.then((data) => {
		clips.value = data
	})
</script>

<style scoped>
.no-select {
	user-select: none;
}
</style>
