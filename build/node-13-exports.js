// source: https://github.com/preactjs/preact/blob/master/config/node-13-exports.js

const fs = require('fs');

const subRepositories = ['l10n', 'plugins/selection'];
const snakeCaseToCamelCase = str =>
	str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', ''));

const copyGridJS = () => {
	// Copy .module.js --> .mjs for Node 13
	fs.writeFileSync(
		`${process.cwd()}/dist/gridjs.mjs`,
		fs.readFileSync(`${process.cwd()}/dist/gridjs.module.js`)
	);
};

const copyGridJSLegacy = () => {
  fs.writeFileSync(
    `${process.cwd()}/dist/gridjs.production.min.js`,
    fs.readFileSync(`${process.cwd()}/dist/gridjs.umd.js`)
  );

  fs.writeFileSync(
    `${process.cwd()}/dist/gridjs.production.es.min.js`,
    fs.readFileSync(`${process.cwd()}/dist/gridjs.module.js`)
  );
};

const copy = name => {
	// Copy .module.js --> .mjs for Node 13 compat.
	const filename = (name.includes('-') ? snakeCaseToCamelCase(name) : name).split('/').splice(-1);

	fs.writeFileSync(
		`${process.cwd()}/${name}/dist/${filename}.mjs`,
		fs.readFileSync(`${process.cwd()}/${name}/dist/${filename}.module.js`)
	);
};

copyGridJS();
copyGridJSLegacy();
subRepositories.forEach(copy);
