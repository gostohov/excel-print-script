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
  if (index === list.length) {
    bar.stop();
    console.log('Merging finished')
    return;
  }

  fs.appendFile(config.output, list[index], () => print(list, index + 1, bar));
}

const escapeString = (value) => {
  if (typeof value === 'string') {
    const isnum = /^\d+$/g.test(value);
    if (!isnum) {
      value = value.replace(/'/g, "''")
      value = `'${value}'`
    }
  }

  return value;
}

const processValue = ((err, res) => {
  if (err) throw err;
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  const insertQueryList = [];
  res.forEach((obj,i) => {
    const { pathIndex } = obj;
    delete obj.pathIndex;
    const [articul, name, tnved10, extart, gtin, brand, inn] = Object.values(obj).map(v => escapeString(v));
    const insertQuery = `insert into IN_CITEM (
      IN_ITEMID,
      STATUS,
      GTIN,
      EXTART,
      NAME, 
      USERCRE, 
      DATCRE, 
      TNVED10, 
      articul,
      brand,
      inn
    ) values (
      next value FOR IN_CITEM_SEQ, 
      0, 
      ${gtin}, 
      ${extart}, 
      ${name},
      'Ann', 
      GETDATE(), 
      '${tnved10}', 
      '${articul}', 
      'Faberlic',
      5001026970
    );
    GO\n`;
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