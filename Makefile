# OSX Makefile

build:
	touch public/app.zip && rm public/app.zip && zip public/app.zip public/*

clean:
	touch $(build) && rm -R $(build)

