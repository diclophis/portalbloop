# OSX Makefile

build: public/node.js
	touch public/app.zip && rm public/app.zip && zip public/app.zip public/*

public/node.js: public/index.js node_modules/**
	browserify -r imap -r util -r assert -r net-chromify:net public/index.js > public/node.js

clean:
	touch $(build) && rm -R $(build)

