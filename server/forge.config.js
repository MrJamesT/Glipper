module.exports = {
	packagerConfig: {
		ignore: ['^/clip-cutter-db.json$'],
		extraResource: ['../dist']
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'GCCU'
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin']
		}
	]
}
