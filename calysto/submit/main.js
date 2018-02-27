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
    function submit_notebook() {
	    require(['jquery',
		 'base/js/dialog'
		], function ($, dialog) {
		    var body = $('<div/>');
		    body.append($('<h4/>').text("You want to submit this notebook?"));
		    dialog.modal({
			title: 'Submit a Notebook',
			body: body,
			buttons: {
			    'Submit': { class: "btn-primary",
					 click: function() {
			        function handle_output(out) {
				    if ((out.content.name === "stdout" && out.content.text.trim() !== "")) {
					// get possible submits
					var json_text = out.content.text;
					var submissions = JSON.parse(json_text);
					//var submissions = JSON.parse('[["dblank","Assignment1"]]');
					var users = [];
					var assignments = {};
					var item;
					for (item in submissions) {
					    var user_assignment = submissions[item];
					    if (users.indexOf(user_assignment[0]) === -1)  { // not contains
						users.push(user_assignment[0]);
						assignments[user_assignment[0]] = [user_assignment[1]];
					    } else {
						assignments[user_assignment[0]].push(user_assignment[1]);
					    }
					}
					document.instructor_changed = function () {
					    var instructor = document.getElementById("instructor").value;
					    var assignment = document.getElementById("assignment");
					    var assignment_options = $('<select id="temp"/>');
					    for (item in assignments[instructor]) {
						var assign = assignments[instructor][item];
						assignment_options.append($('<option value=' + assign + '>' +  assign + '</option>'));
					    }
					    assignment.innerHTML = assignment_options.html();
					    console.log(assignment);
					};
					var selection = $('<select id="instructor" onchange="document.instructor_changed()"/>');
					for (item in users) {
					    var user = users[item];
					    selection.append($('<option value=' + user + '>' +  user + '</option>'));
					}
					var body = $('<div/>');
					body.append($('<h4/>').text('Submit to:'));
					body.append($('<p/>').html(selection));
					var assignment_options = $('<select id="assignment"/>');
					for (item in assignments[users[0]]) {
					    var assign = assignments[users[0]][item];
					    assignment_options.append($('<option value=' + assign + '>' +  assign + '</option>'));
					}
					body.append($('<h4/>').text('Assignment:'));
					body.append($('<p/>').html(assignment_options));
					dialog.modal({
					    title: 'Submit Notebook',
					    body: body,
					    buttons: { 
						'OK': {
						    class: "btn-primary",
						    click: function() {
							// http://jupyter.cs.brynmawr.edu/user/dblank/notebooks/tests%20for%20reading%20Submissions.ipynb
							// http://localhost:8888/notebooks/Untitled29.ipynb?kernel_name=python3
							var filename = '/' + IPython.notebook.notebook_path;
							// handle double quotes, any other escape chars
							filename = filename.replace(/"/g, '\\"');
							var user;
							if (document.URL.indexOf('/user/') !== -1) {
							    user = document.URL.substr(document.URL.indexOf('/user/') + 6);
							    user = user.substr(0, user.indexOf('/notebooks/'));
							} else {
							    user = 'dblank';
							}
							var instructor = document.getElementById("instructor").value;
							var assignment = document.getElementById("assignment").value;
							console.log('"/home/' + user + filename + '"');
							console.log('"/home/' + instructor + '/Submissions/' + assignment + '/' + user + '.ipynb"');
							function handle_result(out) {
							    if ((out.content.name === "stdout" && out.content.text.trim() !== "")) {
								var result = out.content.text;
								var body = $('<div/>');
								body.append($('<h4/>').text('Results'));
								body.append($('<p/>').text(result));
								dialog.modal({
								    title: 'Submit Notebook Results',
								    body: body,
								    buttons: { 
									'OK': {}
									}
								    });
								}
							    };
							var callbacks = { 'iopub' : {'output' : handle_result}};
							IPython.notebook.kernel.execute('%%python \n\
import shutil \n\
src = "/home/' + user + filename + '"\n\
dst = "/home/' + instructor + '/Submissions/' + assignment + '/' + user + '.ipynb"\n\
shutil.copyfile(src, dst) \n\
print("Your submission was received.")',
											callbacks, {silent: false});
						    }
						},
						'Cancel': {}
					    }
					});
				    }
				}
			        var callbacks = { 'iopub' : {'output' : handle_output}};
				IPython.notebook.kernel.execute('%%python \n\
import glob \n\
import re \n\
folders = glob.glob("/home/*/Submissions/*") \n\
print("[" + ", ".join(["[\\"%s\\", \\"%s\\"]" % pair for pair in [re.match("/home/(.*)/Submissions/(.*)", folder).groups() for folder in folders]]) + "]")',
								callbacks, {silent: false});
				
				return true;
			    } // function
			}, // submit button
			    'Cancel': {}
		        } // buttons
		    }); // Dialog.modal
		}); // require
    }; // function submit_notebook

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
	    'help'   : 'Submit this notebook',
	    'icon'    : 'fa-inbox',
	    'handler': submit_notebook
	}, 'submit_notebook', 'submit');

	IPython.toolbar.add_buttons_group([
	    {
		'action': 'submit:submit_notebook'
	    }
	], 'submit-buttons');
    };
    
    return {
        load_ipython_extension : load_ipython_extension,
    };
});
