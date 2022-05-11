# defi-api

## Getting Started!

```sh
git clone https://github.com/nstrike2/defi-api.git
cd defi-api
git checkout staking
yarn install
cd client
yarn install
cd ..
```

## Development

**fe**
```sh
yarn client
```

**be**
```sh
yarn server
```

**fe & be**
```sh
yarn start
```


## Current Blueprint
```sh

├── README.md
├── client
│   ├── README.md
│   ├── public
│   │   ├── close-icon.svg
│   │   ├── ethereum-logo.png
│   │   ├── favicon.ico
│   │   ├── gear.svg
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── index.js
└── routes
    ├── ethereum
    │   ├── index.js
    │   ├── kovan
    │   │   ├── index.js
    │   │   ├── kovan.json
    │   │   ├── lend
    │   │   │   ├── aave
    │   │   │   │   ├── aave.json
    │   │   │   │   └── index.js
    │   │   │   └── index.js
    │   │   ├── stake
    │   │   └── yield
    │   └── rinkeby
    │       ├── index.js
    │       ├── lend
    │       │   ├── compound
    │       │   │   ├── compound.json
    │       │   │   └── index.js
    │       │   └── index.js
    │       ├── rinkeby.json
    │       ├── stake
    │       └── yield
    └── index.js

```

