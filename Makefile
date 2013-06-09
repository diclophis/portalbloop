# OSX Makefile

build: public/javascripts/node.js
	touch public/app.zip && rm public/app.zip && zip public/app.zip public/*

public/javascripts/node.js: public/javascripts/index.js public/javascripts/secret.js node_modules/**/*
	#browserify -r imap -r util -r assert -r net-chromify:net public/index.js > public/node.js
	browserify -r imap -r util -r assert -r net-chromify:net public/javascripts/index.js > public/javascripts/node.js

clean:
	touch $(build) && rm -R $(build)

