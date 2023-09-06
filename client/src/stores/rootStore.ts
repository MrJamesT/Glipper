import { defineStore } from 'pinia'
import { Game } from '../models/Game'
import { Clip } from '../models/Clip'
import { ClipSwitch } from '../models/ClipSwitch'
import { useLocalStorage } from '@vueuse/core'

export const useRootStore = defineStore('root', {
	state: () => ({
		selectedGame: '',
		selectedClip: '',
		games: [] as Game[],
		clips: [] as Clip[],
		settings: useLocalStorage('settings', {
			gameFolder: '',
			clipSwitch: ClipSwitch.Next,
			clipboardToggle: false,
		}),
	}),
	actions: {
		async fetchGamesList() {
			fetch('http://localhost:6969/gamesList')
				.then((response) => response.json())
				.then((data: Game[]) => {
					this.games = data
				})
		},
		async fetchClipsList() {
			fetch('http://localhost:6969/clipsList', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ game: this.selectedGame }),
			})
				.then((response) => response.json())
				.then((data: Clip[]) => {
					this.clips = data
				})
		},
		async fetchSettings() {
			fetch('http://localhost:6969/settings')
				.then((response) => response.json())
				.then((data) => {
					this.settings.gameFolder = data.gameFolder
				})
		},
		selectNextClip() {
			if (this.settings.clipSwitch === ClipSwitch.Next) {
				const index = this.clips.findIndex((clip) => clip.name === this.selectedClip)
				if (index < this.clips.length - 1) {
					this.selectedClip = this.clips[index + 1].name
				}
			} else {
				const index = this.clips.findIndex((clip) => clip.name === this.selectedClip)
				if (index > 0) {
					this.selectedClip = this.clips[index - 1].name
				}
			}
		},
		deselectGame() {
			this.selectedGame = ''
			this.selectedClip = ''
		},
	},
})
