import * as express from 'express'
import * as ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import { JsonDB, Config } from 'node-json-db'

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
ffmpeg.setFfmpegPath(ffmpegPath)

const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static')

const cors = require('cors')
const expApp = express()
expApp.use(express.json())
expApp.use(cors({ origin: ['http://127.0.0.1:9696', 'http://localhost:9696'] }))

const db = new JsonDB(new Config('clip-cutter-db', true, false, '/'))

// Middleware to check if game folder exists
expApp.use(async (req, res, next) => {
	if (req.path === '/' || req.path === '/setGameFolder') return next()

	try {
		const folder = await db.getData('/settings/gameFolder')
		if (folder && folder.length > 0 && fs.existsSync(folder)) next()
		else res.status(500).send('Game folder does not exist!')
	} catch (error) {
		res.status(500).send('Game folder does not exist!')
	}
})

expApp.get('/', (req, res) => {
	res.send('Clip Cutter API')
})

expApp.put('/buildGameDB', async (req, res) => {
	const folder = await db.getData('/settings/gameFolder')

	const games = fs
		.readdirSync(folder, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
	await db.delete('/games')

	const gamesWithInfo = []
	let gameid = 0

	for (const game of games) {
		const clips = fs.readdirSync(folder + '/' + game)
		if (clips.length === 0) continue

		let dirSize = 0
		const clipsParsedWithId = clips
			.filter((clip) => clip.endsWith('.mp4'))
			.map((clip, index) => {
				const cut = clip.endsWith('.cut.mp4')

				const { size } = fs.statSync(folder + '/' + game + '/' + clip)
				const sizeMB = +(size / (1024 * 1024)).toFixed(2)
				dirSize += +sizeMB

				return { id: index, name: clip, size: sizeMB + ' MB', cut }
			})
		for (const clip of clipsParsedWithId) {
			await db.push('/games/' + game + '/' + clip.name, clip, true)
		}

		gamesWithInfo.push({ id: gameid, name: game, nOfClips: clipsParsedWithId.length, size: (dirSize / 1024).toFixed(2) + ' GB' })
		gameid++
	}

	await db.push('/gamesList', gamesWithInfo, true)

	res.sendStatus(200)
})

expApp.get('/gamesList', async (req, res) => {
	try {
		const games = await db.getData('/gamesList')
		res.json(games)
	} catch (error) {
		res.json([])
	}
})

expApp.post('/clipsList', async (req, res) => {
	try {
		const game = req.body.game
		const clips = await db.getData('/games/' + game)
		res.json(Object.values(clips))
	} catch (error) {
		res.json([])
	}
})

expApp.post('/getClipDetails', async (req, res) => {
	try {
		const folder = await db.getData('/settings/gameFolder')
		const game = req.body.game
		const clip = req.body.clip

		const { size } = await db.getData('/games/' + game + '/' + clip)

		const meta = await ffprobe(folder + '/' + game + '/' + clip, { path: ffprobeStatic.path })
		const duration = meta.streams[0].duration
		const fpsDiv = meta.streams[0].avg_frame_rate.split('/')
		const fps = fpsDiv[0] && fpsDiv[1] ? Math.round(fpsDiv[0] / fpsDiv[1]) : 0
		const resolution = meta.streams[0].width + 'x' + meta.streams[0].height

		res.json({ duration, fps, resolution, size })
	} catch (error) {
		res.status(500).send(error)
	}
})

expApp.post('/cutClip', async (req, res) => {
	try {
		const game = req.body.game
		const clip = req.body.clip
		const startTime = +req.body.startTime
		const endTime = +req.body.endTime
		const removeOriginal = req.body.removeOriginal
		const customName = req.body.customName

		const folder = await db.getData('/settings/gameFolder')

		// Create game folder of cut clips if it doesn't exist
		if (!fs.existsSync(folder + '/clips/' + game)) {
			fs.mkdirSync(folder + '/clips/' + game, { recursive: true })
		}

		const oldClipPath = folder + '/' + game + '/' + clip
		const newClipPath = folder + '/' + game + '/' + customName

		ffmpeg(oldClipPath)
			.setStartTime(startTime)
			.videoCodec('copy')
			.audioCodec('copy')
			.setDuration(endTime - startTime)
			.output(newClipPath)
			.on('end', async () => {
				if (removeOriginal) {
					fs.unlinkSync(oldClipPath)
					await db.delete('/games/' + game + '/' + clip)
				}

				const { size } = fs.statSync(newClipPath)
				const sizeMB = (size / (1024 * 1024)).toFixed(2) + ' MB'
				await db.push('/games/' + game + '/' + customName, { id: 0, name: customName, size: sizeMB, cut: true }, true)
				res.status(200).json(Object.values(await db.getData('/games/' + game)))
			})
			.on('error', (err: any) => {
				console.log(err)
				res.status(500).send(err)
			})
			.run()
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
})

expApp.post('/deleteClip', async (req, res) => {
	try {
		const game = req.body.game
		const clip = req.body.clip

		const folder = await db.getData('/settings/gameFolder')

		fs.unlinkSync(folder + '/' + game + '/' + clip)
		await db.delete('/games/' + game + '/' + clip)
		res.status(200).json(Object.values(await db.getData('/games/' + game)))
	} catch (error) {
		console.log(error)
		res.status(500).send(error)
	}
})

expApp.get('/settings', async (req, res) => {
	const settings = await db.getData('/settings')
	res.json(settings)
})

expApp.post('/settings', async (req, res) => {
	const folder = req.body.settings.gameFolder.toString()
	if (fs.existsSync(folder) === false) return res.status(500).send('Folder does not exist!')

	await db.push('/settings/gameFolder', folder, true)
	res.sendStatus(200)
})

expApp.get('*', (req, res) => {
	res.status(404).send('404 Not Found')
})

expApp.listen(6969, () => {
	console.log(`\u2713 Server running on port 6969!`)
})
