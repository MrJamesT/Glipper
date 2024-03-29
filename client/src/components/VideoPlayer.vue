<template>
	<div class="flex-grow-1 d-flex flex-column justify-center align-center pa-12">
		<video ref="video" controls class="w-100 h-100"></video>

		<div class="d-flex justify-center align-center pa-4">
			<v-btn class="btn mx-2" @click="markStartTime">
				<v-icon start>mdi-map-marker-right-outline</v-icon>
				Mark start point
				<v-icon color="grey" end>mdi-alpha-q-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" @click="markEndTime">
				<v-icon start>mdi-map-marker-left-outline</v-icon>
				Mark end point
				<v-icon color="grey" end>mdi-alpha-w-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" disabled>
				<v-icon start>mdi-multimedia</v-icon>
				Add to compilation
				<v-icon color="grey" end>mdi-alpha-c-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" @click="deleteClip">
				<v-icon start>mdi-delete-empty</v-icon>
				Delete clip
				<v-icon color="grey" end>mdi-alpha-d-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" @click="saveClip">
				<v-icon start>mdi-file-video-outline</v-icon>
				Save clip
				<v-icon color="grey" end>mdi-alpha-s-box-outline</v-icon>
			</v-btn>
		</div>

		<div class="d-flex justify-center align-center">
			<v-text-field
				v-model="clipSettings.customName"
				label="Custom clip name"
				hide-details
				class="pa-2"
				style="min-width: 600px"
				variant="solo"
				@update:focused="handleInputFocus"
			>
				<template v-slot:append-inner> MP4 </template>
			</v-text-field>
			<v-checkbox
				v-model="clipSettings.removeOriginal"
				label="Delete original clip"
				hide-details
				class="pa-2"
			></v-checkbox>
		</div>

		<div class="d-flex justify-center align-center pa-2" v-if="clipDetails.duration > 0">
			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-map-marker-right-outline</v-icon>
				{{ clipSettings.startTime }}s
			</v-chip>

			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-map-marker-left-outline</v-icon>
				{{ clipSettings.endTime }}s
			</v-chip>

			<v-chip class="ma-2" color="secondary">
				<v-icon start>mdi-timer-outline</v-icon>
				{{ clipDetails.duration }}s
			</v-chip>

			<v-chip class="ma-2" color="secondary">
				<v-icon start>mdi-record-rec</v-icon>
				{{ clipDetails.fps }} FPS
			</v-chip>

			<v-chip class="ma-2" color="secondary">
				<v-icon start>mdi-video-image</v-icon>
				{{ clipDetails.resolution }}
			</v-chip>

			<v-chip class="ma-2" color="secondary">
				<v-icon start>mdi-image-size-select-large</v-icon>
				{{ approximateFileSize }}
			</v-chip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useRootStore } from '../stores/rootStore'
const rootStore = useRootStore()
const toast = useToast()

const video = ref<HTMLVideoElement>()

const clipSettings = ref({
	startTime: 50,
	endTime: 60,
	compilation: false,
	removeOriginal: true,
	customName: '',
})

const clipDetails = ref({
	duration: 0,
	fps: 0,
	resolution: '',
	size: '',
})

const approximateFileSize = computed(() => {
	const originalSize = +clipDetails.value.size.replace(' MB', '')
	const duration = clipSettings.value.endTime - clipSettings.value.startTime
	return '~' + ((originalSize / clipDetails.value.duration) * duration).toFixed(2) + ' MB'
})

const getClipDetails = async () => {
	const response = await fetch('http://localhost:6969/getClipDetails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ game: rootStore.selectedGame, clip: rootStore.selectedClip }),
	})
	const data = await response.json()

	clipDetails.value.duration = +(+data.duration).toFixed(2)
	clipDetails.value.fps = +data.fps
	clipDetails.value.resolution = data.resolution
	clipSettings.value.startTime = +clipDetails.value.duration - 10 < 0 ? 0 : +clipDetails.value.duration - 10
	clipSettings.value.endTime = +clipDetails.value.duration
	clipDetails.value.size = data.size
	clipSettings.value.customName = rootStore.selectedClip.replace('.mp4', '')
}

const saveClip = async () => {
	if (video.value) video.value.src = ''

	fetch('http://localhost:6969/cutClip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			game: rootStore.selectedGame,
			clip: rootStore.selectedClip,
			startTime: clipSettings.value.startTime,
			endTime: clipSettings.value.endTime,
			removeOriginal: clipSettings.value.removeOriginal,
			customName: clipSettings.value.customName + '.cut.mp4',
			pasteToClipboard: rootStore.settings.clipboardToggle,
		}),
	}).then(async (response) => {
		if (response.status === 200) {
			toast.success('Clip saved successfully!')
			rootStore.selectNextClip()
			const data = await response.json()
			rootStore.clips = data
		} else {
			toast.error('Error saving clip!')
		}
	})
}

const deleteClip = async () => {
	if (video.value) video.value.src = ''

	fetch('http://localhost:6969/deleteClip', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ game: rootStore.selectedGame, clip: rootStore.selectedClip }),
	}).then(async (response) => {
		if (response.status === 200) {
			toast.success('Clip deleted successfully!')
			rootStore.selectNextClip()
			const data = await response.json()
			rootStore.clips = data
		} else {
			toast.error('Error deleting clip!')
		}
	})
}

watch(
	() => [rootStore.selectedGame, rootStore.selectedClip],
	async () => {
		if (rootStore.selectedGame.length > 0 && rootStore.selectedClip.length > 0 && video.value) {
			await getClipDetails()
			video.value.src = `${rootStore.settings.gameFolder}/${rootStore.selectedGame}/${rootStore.selectedClip}`
			video.value.currentTime = clipSettings.value.startTime
			video.value.play()
		}
	},
)

const markStartTime = () => {
	if (!video.value) return
	clipSettings.value.startTime = +video.value.currentTime.toFixed(2)
}

const markEndTime = () => {
	if (!video.value) return
	clipSettings.value.endTime = +video.value.currentTime.toFixed(2)
}

// Handle all keyboard events along with removing them when user is typing in the input field
const handleKeyboard = (e: KeyboardEvent) => {
	if (e.key === 'q') {
		markStartTime()
	} else if (e.key === 'w') {
		markEndTime()
	} else if (e.key === 'c') {
		console.warn('not implemented')
	} else if (e.key === 's') {
		saveClip()
	}
}

const removeListeners = () => {
	document.removeEventListener('keydown', handleKeyboard)
}

const addListeners = () => {
	document.addEventListener('keydown', handleKeyboard)
}

const handleInputFocus = (focus: boolean) => {
	if (focus) removeListeners()
	else addListeners()
}

onMounted(() => {
	addListeners()
})
</script>

<style scoped></style>
