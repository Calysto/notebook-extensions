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
    function annotate() {
	function createCanvasOverlay(color) {
	    var canvasContainer = document.createElement('div'); 
	    var container = document.body;
	    document.body.appendChild(canvasContainer);
	    canvasContainer.style.position="absolute";
	    canvasContainer.style.left="0px";
	    canvasContainer.style.top="0px";
	    canvasContainer.style.width="100%";
	    canvasContainer.style.height="100%";
	    canvasContainer.style.zIndex="1000";
	    
	    var myCanvas = document.createElement('canvas');    
	    myCanvas.style.width = container.scrollWidth+"px";
	    myCanvas.style.height = container.scrollHeight+"px";
	    myCanvas.width=container.scrollWidth;
	    myCanvas.height=container.scrollHeight;    
	    myCanvas.style.overflow = 'visible';
	    myCanvas.style.position = 'absolute';
	    canvasContainer.appendChild(myCanvas);
	    
	    var context=myCanvas.getContext('2d');
	    context.strokeStyle=color;  // a green line
	    context.lineWidth=4;                 // 4 pixels thickness     
	    
	    var buttonGroup = document.createElement('div');
	    buttonGroup.className = "btn-group";
	    buttonGroup.style.position="relative";      
	    buttonGroup.style.float="right";
	    
	    var button = document.createElement('button');
	    button.innerHTML = 'Close';
	    button.addEventListener ("click", hideCanvas);
	    buttonGroup.append(button);
	    
	    button = document.createElement('button');
	    button.innerHTML = 'Red';
	    button.style.backgroundColor = "#FF0000";
	    button.style.color = "white";
	    button.addEventListener ("click", function() {
		context.strokeStyle = 'rgb(255,0,0)';
	    });
	    buttonGroup.append(button);
	    
	    button = document.createElement('button');
	    button.innerHTML = 'Green';
	    button.style.backgroundColor = "#00FF00";
	    button.style.color = "white";
	    button.addEventListener ("click", function() {
		context.strokeStyle = 'rgb(0,255,0)';
	    });
	    buttonGroup.append(button);
	    
	    button = document.createElement('button');
	    button.innerHTML = 'Blue';
	    button.style.backgroundColor = "#0000FF";
	    button.style.color = "white";
	    button.addEventListener ("click", function() {
		context.strokeStyle = 'rgb(0,0,255)';
	    });
	    buttonGroup.append(button);
	    
	    button = document.createElement('button');
	    button.innerHTML = 'Purple';
	    button.style.backgroundColor = "#FF00FF";
	    button.style.color = "white";
	    button.addEventListener ("click", function() {
		context.strokeStyle = 'rgb(255,0,255)';
	    });
	    buttonGroup.append(button);
	    
	    button = document.createElement('button');
	    button.innerHTML = 'Clear';
	    button.addEventListener ("click", function() {
		hideCanvas();
		createCanvasOverlay('rgb(255,0,255)');
	    });
	    buttonGroup.append(button);
	    
	    canvasContainer.appendChild(buttonGroup);
	    myCanvas.parentNode.addEventListener('mousemove', onMouseMoveOnMyCanvas, false); 
	    myCanvas.parentNode.addEventListener('mousedown', onMouseDownOnMyCanvas, false); 
	    myCanvas.parentNode.addEventListener('mouseup', onMouseUpOnMyCanvas, false); 
	    
	    myCanvas.parentNode.addEventListener('touchstart', onTouchStartOnMyCanvas, false); 
	    myCanvas.parentNode.addEventListener('touchmove', onTouchMoveOnMyCanvas, false); 
	    myCanvas.parentNode.addEventListener('touchend', onTouchEndOnMyCanvas, false); 
	    
	    document.myCanvas = myCanvas;
	}
	
	function onTouchStartOnMyCanvas(event) {
	    event.layerX = parseInt(event.changedTouches[0].clientX);
	    event.layerY = parseInt(event.changedTouches[0].clientY);
	    onMouseDownOnMyCanvas(event);
	}
	function onTouchMoveOnMyCanvas(event) {
	    event.layerX = parseInt(event.changedTouches[0].clientX);
	    event.layerY = parseInt(event.changedTouches[0].clientY);
	    onMouseMoveOnMyCanvas(event);     
	}
	function onTouchEndOnMyCanvas(event) {
	    event.layerX = parseInt(event.changedTouches[0].clientX);
	    event.layerY = parseInt(event.changedTouches[0].clientY);
	    onMouseUpOnMyCanvas(event);
	}
	
	function onMouseMoveOnMyCanvas(event)
	{
	    var myCanvas = document.myCanvas;
	    if (myCanvas.drawing)
	    {  
		var mouseX=event.layerX;  
		var mouseY=event.layerY;
		
		var context = myCanvas.getContext("2d");
		if (myCanvas.pathBegun==false)
		{
		    context.beginPath();
		    myCanvas.pathBegun=true;
		}
		else
		{
		    context.lineTo(mouseX, mouseY);
		    context.stroke();
		}
	    }
	}
	
	function onMouseDownOnMyCanvas(event)
	{
	    var myCanvas = document.myCanvas;
	    myCanvas.drawing = true;
	    myCanvas.pathBegun=false;
	}
	
	function onMouseUpOnMyCanvas(event)
	{
	    var myCanvas = document.myCanvas;
	    myCanvas.drawing = false;
	    myCanvas.pathBegun=false;
	}
	
	function hideCanvas()
	{
	    var myCanvas = document.myCanvas;
	    if (myCanvas)
	    {
		myCanvas.parentNode.style.visibility='hidden';
	    }
	}
	
	createCanvasOverlay('rgb(255,0,255)');
    }

    var load_ipython_extension = function () {
	// Put a button on the toolbar:
	if (!IPython.toolbar) {
	    $([IPython.events]).on("app_initialized.NotebookApp", 
				   add_toolbar_buttons);
	    return;
	} else {
	    add_toolbar_buttons();
	}
    };
    
    var add_toolbar_buttons = function () {
	Jupyter.actions.register({
	    'help'   : 'Annotate',
	    'icon'    : 'fa-pencil',
	    'handler': annotate
        }, 'annotate', 'annotate');

	IPython.toolbar.add_buttons_group([
	    {
		'action': 'annotate:annotate'
	    }
	], 'annotate-buttons');
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
    };
});
