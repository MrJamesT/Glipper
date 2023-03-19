import { defineStore } from 'pinia'
import { Game } from '../models/Game'
import { Clip } from '../models/Clip'

export const useRootStore = defineStore('root', {
	state: () => ({
		selectedGame: '',
		selectedClip: '',
		games: [] as Game[],
		clips: [] as Clip[],
	}),
	actions: {
		fetchGamesList() {
			fetch('http://localhost:6969/gamesList')
				.then((response) => response.json())
				.then((data: Game[]) => {
					this.games = data
				})
		},
		fetchClipsList() {
			fetch('http://localhost:6969/clipsList', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ game: this.selectedGame }),
			})
				.then((response) => response.json())
				.then((data) => {
					this.clips = data
				})
		},
		selectNextClip() {
			const index = this.clips.findIndex((clip) => clip.name === this.selectedClip)
			if (index < this.clips.length - 1) {
				this.selectedClip = this.clips[index + 1].name
			}
		},
		deselectGame() {
			this.selectedGame = ''
			this.selectedClip = ''
		}
	},
})
