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
    function publish_notebook() {
	// http://jupyter.cs.brynmawr.edu/user/dblank/notebooks/Calico/notebooks/BrainScrew/BrainScrew%20Examples.ipynb
	var base_url = document.URL.substr(0,document.URL.indexOf('/notebooks/'));
	var user = document.URL.substr(document.URL.indexOf('/user/') + 6);
	user = user.substr(0, user.indexOf('/notebooks/'));
	base_url = base_url.replace(/\/user\//g, "/hub/");
	// BrainScrew%20Examples.ipynb
	var path = IPython.notebook.notebook_path;
	path = path.replace(/"/g, '\\"');
	var filename = path.substr(path.lastIndexOf('/') + 1);
	path = path.substr(0, path.lastIndexOf('/'));
	console.log('/home/' + user + '/' + path + '/' + filename);
	console.log('~/public_html/' + filename);
	if (path.indexOf("public_html") !== -1) {
	    path = path.replace("public_html", "");
	    require(['jquery',
		 'base/js/dialog'
		], function ($, dialog) {
		    var body = $('<div/>');
		    body.append($('<h4/>').text('Your notebook is publically available at:'));
		    var url = base_url + '/public/' + path.replace(/ /g, "%20") + '/' + filename.replace(/ /g, "%20");
		    var link = $('<a target="_blank"/>').attr('href', url);
		    link.text(url);
		    body.append($('<p/>').html(link));
		    dialog.modal({
			title: 'Shared Notebook',
			body: body,
			buttons: { 
			    'OK': {}
			}
		    });
		});
	} else {
	    require(['jquery',
		 'base/js/dialog'
		], function ($, dialog) {
		    var body = $('<div/>');
		    body.append($('<h4/>').text("You want to publish this notebook?"));
		    body.append($('<p/>').text("Copies:"));
		    body.append($('<p/>').html($('<b/>').text("/home/" + user + '/' + path + '/' + filename)));
		    body.append($('<p/>').text("to:"));
		    body.append($('<p/>').html($('<b/>').text("~/public_html/" + filename)));
		    dialog.modal({
			title: 'Publish a Notebook',
			body: body,
			buttons: {
			    'Publish': { class: "btn-primary",
					 click: function() {
			        function handle_output(out) {
				    if ((out.content.name === "stdout") && (out.content.text.indexOf("Ok") !== -1)) {
					var body = $('<div/>');
					body.append($('<h4/>').text('Your notebook is now publically available at:'));
					var url = base_url + '/public/' + filename.replace(/ /g, "%20");
					var link = $('<a target="_blank"/>').attr('href', url);
					link.text(url);
					body.append($('<p/>').html(link));
					dialog.modal({
					    title: 'Shared Notebook',
					    body: body,
					    buttons: { 
						'OK': {}
					    }
					});
				    }
				}
			        var callbacks = { 'iopub' : {'output' : handle_output}};
				IPython.notebook.kernel.execute('%%python \n\
\n\
import os \n\
import shutil \n\
import stat \n\
import errno \n\
\n\
def publish(src, dst): \n\
    if dst.startswith("~"): \n\
        dst = os.path.expanduser(dst) \n\
    dst = os.path.abspath(dst) \n\
    # Create the path of the file if dirs do not exist: \n\
    path = os.path.dirname(os.path.abspath(dst)) \n\
    try: \n\
        os.makedirs(path) \n\
    except OSError as exc: # Python >2.5 \n\
        if exc.errno == errno.EEXIST and os.path.isdir(path): \n\
            pass \n\
        else: \n\
            raise \n\
    shutil.copyfile(src, dst) \n\
    os.chmod(dst, stat.S_IRUSR | stat.S_IWUSR | stat.S_IROTH | stat.S_IRGRP) \n\
    print("Ok") \n\
\n\
publish("/home/' + user + '/' + path + '/' + filename + '", "~/public_html/' + filename + '")',
							       callbacks, {silent: false});
				
				return true;
			    } // function
			}, // publish button
			    'Cancel': {}
		        } // buttons
		    }); // Dialog.modal
		}); // require
          } // if/else
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
	var version = IPython.version.substring(0, 1);
	IPython.toolbar.add_buttons_group([
	    // select your icon from http://fortawesome.github.io/Font-Awesome/icons
	    {
		'label'   : 'Publish this notebook',
		'icon'    : (version === "2") ? 'icon-link' : 'fa-link',
		'callback': publish_notebook
	    }
	]);
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
    };
});
