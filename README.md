# LesserPanda CLI

Commandline tool for [LesserPanda engine](https://github.com/pixelpicosean/lesser-panda)

## Support JavaScript features:

- ES2015 (using **loose mode** for better performance)
- force strict for every single file

## Usage

### Create a new project

`lpanda create MyAwesomeGame`

### Start a dev server

- `lpanda server`: by default **ES6** capatable browser is required, but rebuild pretty fast
- `lpanda server -es5`: transpile to **ES5** on every single change, rebuild is slower but should work in any browsers without issue.

### Build production bundle

- `lpanda build`: compile and bundle to `game.min.js` (Warning: **ES6** scripts won't get transpiled)
- `lpanda build -es5`: transpile **ES6** to **ES5** (recommended since ES6 is not fully supported by some browsers, especially mobile)
- `lpanda build -u`: compile and bundle without minify(uglify)

## TODO

- [x] Project generating command
- [ ] Engine upgrade command
