var canSetHTMLColors=false;
var canDump=true;
var recordingStartsFromLevel=0;
var inputHistory=[];
var soundHistory=[];
var compiledText;
var canOpenEditor=true;
var IDE=true;

var debugger_turnIndex=0;
var debug_visualisation_array=[];
var diffToVisualize=null;

Level.prototype.convertToString = function(def_char = '=')
{
	var out = ''
	var seenCells = {}
	var i = 0
	for (var y = 0; y < this.height; y++)
	{
		for (var x = 0; x < this.width; x++)
		{
			const bitmask = this.getCell(x + y*this.width) // TODO: it should be y + x*this.height
			var objs = [];
			for (var bit = 0; bit < 32 * STRIDE_OBJ; ++bit)
			{
				if (bitmask.get(bit))
				{
					objs.push(state.identifiers.objects[state.idDict[bit]].name)
				}
			}
			objs.sort()
			objs = objs.join(' ')
			/* replace repeated object combinations with numbers */
			if (!seenCells.hasOwnProperty(objs))
			{
				seenCells[objs] = i++
				out += objs + def_char
			}
			out += seenCells[objs] + ','
		}
		out += '\n'
	}
	return out
}

function levelFromUnitTestString(str)
{
	const lines = str.split('\n')
	const height = lines.length - 1
	const width = lines[0].split(',').length - 1
	var lev = new Level(width, height, new Int32Array(width * height * STRIDE_OBJ))
	execution_context.resetCommands()
	var masks = []
	for (const [y, line] of lines.entries())
	{
		for (const [x, cell_content] of line.split(',').entries())
		{
			if (cell_content.length == 0)
				continue
			var cell_parts = cell_content.split(/[:=]/) // : is used by vanilla PuzzleScript but appears in names of objects with tags so it is replaced with = in Mino:Script.
			if (cell_parts.length > 1)
			{
				const object_names = cell_parts[0].split(' ')
				const objects = object_names.map( object_name => state.identifiers.objects.find( o => (object_name === o.name) ) )
				const mask = makeMaskFromGlyph( objects.map( o => o.id ) )
				masks.push(mask)
			}
			const mask_id = parseInt(cell_parts[cell_parts.length - 1])
			const maskint = masks[mask_id]
			lev.setCell(x + y*width, maskint)
		}
	}
	return lev
}

function loadUnitTestStringLevel(str)
{
	loadLevelFromLevelDat(state, levelFromUnitTestString(str), null)
}


function stripHTMLTags(html_str)
{
	if (typeof html_str !== 'string')
		return html_str
	var div = document.createElement("div");
	div.innerHTML = html_str;
	var text = div.textContent || div.innerText || "";
	return text.trim();
}

function dumpTestCase() {
	//compiler error data
	var levelDat = compiledText;
	var errorStrings_stripped = errorStrings.map(stripHTMLTags);
	var resultarray = [levelDat,errorStrings_stripped,errorCount];
	var resultstring = JSON.stringify(resultarray);
	resultstring = `<br>
	[<br>
		"${state.metadata.title||"untitled test"}",<br>
		${resultstring}<br>
	],`;
	selectableint++;
	var tag = 'selectable'+selectableint;
	consolePrint("<br>Compilation error/warning data (for error message tests - errormessage_testdata.js):<br><br><br><span id=\""+tag+"\" onclick=\"selectText('"+tag+"',event)\">"+resultstring+"</span><br><br><br>",true);

	
	//if the game is currently running and not on the title screen, dump the recording data
	if (!titleScreen) {
		//normal session recording data
		var levelDat = compiledText;
		var input = inputHistory.concat([]);
		var sounds = soundHistory.concat([]);
		var outputDat = convertLevelToString();

		var resultarray = [levelDat,input,outputDat,recordingStartsFromLevel,loadedLevelSeed,sounds];
		var resultstring = JSON.stringify(resultarray);
		resultstring = `<br>
		[<br>
			"${state.metadata.title||"untitled test"}",<br>
			${resultstring}<br>
		],`;
		
		selectableint++;
		var tag = 'selectable'+selectableint;
		
		consolePrint("<br>Recorded play session data (for play session tests - testdata.js):<br><br><br><span id=\""+tag+"\" onclick=\"selectText('"+tag+"',event)\">"+resultstring+"</span><br><br><br>",true);
	}

}

function clearInputHistory()
{
	if (canDump === true)
	{
		inputHistory=[]
		recordingStartsFromLevel = curlevel
	}
}

function pushInput(inp) {
	if (canDump===true) {
		inputHistory.push(inp);
	}
}


function print_ruleset(rule_set)
{
	var output = ''
	for (const rulegroup of rule_set)
	{
		output += '&nbsp; ' + rulegroup.map(rule => rule.string_representation).join('<br>+ ') + '<br>'
	}
	return output
}
function pushSoundToHistory(seed) {
	if (canDump===true) {
		soundHistory.push(seed);
	}
}
