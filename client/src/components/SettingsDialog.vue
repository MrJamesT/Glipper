<template>
	<v-row justify="center">
		<v-dialog v-model="props.dialog" persistent width="800">
			<v-card>
				<v-card-title>
					<span class="text-h5">Settings</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model="rootStore.settings.gameFolder"
									label="Clips folder path"
									variant="outlined"
									hide-details
								></v-text-field>
							</v-col>

							<v-col cols="12">
								<v-switch
									v-model="rootStore.clipSwitch"
									:label="'Next clip after saving: ' + rootStore.clipSwitch"
									:true-value="ClipSwitch.Next"
									:false-value="ClipSwitch.Previous"
									color="secondary"
									inset
									hide-details
								></v-switch>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn variant="text" @click="$emit('close-dialog')"> Close </v-btn>
					<v-btn color="primary" @click="saveSettings"> Save </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-row>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { ClipSwitch } from '../models/ClipSwitch'
import { useRootStore } from '../stores/rootStore'
const rootStore = useRootStore()
const toast = useToast()

const props = defineProps(['dialog'])
const emit = defineEmits(['close-dialog'])

const saveSettings = async () => {
	fetch('http://localhost:6969/settings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ settings: rootStore.settings }),
	})
		.then(async (response) => {
			if (response.status === 200) {
				toast.success('Settings saved')
				emit('close-dialog')
			} else {
				toast.error('Settings not saved: ' + (await response.text()))
			}
		})
		.catch((error) => {
			toast.error('Settings not saved: ' + error)
		})
}
</script>

<style scoped></style>
