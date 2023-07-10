const { writeFileSync, mkdirSync } = require('fs');
require('dotenv').config();

const filePath = './src/environments';
const targetPath = './src/environments/environments.ts';

const envFileContent = `
export const environment = {
  mapbox_key: "${process.env['MAPBOX_KEY']}",
  otra: "PROPIEDAD"
}
`;

mkdirSync(filePath, { recursive: true });
writeFileSync(targetPath, envFileContent);
