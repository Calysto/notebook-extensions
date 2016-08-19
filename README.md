# Notebook-extensions

This repository contains several Javascript extensions for Jupyter:
* Cell tools: Two column and tabbed modes for input/output of notebook cells
* Document tools:
 * Sections: Move whole sections up and down, number sections.
 * Create table of contents (TOC) and create references/citations
* Spell check: spell check for markdown cells

Student interaction:
* Publish: your notebook, by copying it to a certain directory
* Submit: copies notebook to instructor

These extensions where once part of the [Calico project](http://calicoproject.org/).

Install
-------

Install:

```
$ jupyter nbextension install https://github.com/Calysto/notebook-extensions/archive/master.zip
```

Then enable the extensions you want:

```
$ jupyter nbextension enable calysto/document-tools/main
$ jupyter nbextension enable calysto/cell-tools/main
$ jupyter nbextension enable calysto/spell-check/main
$ jupyter nbextension enable calysto/publish/main
$ jupyter nbextension enable calysto/submit/main
```

When you now open or reload a notebook, it should load the extensions.

Videos
------
