# Axel SDK Demo

### Getting Started

First, let's clone the repository. Cloning through SSH is recommended.
```sh
git clone git@github.com/nstrike2/defi-api.git
cd defi-api
```
Next, let's install the necessary dependencies.
```sh
make install
```
Note: The dependency `react-scripts` depends on a package with a known vulnerability. The react team claims this is harmless because react-scripts is only used in the buildchain, so the vulnerability can't be exploited: <>. To show any npm errors unrelated to that, we run `npm audit --omit=dev` to omit the react-script errors.

### Running the demo
```sh
make start
```

### Warning:
In order to properly integrate the Axel SDK, this repository exposes a functioning Axel API key.

**Make sure that the API key is made non-functional if this repository ever gets made public.**
