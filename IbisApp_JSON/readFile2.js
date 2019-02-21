var fs = require('fs');

function handleFile(err, data) {
    if (err) throw err
    binInfo = JSON.parse(data);
}

var obj = JSON.parse(fs.readFileSync('singleBinLimits.json','utf8'));

console.log(obj);

console.log(obj.DeviceID);