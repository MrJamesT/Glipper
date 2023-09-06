module.exports = {
	packagerConfig: {
		ignore: ['^/glipper-db.json$'],
		extraResource: ['../dist']
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'Glipper'
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin']
		}
	]
}
