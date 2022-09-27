ifeq ($(OS), Windows_NT)
	PATH := $(PATH);.\node_modules\.bin
else
	PATH := $(PATH):./node_modules/.bin
endif

start:
	react-scripts start
.PHONY: start
