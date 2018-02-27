/**
 * Calysto Jupyter Notebooks Extensions
 *
 * Copyright (c) The Calysto Project
 * http://github.com/Calysto/notebook-extensions
 *
 * Released under the BSD Simplified License
 *
 **/

define(["require"], function (require) {

    function toggle_columns(evt, input_cell) {
	// Toggle code cells into two columns
	var cells = IPython.notebook.get_cells();
	var cell;
	
	if (input_cell == undefined) {
	    cell = IPython.notebook.get_selected_cell();
	} else {
	    cell = input_cell;
	}
	
	// only toggle columns/rows if code cell:
	if (cell.cell_type == "code") {
	    // get the div cell:
            var div = cell.element;
            if (cell.metadata.format == "tab") {
		var toRemove = cell.element[0].getElementsByClassName("tabs");
		if (toRemove.length > 0) {
                    var length = toRemove.length;
                    for (var i = 0; i < length; i++) {
			toRemove[0].parentNode.removeChild(toRemove[0]);
                    }
                    cell.element[0].getElementsByClassName("input")[0].className = 'input';
                    cell.element[0].getElementsByClassName("output_wrapper")[0].className = 'output_wrapper';
                    cell.element[0].getElementsByClassName("input")[0].id = '';
                    cell.element[0].getElementsByClassName("output_wrapper")[0].id = '';
	            cell.metadata.format = "row";
		}
            }
            if (div.css("box-orient") == "vertical") {
		div.css("box-orient", "horizontal");
		div.css("flex-direction", "row");
		var input = div[0].getElementsByClassName("input")[0];
		input.style.width = "50%";
		var output = div[0].getElementsByClassName("output_wrapper")[0];
		output.style.width = "50%";
		cell.metadata.format = "column";
            } else {
		//default:
		div.css("box-orient", "vertical");
		div.css("flex-direction", "column");
		var input = div[0].getElementsByClassName("input")[0];
		input.style.width = "";
		var output = div[0].getElementsByClassName("output_wrapper")[0];
		output.style.width = "";
		cell.metadata.format = "row";
            }
	}
    }
    
    function toggle_tabs(evt, input_cell) {
	// Toggle code cells into Input/Output tabs
	var cells = IPython.notebook.get_cells();
	var cell;
	var tabLinks = new Array();
	var contentDivs = new Array();
	
	if (input_cell == undefined) {
            cell = IPython.notebook.get_selected_cell();
	} else {
	    cell = input_cell;
	}
	
	var toRemove = cell.element[0].getElementsByClassName("tabs");
	if (toRemove.length > 0) {
            var length = toRemove.length;
            for (var i = 0; i < length; i++) {
		toRemove[0].parentNode.removeChild(toRemove[0]);
            }
            cell.element[0].getElementsByClassName("input")[0].className = 'input';
            cell.element[0].getElementsByClassName("output_wrapper")[0].className = 'output_wrapper';
            cell.element[0].getElementsByClassName("input")[0].id = '';
            cell.element[0].getElementsByClassName("output_wrapper")[0].id = '';
	    cell.metadata.format = "row";
	} else if (cell.cell_type == "code") {
            if (cell.metadata.format == "column") {
		var tempDiv = cell.element;
		tempDiv.css("box-orient", "vertical");
		tempDiv.css("flex-direction", "column");
		var input = tempDiv[0].getElementsByClassName("input")[0];
		input.style.width = "";
		var output = tempDiv[0].getElementsByClassName("output_wrapper")[0];
		output.style.width = "";
		cell.metadata.format = "row";
            }
            var div = document.createElement("div");
            cell.element[0].insertBefore(div, cell.element[0].getElementsByClassName("input")[0]);
	    
            div.className = "tabs";
            div.innerHTML = '<ul id="tabs"><li><a href="#input_tab" class>Input</a></li><li><a href="#output_tab" class>Output</a></li></ul>';
	    
            var inputDiv = cell.element[0].getElementsByClassName("input")[0];
            var outputDiv = cell.element[0].getElementsByClassName("output_wrapper")[0];
	    
            inputDiv.id = "input_tab";
            outputDiv.id = "output_tab";
	    inputDiv.className = 'input tabContent hide';
            outputDiv.className = 'output_wrapper tabContent';
	    cell.metadata.format = "tab";
            init();
	}
	
	function init() {
	    // Grab the tab links and content divs from the page
	    var tabListItems = cell.element[0].getElementsByTagName("ul")[0].childNodes;
	    for (var i = 0; i < tabListItems.length; i++) {
		if (tabListItems[i].nodeName == "LI") {
		    var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
		    var id = getHash(tabLink.getAttribute('href'));
		    tabLinks[id] = tabLink;
		    if (id == "input_tab") {
			contentDivs[id] = cell.element[0].getElementsByClassName("input")[0];
		    } else {
			contentDivs[id] = cell.element[0].getElementsByClassName("output_wrapper")[0];
		    }
		}
	    }  
	    
	    // Assign onclick events to the tab links, and
	    // highlight the second tab
	    var i = 0;
	    
	    for (var id in tabLinks) {
		tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if (i == 1) tabLinks[id].className = 'selected';
		i++;
	    }
	    
	    // Hide all content divs except the first
	    var i = 0;
	    
	    for (var id in contentDivs) {
		if (i != 1) {
		    if (contentDivs[id].className.indexOf("input") != -1) {
			contentDivs[id].className = 'input tabContent hide';
		    } else {
			contentDivs[id].className = 'output_wrapper tabContent hide';
		    }
		}
		i++;
	    }
	}
	
	function showTab() {
	    var selectedId = getHash(this.getAttribute('href'));
	    
	    // Highlight the selected tab, and dim all others.
	    // Also show the selected content div, and hide all others.
	    for (var id in contentDivs) {
		if (id == selectedId) {
		    tabLinks[id].className = 'selected';
		    if (contentDivs[id].className.indexOf("input") != -1) {
			contentDivs[id].className = 'input tabContent';
		    } else {
			contentDivs[id].className = 'output_wrapper tabContent';
		    }
		} else {
		    tabLinks[id].className = '';
		    if (contentDivs[id].className.indexOf("input") != -1) {
			contentDivs[id].className = 'input tabContent hide';
		    } else {
			contentDivs[id].className = 'output_wrapper tabContent hide';
		    }
		}
	    }
	    
	    // Stop the browser following the link
	    return false;
	}
	
	function getFirstChildWithTagName(element, tagName) {
	    for (var i = 0; i < element.childNodes.length; i++) {
		if (element.childNodes[i].nodeName == tagName) return element.childNodes[i];
	    }
	}
	
	function getHash(url) {
	    var hashPos = url.lastIndexOf ('#');
	    return url.substring(hashPos + 1);
	}
    }
    
    function checkForFormatting () {
	// Check to see if code cells have metadata formatting (two-column, tabs)
	// and toggle if they do.
	var cells = IPython.notebook.get_cells();
	for (var i = 0; i < cells.length; i++) {
	    var cell = cells[i];
	    if (cell.cell_type == "code") {
		if (cell.metadata.format == "tab") {
		    toggle_tabs("temp", cell);
		} else if (cell.metadata.format == "column") {
		    toggle_columns("temp", cell);
		}
	    }
	}
    }
    
    var load_css = function () {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	var path = './cell-tools.css';
	link.href = require.toUrl(path);
	document.getElementsByTagName("head")[0].appendChild(link);
    };

    var add_toolbar_buttons = function () {
	Jupyter.actions.register({
	    'help'   : 'Toggle tabbed view on a code cell',
	    'icon'    : 'fa-folder', 
	    'handler': toggle_tabs
	}, 'toggle_tabs', 'cell_tools');

	Jupyter.actions.register({
	    'help'   : 'Toggle two-column view on a code cell',
	    'icon'    : 'fa-columns', 
	    'handler': toggle_columns
	}, 'toggle_columns', 'cell_tools');

	IPython.toolbar.add_buttons_group([
	    {
		'action': 'cell_tools:toggle_tabs'
	    },
	    {
		'action': 'cell_tools:toggle_columns'
	    }
	], 'cell_tools-buttons');
    };
    
    var load_ipython_extension = function () {
	// Load the CSS for spelling errors (red wavy line under misspelled word):
	load_css();
	
	$([IPython.events]).on('notebook_loaded.Notebook', function() {
	    checkForFormatting();	
	});
	
	// Put a button on the toolbar:
	if (!IPython.toolbar) {
	    $([IPython.events]).on("app_initialized.NotebookApp", add_toolbar_buttons);
	    return;
	} else {
	    add_toolbar_buttons();
	}
    };

    return {
        load_ipython_extension : load_ipython_extension,
    };

});
