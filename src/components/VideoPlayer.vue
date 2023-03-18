<template>
	<div class="flex-grow-1 d-flex flex-column justify-center align-center pa-12">
		<video ref="video" controls class="w-100 h-100"></video>

		<div class="d-flex justify-center align-center pa-4">
			<v-btn class="btn mx-2" @click="markStartPoint">
				<v-icon start>mdi-map-marker-right-outline</v-icon>
				Mark start point
				<v-icon color="grey" end>mdi-alpha-q-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" @click="markEndPoint">
				<v-icon start>mdi-map-marker-left-outline</v-icon>
				Mark end point
				<v-icon color="grey" end>mdi-alpha-w-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2" disabled>
				<v-icon start>mdi-multimedia</v-icon>
				Add to compilation
				<v-icon color="grey" end>mdi-alpha-c-box-outline</v-icon>
			</v-btn>

			<v-btn class="btn mx-2">
				<v-icon start>mdi-file-video-outline</v-icon>
				Save clip
				<v-icon color="grey" end>mdi-alpha-s-box-outline</v-icon>
			</v-btn>
		</div>

		<v-checkbox v-model="clipSettings.deleteOrginal" label="Delete original clip" hide-details class="pa-2"></v-checkbox>

		<div class="d-flex justify-center align-center pa-2" v-if="clipDetails.duration > 0">
			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-map-marker-right-outline</v-icon>
				{{ clipSettings.startPoint }}s
			</v-chip>

			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-map-marker-left-outline</v-icon>
				{{ clipSettings.endPoint }}s
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
				150.25 MB
			</v-chip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['gameName', 'clipName'])
const video = ref<HTMLVideoElement>()

const clipSettings = ref({
	startPoint: 50,
	endPoint: 60,
	compilation: false,
	deleteOrginal: true
})

const clipDetails = ref({
	duration: 0,
	fps: 0,
	resolution: ''
})

const getClipDetails = async () => {
	fetch('http://localhost:6969/getClipDetails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ game: props.gameName, clip: props.clipName })
	})
		.then((response) => response.json())
		.then((data) => {
			clipDetails.value.duration = +(+data.duration).toFixed(2)
			clipDetails.value.fps = +data.fps
			clipDetails.value.resolution = data.resolution
			clipSettings.value.endPoint = +clipDetails.value.duration
		})
}

watch(
	() => [props.gameName, props.clipName],
	() => {
		if (props.gameName.length > 0 && props.clipName.length > 0 && video.value) {
			video.value.src = `E:/Videos/ShadowPlay/${props.gameName}/${props.clipName}`
			video.value.currentTime = 50
			video.value.play()
			getClipDetails()
		}
	}
)

const markStartPoint = () => {
	if (!video.value) return
	clipSettings.value.startPoint = +video.value.currentTime.toFixed(3)
}

const markEndPoint = () => {
	if (!video.value) return
	clipSettings.value.endPoint = +video.value.currentTime.toFixed(3)
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'q') {
		markStartPoint()
	} else if (e.key === 'w') {
		markEndPoint()
	} else if (e.key === 'c') {
		console.log('c')
	} else if (e.key === 's') {
		console.log('s')
	}
})
</script>

<style scoped></style>
