
all: calico-spell-check-1.0.zip calico-cell-tools-1.0.zip calico-document-tools-1.0.zip

calico-spell-check-1.0.zip: calico-spell-check.js calico-spell-check.css
	zip -r calico-spell-check-1.0.zip calico-spell-check.js \
					calico-spell-check.css \
					words.json \
					typo \
					-x "*\.git*" "*\.ipynb_checkpoints*" 

calico-cell-tools-1.0.zip: calico-cell-tools.js calico-cell-tools.css
	zip -r calico-cell-tools-1.0.zip calico-cell-tools.js \
					calico-cell-tools.css \
					-x "*\.git*" "*\.ipynb_checkpoints*" 

calico-document-tools-1.0.zip: calico-document-tools.js 
	zip -r calico-document-tools-1.0.zip calico-document-tools.js \
					bibtex.js \
					-x "*\.git*" "*\.ipynb_checkpoints*" 

clean::
	rm -rf *.zip
