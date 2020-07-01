const fs = require('fs')
const { PythonShell } = require('python-shell')
const mergerPy = './merger.py'
const cliProgress = require('cli-progress');
const {_, o, ...args} = require('minimist')(process.argv.slice(2), { '--': true });
const config = {
  pathList: [..._],
  output: o,
  lastWords: Object.values(args).flat()
};

const runShell = (callback) => {
  const options = {
    mode: 'json',
    args: config.pathList
  };

  return PythonShell.run(mergerPy, options, callback);
}

const print = (list, index, bar) => {
  bar.update(index);
  if (index + 1 === list.length) {
    bar.stop();
    console.log('Merging finished')
    return;
  }

  fs.appendFile(config.output, list[index], () => print(list, index + 1, bar));
}

const processValue = ((err, res) => {
  if (err) throw err;
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const insertQueryList = [];
  res.forEach((obj,i) => {
    const { pathIndex } = obj;
    delete obj.pathIndex;
    const values = Object.values(obj);    
    let insertQuery = 'INSERT INTO KLT_ORDER VALUES ('
    values.forEach((value, i) => {
      if (typeof value === 'string') {
        const isnum = /^\d+$/g.test(value);
        if (!isnum) {
          value = value.replace(/'/g, "''")
          value = `'${value}'`
        }
      }
      insertQuery += `${value},`
    })
    insertQuery += `${ pathIndex ? config.lastWords[pathIndex] : '' });\nGO\n`;
    insertQueryList.push(insertQuery);
  })
  fs.writeFile(config.output, '', () => {
    console.log('Start printing...');
    bar.start(insertQueryList.length, 0);
    print(insertQueryList, 0, bar);
  })
})

console.log('Reading files...');
runShell(processValue);