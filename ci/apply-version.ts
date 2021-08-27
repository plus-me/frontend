import * as fs from 'fs';
import * as path from 'path';
import * as xmldom from '@xmldom/xmldom';

const parser = new xmldom.DOMParser();

const configFile = path.join(__dirname, '../config.xml');
const packageJson = require(path.join(__dirname, '../package.json'));
const configXml = parser.parseFromString(fs.readFileSync(configFile, 'utf-8'));

const buildNumber = process.env.GITHUB_RUN_ID;

configXml.documentElement.setAttribute('android-versionCode', buildNumber);
configXml.documentElement.setAttribute('ios-CFBundleVersion', buildNumber);
configXml.documentElement.setAttribute('version', packageJson.version);

fs.writeFileSync(configFile, configXml.toString());
