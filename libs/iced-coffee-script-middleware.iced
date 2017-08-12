fs = require 'fs'
iced_comp = require 'iced-coffee-script'

module.exports = (options) ->
	dir = options.src
	(req, res, next) ->
		# pass if url isn't end with .js
		return next() unless req.url.match /\.js$/

		icedFile = dir + (req.url.replace /\.js$/, '.iced')
		jsFile = dir + req.url

		# load file stats of iced, js in same time
		await
			fs.stat icedFile, defer(icedErr, icedStat)
			fs.stat jsFile, defer(jsErr, jsStat)
		
		# pass if iced file doesn't exist
		return next() if icedErr

		icedModifiedTime = new Date(icedStat.mtime)

		# if js file doesn't exist then compile forced
		jsModifiedTime = if jsErr then icedModifiedTime else new Date(jsStat.mtime)

		# pass when js file is newer
		return next() if icedModifiedTime < jsModifiedTime

		await fs.readFile icedFile, 'utf8', defer(err, icedSrc)

		return (next err) if err

		try
			jsSrc = iced_comp.compile icedSrc, { runtime: 'inline' }
		catch compileErr
			return (next compileErr)

		# write the compiled string down to js file
		await fs.writeFile jsFile, jsSrc, 'utf8', defer(err)

		return (next err) if err

		# static middleware will read this js file
		return next()
