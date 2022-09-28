ifeq ($(OS), Windows_NT)
	PATH := $(PATH);.\node_modules\.bin
else
	PATH := $(PATH):/Users/neetishsharma/Desktop/defi-api/node_modules/.bin
endif

os:
	echo $(OS)
.PHONY: os

path:
	echo $(PATH)
.PHONY: path

start:
	react-scripts start
.PHONY: start