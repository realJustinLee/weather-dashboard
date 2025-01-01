# weather-dashboard

The weather dashboard meant to run on RSBP

## Main Requirements

> - node.js `v22.9.0`
> - react.js `18.3.1`
> - bootstrap '5.3.3'

## Version

- `1.0.1`

## Platform Compatibility

- [x] macOS
- [x] Linux
- [x] Windows 11

## Installation Guide

Run the following code in the terminal to install and run the project.

```shell
git clone https://github.com/realJustinLee/weather-dashboard.git
cd weather-dashboard

cat>./.env<<EOF
REACT_APP_Q_API=https://devapi.qweather.com/v7/
REACT_APP_Q_KEY=<key>
REACT_APP_LOCATION=<location_string>
REACT_APP_LOCATION_ID=<location_id>
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

™ and © 1997-2024 Justin Lee. All Rights Reserved. [License Agreement](./LICENSE)
