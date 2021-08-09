import * as fs from 'fs';
import * as path from 'path';

const buildFile = path.join(__dirname, '../build.json');

const buildJson = require(buildFile);

buildJson.android.release.password = process.env.ANDROID_KEYSTORE_PASSWORD;
buildJson.android.release.storePassword = process.env.ANDROID_KEYSTORE_PASSWORD;


fs.writeFileSync(buildFile, JSON.stringify(buildJson));
