
for (var i=0;i<10;i++) {
	var idname = "newsound"+i;
	var el = document.getElementById(idname);
    el.addEventListener("click", (function(n){return function(){return newSound(n);};})(i), false);
}

document.getElementById("exampleDropdown").addEventListener("change", dropdownChange, false);
document.getElementById("loadDropDown").addEventListener("change", loadDropDownChange, false);

var horizontalDragbar = document.getElementById("horizontaldragbar");
horizontalDragbar.addEventListener("mousedown", horizontalDragbarMouseDown, false);

var verticalDragbar = document.getElementById("verticaldragbar");
verticalDragbar.addEventListener("mousedown", verticalDragbarMouseDown, false);

window.addEventListener("resize", resize_all, false);
window.addEventListener("load", reset_panels, false);

/* https://github.com/ndrake/PuzzleScript/commit/de4ac2a38865b74e66c1d711a25f0691079a290d */
window.onbeforeunload = function (e) {
  var e = e || window.event;
  var msg = 'You have unsaved changes!';

  if(_editorDirty) {      

    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = msg;
    }

    // For Safari
    return msg;
  }
};

var gestureHandler = Mobile.enable();
if (gestureHandler) {
    gestureHandler.setFocusElement(document.getElementById('gameCanvas'));
}

