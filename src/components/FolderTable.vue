<template>
	<v-data-table :headers="headers" :items="games" class="elevation-1" style="max-width: 800px" @click:row="handleGameClick"> </v-data-table>
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

<style scoped></style>
