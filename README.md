# Manual publish to npmjs registry

`cd` into the package directory.

Then you need to login to npmjs registry with `npm login`. Becareful with npmrc config between npm and nvm, it may cause some problems.

> Is the version in package.json correct?

Then to publish the package, run:
```sh
npm ci
npm run build
npm publish --access public
```