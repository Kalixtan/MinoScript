
function downloadBlob(blob, filename)
{
	var a = document.createElement('a')
	a.download = filename
	a.href = window.URL.createObjectURL(blob)
	a.dispatchEvent( new MouseEvent('click', { view: window, bubbles: true, cancelable: true }) )
}

function getLocalFile(relative_url, error_message, success_callback)
{
	var request = new XMLHttpRequest();
	request.open('GET', relative_url);
	request.onreadystatechange = function()
	{
		if(request.readyState != 4)
			return;
		if (request.responseText === "")
			consolePrint(error_message, true)
		success_callback(request.responseText)
	}
	request.send();
}

var standalone_JS_Strings = []
const standalone_JS_Files = [
	'globalVariables', 'debug_off', 'font', 'rng', 'riffwave', 'editor/random_sound_generators', 'sfxr2', 'codemirror/stringstream', 'colors', 'engine/screen_layout', 'graphics',
	'engine/log', 'engine/message_screen', 'engine/level', 'engine/bitvec', 'engine/commands_set', 'engine/rule', 'engine/cell_pattern', 'engine/engine_base', 'compiler/identifiers',
	'compiler/rule', 'compiler/rule_parser', 'compiler/rule_expansion', 'compiler/rule_groups', 'parser', 'compiler', 'inputoutput', 'mobile'
]

function record_js_file(i, text, next_step)
{
	standalone_JS_Strings[i] = text
	if ((standalone_JS_Strings.length == standalone_JS_Files.length) && (!standalone_JS_Strings.includes(undefined)))
	{
		next_step( standalone_JS_Strings.join("\n\n") )
	}
}


function buildStandalone(sourceCode)
{
	getLocalFile('standalone.html', "Couldn't find standalone template. Is there a connection problem to the internet?", (t) => buildStandaloneJS(sourceCode, t))
}


function buildStandaloneJS(sourceCode, htmlString)
{
	standalone_JS_Strings = [] // don't care about caching the files as the browser should do it, so just re-download them.
	const next_step = function(js_string) { buildStandalonePack(sourceCode, htmlString, js_string) }
	standalone_JS_Files.forEach( (filename, i) => getLocalFile('js/'+filename+'.js', 'Cannot download js/'+filename+'.js!', (t) => record_js_file(i, t, next_step) ) )
}

function buildStandalonePack(sourceCode, htmlString, standalone_JS_String)
{
	if ('background_color' in state.metadata)
	{
		htmlString = htmlString.replace(/black;\/\*Don\'t/g, state.bgcolor+';\/\*Don\'t');
	}
	if ('text_color' in state.metadata)
	{
		htmlString = htmlString.replace(/lightblue;\/\*Don\'t/g, state.fgcolor+';\/\*Don\'t');
	}

	htmlString = htmlString.replace(/__GAMETITLE__/g, (state.metadata.title !== undefined) ? state.metadata.title : "Mino:Script Game");
	htmlString = htmlString.replace(/__HOMEPAGE__/g, (state.metadata.homepage !== undefined) ? state.metadata.homepage : "www.puzzlescript.net");

	// $ has special meaning to JavaScript's String.replace ($0, $1, etc.) Escape $ as $$.
	sourceCode = sourceCode.replace(/\$/g, '$$$$');
	htmlString = htmlString.replace(/__GAMEDAT__/g, sourceCode);

	standalone_JS_String = standalone_JS_String.replace(/\/\/ <-- FONT START -->(?:.|\s)*?\/\/ <-- FONT END -->/m, 'font.src = "'+font.asDataURL() + '"')

	htmlString = htmlString.split('__JAVASCRIPT_GOES_HERE__', 2).join(standalone_JS_String) // using replace would cause a bug, as standalone_JS_String contains $ characters

	downloadBlob(new Blob([htmlString], {type: "text/plain;charset=utf-8"}), 'index.html')
}
