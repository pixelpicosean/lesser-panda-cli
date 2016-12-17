# LesserPanda CLI

Commandline tool for [LesserPanda engine](https://github.com/pixelpicosean/lesser-panda)
Can also be used in any ES6/CommonJS project with similar folder structure.

## Features:

- CommonJS (including image, shader and font loading support)
- Automatically convert resource files (image or font) that are less than 10kb to data url
- ES6 (using **loose mode** if requests Babel transpile for better performance)
- Force strict for every single file (if request Babel transpile)

## Support Node.js

You need a **ES6** capatable Node.js.

Any Node.js version that supports **ES6** should work, although only `v7.0.0` tested.

## Usage

### Create a new project

`lpanda create MyAwesomeGame`

### Start a dev server

- `lpanda server`: by default **ES6** capatable browser is required, but rebuild pretty fast
- `lpanda server -es5`: transpile to **ES5** on every single change, rebuild is slower but should work in any browsers without issue.

### Build production bundle

- `lpanda build`: compile and bundle to `game.min.js` (Warning: **ES6** scripts won't get transpiled, and **uglify** doesn't work)
- `lpanda build -es5`: transpile **ES6** to **ES5** (recommended since ES6 is not fully supported by some browsers, especially mobile)
- `lpanda build -es5 -u`: transpile and bundle without minify(uglify)

### Use for general(non LesserPanda) projects

The only thing you need is a similar project:

- root
  - src/
    - game/main.js
  - index.html

And don't forget to add a script tag in the `index.html` file:

```html
<script src="game.js"></script>
```

## TODO

- [x] Project generating command
- [ ] Engine upgrade command
