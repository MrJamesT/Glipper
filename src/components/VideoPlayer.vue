<template>
	<video ref="video" controls></video>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps(['gameName', 'clipName'])
const video = ref<HTMLVideoElement>()

watch(
	() => [props.gameName, props.clipName],
	() => {
		if (props.gameName.length > 0 && props.clipName.length > 0 && video.value) {
			video.value.src = `E:/Videos/ShadowPlay/${props.gameName}/${props.clipName}`
			video.value.currentTime = 50
			video.value.play()
		}
	}
)
</script>

<style scoped></style>
