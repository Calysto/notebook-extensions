/**
 * Calico Jupyter Notebooks Extensions
 *
 * Copyright (c) The Calico Project
 * http://calicoproject.org/ICalico
 *
 * Released under the BSD Simplified License
 *
 **/

require(["base/js/events"], function (events) {
    events.on("app_initialized.NotebookApp", function () {
	IPython.load_extensions("calico-spell-check",
				"calico-document-tools",
				"calico-cell-tools"
			       );
	
    });
});

