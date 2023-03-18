<template>
	<div class="d-flex flex-column justify-center align-center">
		<video ref="video" controls class="w-100"></video>

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

		<div class="d-flex flex-grow-1 justify-center align-center pa-2">
			<v-checkbox v-model="clipSettings.deleteOrginal" label="Delete original clip" hide-details></v-checkbox>
			<p class="text-subtitle-1 text-grey ml-12 mt-1">Estimated file size: xxx.xx MB</p>
		</div>

		<div class="d-flex justify-center align-center pa-2" v-if="clipDetails.duration > 0">
			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-timer-outline</v-icon>
				{{ clipDetails.duration }}s
			</v-chip>

			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-record-rec</v-icon>
				{{ clipDetails.fps }} FPS
			</v-chip>

			<v-chip class="ma-2" color="primary">
				<v-icon start>mdi-video-image</v-icon>
				{{ clipDetails.resolution }}
			</v-chip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['gameName', 'clipName'])
const video = ref<HTMLVideoElement>()

const clipSettings = ref({
	startPoint: 0,
	endPoint: 0,
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
	clipSettings.value.startPoint = video.value.currentTime
	console.log(clipSettings.value.startPoint)
}

const markEndPoint = () => {
	if (!video.value) return
	clipSettings.value.endPoint = video.value.currentTime
	console.log(clipSettings.value.endPoint)
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
