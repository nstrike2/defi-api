. := $(dir $(abspath $(MAKEFILE_LIST)))
ifeq ($(OS), Windows_NT)
	PATH := $.\node_modules\.bin;$(PATH)
else
	PATH := $./node_modules/.bin:$(PATH)
endif

purgeinstall:
	-rd /s /q node_modules
	-del /f package-lock.json
.PHONY: purgeinstall

install:
	npm install
	npm audit --omit=dev
.PHONY: install

start:
	react-scripts start
.PHONY: start
