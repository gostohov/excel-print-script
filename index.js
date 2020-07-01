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
    const [mark] = Object.values(obj);
    const escapedMark = escapeString(`${mark}`);
    const slicedMark = escapeString(mark.slice(2, 16));
    const insertQuery = `INSERT INTO LINTR (LINTR_ID, PARENT_ID, STATUS, UIT, UITU, MAKING_TYPE, PROD_DATE, CERT_TYPE, CERT_DOC_NUM, CERT_DOC_DATE, CUSTOMS_COST, COST_C, TAX_C, TNVED10, GTIN, EXT_ART, MARK_ID, USERCRE, DATCRE, USERMOD, DATMOD, ERRCODE, ERRCOMM
    ) VALUES (
      next value for LINTR_SEQ, 
      1, 
      10, 
      ${escapedMark}, 
      NULL, 
      NULL, 
      GETDATE(), 
      NULL,
      NULL, 
      GETDATE(), 
      0, 
      0, 
      0, 
      NULL, 
      '${slicedMark}', 
      NULL, 
      ( SELECT mark_id FROM rmark WHERE uit = ${escapeString(mark.slice(0, 31))} ), 
      'ann', 
      GETDATE(), 
      'ann', 
      GETDATE(),
      NULL, 
      NULL
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