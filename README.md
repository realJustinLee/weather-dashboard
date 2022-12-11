# weather-dashboard

The weather dashboard meant to run on RSBP

## Main Requirements

> - node.js `v19.2.0`
> - react.js `18.2.0`
> - bootstrap '5.2.3'

## Version

- `0.1.0`

## Platform Compatibility

- [x] macOS
- [x] Linux
- [x] Windows 11

## Installation Guide

Run the following code in the terminal to install and run the project.

```shell
git clone https://github.com/realJustinLee/weather-dashboard.git
cd weather-dashboard

cat>~/.env<<EOF
REACT_APP_HE_KEY=<your_he_key>
REACT_APP_CITY=<city>
REACT_APP_DISTRICT=<district>
REACT_APP_STATION=<station>
EOF

npm run rebuild
npm install -g serve
serve -s build
```

## Screen Shots

The Dashboard
![The Dashboard](./screenshots/index.png)

## TODO

- [ ] Release this project to a desktop app with electron.

# Made with ❤ by [Justin Lee](https://github.com/realJustinLee)!

™ and © 1997-2022 Justin Lee. All Rights Reserved. [License Agreement](./LICENSE)
