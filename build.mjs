import cp from 'child_process';
import fs from 'fs-extra';

fs.emptyDirSync('./dist');
const yarn = 'yarn' + (process.platform === 'win32' ? '.cmd' : '');
const tsc = cp.spawn(yarn, ['tsc', '-p', 'tsconfig.build.json']);
tsc.stdout.on('data', (buf) => {
    console.log(buf.toString('utf-8', 0, buf.length));
});
fs.copy('./src/resources', './dist/resources');