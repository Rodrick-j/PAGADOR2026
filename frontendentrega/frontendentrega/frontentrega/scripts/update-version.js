const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const init = async () => {
  const relativePath = 'public/meta.json';
  const filePath = path.resolve(__dirname, '..', relativePath);

  const fileContent = `{
  "version": "${packageJson.version}",
  "date": "${new Date().toISOString()}"
}
`;

  fs.writeFileSync(filePath, fileContent);

  // agregar meta.json al commit que hará `npm version`
  execSync(`git add ${relativePath}`, { stdio: 'inherit' });
};

init();
