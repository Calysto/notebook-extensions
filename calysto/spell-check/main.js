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

    function toggle_spell_check() {
        // Toggle on/off spelling checking on for markdown and heading cells
        // toggle it!
        var spelling_mode = (require("notebook/js/textcell").MarkdownCell.options_default.cm_config.mode == document.original_markdown_mode);
        $('#toggle_spell_check').toggleClass('active', spelling_mode);
        //console.log(spelling_mode);
        // Change defaults for new cells:
        require("notebook/js/textcell").MarkdownCell.options_default.cm_config.mode = (spelling_mode ? "spell-check-markdown" : document.original_markdown_mode);
        if (document.original_heading_mode !== undefined) {
            IPython.HeadingCell.options_default.cm_config = {"mode": (spelling_mode ? "spell-check-heading" : document.original_heading_mode)};
        }
        // And change any existing markdown cells:
        var cells = IPython.notebook.get_cells();
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.cell_type == "markdown") {
                IPython.notebook.get_cell(i).code_mirror.setOption('mode', (spelling_mode ? "spell-check-markdown" : document.original_markdown_mode));
            } else if (cell.cell_type == "heading") {
                IPython.notebook.get_cell(i).code_mirror.setOption('mode', (spelling_mode ? "spell-check-heading" : document.original_heading_mode));
            }
        }
    }

    var load_css = function () {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        var path = './spell-check.css';
        link.href = require.toUrl(path);
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    var typo_check = function(word) {
        // Put your specific method of checking the spell of words here:
        // remove beginning or ending single quote
        return (document.dictionary.check(word.replace(/(^')|('$)/g, "")) ||
                (document.dictionary_words !== undefined && document.dictionary_words.hasOwnProperty(word)));
    };

    var load_ipython_extension = function () {
        if (!IPython.MarkdownCell) {
            $([IPython.events]).on("app_initialized.NotebookApp", load_ipython_extension);
            return;
        }

        // Load the CSS for spelling errors (red wavy line under misspelled word):
        load_css();

        $.getJSON(require.toUrl("./words.json"), function(json) {
            document.dictionary_words = json;
        });

        var makeOverlay = function(mode) {
            return function(config, parserConfig) {
                // This overlay sits on top of a mode, given below.
                // It first checks here to see if a CSS class should be given.
                // Here, "spell-error" is defined in the associated CSS file

                // rx_word defines characters not in words. Everything except single quote.
                var rx_word = new RegExp("[^\!\"\#\$\%\&\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~\ ]");
                var spellOverlay = {
                    token: function (stream, state) {
                        var ch;
                        if (stream.match(rx_word)) {
                            while ((ch = stream.peek()) != null) {
                                if (!ch.match(rx_word)) {
                                    break;
                                }
                                stream.next();
                            }
                            if (!typo_check(stream.current()))
                                return "spell-error";
                            return null;
                        }
                        while (stream.next() != null && !stream.match(rx_word, false)) {}
                        return null;
                    }
                };
                // Put this overlay on top of mode.
                // opaque: true allows the styles (spell-check and markdown) to be combined.
                return CodeMirror.overlayMode(CodeMirror.getMode(config, mode), spellOverlay, {"opaque": true});
            }
        }

        document.original_markdown_mode = IPython.MarkdownCell.options_default.cm_config.mode;
        CodeMirror.defineMode("spell-check-markdown", makeOverlay(document.original_markdown_mode));

        if (IPython.HeadingCell !== undefined && IPython.HeadingCell.options_default.cm_config !== undefined) {
            document.original_heading_mode = IPython.HeadingCell.options_default.cm_config.mode;
            CodeMirror.defineMode("spell-check-heading", makeOverlay(document.original_heading_mode));
        }

        // Load dictionary:
        require(["./typo/typo"], function () {
            var lang = "en_US";
            var dict_path = require.toUrl("./typo/dictionaries/");
            dict_path = dict_path.substr(0, dict_path.lastIndexOf("/"));
            document.dictionary = new Typo(lang, undefined, undefined,
                                           {"platform": "web",
                                            "dictionaryPath": dict_path});
        });

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
            'help'    : 'Toggle spell checking on a markdown cell',
            'icon'    : 'fa-check-square',
            'handler' : toggle_spell_check,
            'id'      : 'toggle_spell_check'
        }, 'toggle_spell_check', 'spell_check');

        IPython.toolbar.add_buttons_group([
            {
		'action' : 'spell_check:toggle_spell_check'
            }
        ], 'spell_check-buttons');
    };

    return {
        load_ipython_extension : load_ipython_extension,
    };
});
