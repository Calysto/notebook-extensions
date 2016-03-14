# Notebook-extensions

This repository contains several Javascript extensions for Jupyter:
* Cell tools: Two column and tabbed modes for input/output of notebook cells
* Document tools:
 * Sections: Move whole sections up and down, number sections.
 * Create table of contents (TOC) and create references/citations
* Spell check: spell check for markdown cells

Part of the calico student interaction part:
* Publish: your notebook, by copying it to a certain directory
* Submit: 

These extensions where once part of the [Calico project](http://calicoproject.org/).

Install
-------

Install:

```
$ jupyter nbextension install https://github.com/Calysto/notebook-extensions/archive/master.zip
```

Then enable this extension:

```
$ jupyter nbextension enable calico-document-tools
```

When you now open or reload a notebook, it should load the extension

See also [this question on stackoverflow](http://stackoverflow.com/questions/32046241/how-to-add-automatically-extension-to-jupiter-ipython-notebook/32583739#32583739)

Videos
------
