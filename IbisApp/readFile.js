var fs = require('fs'), binInfo;

function handleFile(err, data) {
    if (err) throw err
    binInfo = JSON.parse(data);
}

fs.readFile('singleBinLimits.JSON','utf8', handleFile);


console.log("blablabla" + binInfo.BinDepth);