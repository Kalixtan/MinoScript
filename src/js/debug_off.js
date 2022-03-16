var canSetHTMLColors=true;
var canDump=false;
var canOpenEditor=false;
var IDE=false;
const diffToVisualize=null;


function addErrorMessage(str)
{
	var errorText = document.getElementById("errormessage")

	var div = document.createElement("div");
	div.innerHTML = str;
	str = div.textContent || div.innerText || "";

	errorText.innerHTML += str + "<br>"
}

function consolePrint(str, urgent) { /* addErrorMessage(str) */ }

function consolePrintFromRule(str, rule, urgent) { /* addErrorMessage(str) */ }

function consoleCacheDump(str) { }

function consoleError(str, lineNumber) { addErrorMessage(str) }


function logErrorNoLine(str){
	var errorText = document.getElementById("errormessage");
	str=stripTags(str);
	errorText.innerHTML+=str+"<br>";
}

function clearInputHistory() { }
function pushInput(inp) { }