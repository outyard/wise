(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window["canvasMultilineText"] = require("canvas-multiline-text");
},{"canvas-multiline-text":2}],2:[function(require,module,exports){
module.exports = function(ctx, text, opts) {

	// Default options
	if(!opts)
		opts = {}
	if (!opts.font)
		opts.font = 'sans-serif'
	if (typeof opts.stroke == 'undefined')
		opts.stroke = false
	if (typeof opts.verbose == 'undefined')
		opts.verbose = false
	if (!opts.rect)
		opts.rect = {
			x: 0,
			y: 0,
			width: ctx.canvas.width,
			height: ctx.canvas.height
		}
	if (!opts.lineHeight)
		opts.lineHeight = 1.1
	if (!opts.minFontSize)
		opts.minFontSize = 30
	if (!opts.maxFontSize)
		opts.maxFontSize = 100
	// Default log function is console.log - Note: if verbose il false, nothing will be logged anyway
	if (!opts.logFunction)
		opts.logFunction = function(message) { console.log(message) }


	const words = require('words-array')(text)
	if (opts.verbose) opts.logFunction('Text contains ' + words.length + ' words')
	var lines = []

	// Finds max font size  which can be used to print whole text in opts.rec
	for (var fontSize = opts.minFontSize; fontSize <= opts.maxFontSize; fontSize++) {

		// Line height
		var lineHeight = fontSize * opts.lineHeight

		// Set font for testing with measureText()
		ctx.font = ' ' + fontSize + 'px ' + opts.font

		// Start
		var x = opts.rect.x
		var y = opts.rect.y + fontSize // It's the bottom line of the letters
		lines = []
		var line = ''

		// Cycles on words
		for (var word of words) {
			// Add next word to line
			if (word !== '<br>') {
				var linePlus = line + word + ' '
			}
			// If added word exceeds rect width...
			if (word === '<br>' || ctx.measureText(linePlus).width > (opts.rect.width)) {
				// ..."prints" (save) the line without last word
				lines.push({ text: line, x: x, y: y })
				// New line with ctx last word
				if (word !== '<br>') {
					line = word + ' '
				} else {
					line = ''
				}
				y += lineHeight
			} else {
				// ...continues appending words
				line = linePlus
			}
		}

		// "Print" (save) last line
		lines.push({ text: line, x: x, y: y })

		// If bottom of rect is reached then breaks "fontSize" cycle
		if (y > opts.rect.height)
			break

	}

	if (opts.verbose) opts.logFunction('Font used: ' + ctx.font)

	// Print lines
	for (var line of lines)
		// Fill or stroke
		if (opts.stroke)
			ctx.strokeText(line.text.trim(), line.x, line.y)
		else
			ctx.fillText(line.text.trim(), line.x, line.y)

	// Returns font size
	return fontSize

}

},{"words-array":3}],3:[function(require,module,exports){
//
// ## Returns array of words in text
// ## For CJK languages almost every char is a word,
// ## for other languages words are separated by spaces
//
module.exports = function(text) {

	// Test for CJK characters
	if (/[\u3400-\u9FBF]/.test(text)) {

		// Contains CJK characters
		var words = []
		const characters = text.split("");
		for (var i = 0; i <= characters.length - 1; i++)
			if (!containsPunctations(characters[i + 1])) {
				// Next character is "normal"
				words.push(characters[i])
			} else {
				// Next character isn't a single word
				words.push(characters[i] + characters[i + 1])
				i++;
			}

		return words

	} else {

		// Other language
		// Converts returns in spaces, removes double spaces
		text = text.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ")
		// Simply split by spaces
		return text.split(" ")

	}

}

//
// ## Returns true if text contains puntaction characters
//
containsPunctations = function(text) {
	// Test string against regexp for many punctactions characters, including CJK ones
	return /[\uFF01-\uFF07,\u0021,\u003F,\u002E,\u002C,\u003A,\u003B,\uFF1A-\uFF1F,\u3002,\uFF0C-\uFF0E,\u2000-\u206F,\uFFED-\uFFEF,\u0028,\u0029]/.test(text)
}

},{}]},{},[1]);
