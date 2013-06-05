# OSX Makefile

public/node.js: public/index.js
	browserify -r imap -r util -r net-chromify:net public/index.js > public/node.js

build:
	touch public/app.zip && rm public/app.zip && zip public/app.zip public/*

clean:
	touch $(build) && rm -R $(build)

