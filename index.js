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

  console.log('Start unique gtin search...');
  const uniqueGtinList = [...new Set(res.map((item, i) => {
    const [mark] = Object.values(item);
    return mark.slice(2, 16);
  }))];
  console.log(`End unique gtin search. Found ${uniqueGtinList.length} unique gtin.`);

  const countBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  console.log('Start counting gtin quantity...');
  countBar.start(uniqueGtinList.length, 0);
  const resList = uniqueGtinList.map((gtin, i) => {
    countBar.update(i);
    return {
      gtin,
      count:  res.filter(item => {
                const [mark] = Object.values(item);
                return mark.includes(gtin);
              }).length
    }
  })
  countBar.stop();

  console.log('Start creating insert query list...');
  const insertQueryList = resList.map(({gtin, count}) => {
    return `INSERT INTO RSTOCK (
      STOCKID, 
      GTIN, 
      ENTITYID, 
      QTY_EMIT, 
      QTY_INTR, 
      QTY_SHIP, 
      USERCRE, 
      DATCRE, 
      USERMOD, 
      DATMOD
    ) VALUES (
      next value for RSTOCK_SEQ, 
      '${escapeString(gtin)}', 
      241, 
      0, 
      ${count},
      0, 
      'ann', 
      GETDATE(), 
      NULL, 
      NULL
    );
    GO\n`
  });

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  fs.writeFile(config.output, '', () => {
    console.log('Start printing...');
    bar.start(insertQueryList.length, 0);
    print(insertQueryList, 0, bar);
  })
})

console.log('Reading files...');
runShell(processValue);