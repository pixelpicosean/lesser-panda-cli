# Voltar CLI

Commandline tool for [Voltar engine](https://github.com/pixelpicosean/voltar)
Can also be used in any ES6/CommonJS project with similar folder structure.

## Features:

- CommonJS (including image, shader and font loading support)
- Automatically convert resource files (image or font) that are less than 10kb to data url
- ES6 (using **loose mode** if requests Babel transpile for better performance)
- Force strict for every single file (if request Babel transpile)

## Support Node.js

You need a **ES6** capatable Node.js.

Any Node.js version that supports **ES6** should work, `v7.0.0+` tested.

## Usage

### Create a new project

`voltar create MyAwesomeGame`

### Start a dev server

- `voltar server`: by default **ES6** capatable browser is required, but rebuild pretty fast
- `voltar server -es5`: transpile to **ES5** on every single change, rebuild is slower but should work in any browsers without issue.
- `voltar server -p 3000`: set server port (either `-p 3000` or `--port 3000`)

### Build production bundle

- `voltar build`: compile and bundle to `game.min.js`
- `voltar build -es5`: transpile **ES6** to **ES5** (recommended since ES6 is not fully supported by some browsers, especially mobile)

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
