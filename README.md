# Notebook-extensions

This repository contains several Javascript extensions for Jupyter:
* **Cell tools**: Two column and tabbed modes for input/output of notebook cells
* **Document tools**:
 * Sections: Move whole sections up and down, number sections.
 * Create table of contents (TOC) and create references/citations
* **Spell check**: spell check for markdown cells
* **Annotate**: temporary drawing annotation layer

User notebook sharing:
* **Publish**: publish your notebook, by copying it to a certain directory (requires jupyterhub)
* **Submit**: copies notebook to instructor (requires jupyerhub)

These extensions where once part of the [Calico project](http://calicoproject.org/).

Install
-------

First download this collection and cd into the folder (here, dollar-sign represents the shell prompt):

```shell
$ wget https://github.com/Calysto/notebook-extensions/archive/master.zip
$ unzip master.zip
$ cd notebook-extensions-master
OR:
$ git clone https://github.com/Calysto/notebook-extensions.git
$ cd notebook-extensions
```

Next, install them into --system, --sys-prefix, or --user:

```shell
$ jupyter nbextension install calysto --user
```

And finally, enable the extensions you want:

```shell
$ jupyter nbextension enable calysto/document-tools/main
$ jupyter nbextension enable calysto/cell-tools/main
$ jupyter nbextension enable calysto/spell-check/main
$ jupyter nbextension enable calysto/publish/main
$ jupyter nbextension enable calysto/submit/main
$ jupyter nbextension enable calysto/annotate/main
```

To check their status:

```shell
$ jupyter nbextension list
```

When you now open or reload a notebook, it should load the extensions.
