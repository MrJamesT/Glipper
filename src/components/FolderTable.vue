<template>
	<div class="d-flex flex-column align-center h-full" style="width: 650px;">
		<v-data-table :headers="headers" :items="games" class="elevation-1 no-select h-100" items-per-page="22" @click:row="handleGameClick" style="width: 650px;"></v-data-table>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Game } from '../models/Game'

const emit = defineEmits(['game-selected'])

const headers = [{ title: 'Game name', key: 'name' }]
const games = ref<Game[]>([])

const handleGameClick = (e: Event, game: any) => {
	emit('game-selected', game.item.raw.name)
}

fetch('http://localhost:6969/gamesList')
	.then((response) => response.json())
	.then((data) => {
		games.value = data
	})
</script>

<style scoped>
.no-select {
	user-select: none;
}
</style>
