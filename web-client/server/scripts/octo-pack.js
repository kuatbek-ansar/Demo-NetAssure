let fs = require('fs');
let path = require('path');
let octo = require('@octopusdeploy/octopackjs');

let octopusUrl = process.argv[2];
let octopusApiKey = process.argv[3];
let id = process.argv[4];
let version = process.argv[5];

let package = octo.pack('targz', {
  id: id,
  version: version
});

// Add the configuration
package.append('config.json', path.resolve('./config/config.json'));

// Add all the files under the ./scripts directory
let dir = path.resolve('./scripts');
fs.readdirSync(dir).forEach(function (file) {
  package.append(file, dir + '/' + file);
});

// Add all the files under the ./artifacts/migrations directory
dir = path.resolve('./artifacts/migrations');
fs.readdirSync(dir).forEach(function (file) {
  package.append(`migrations/${file}`, dir + '/' + file);
});

// Write the package to ./artifacts
package.toFile(path.resolve('./artifacts'), function (err, data) {
  // Push the package to Octopus Deploy
  octo.push(`./artifacts/${data.name}`, {
    host: octopusUrl,
    apikey: octopusApiKey,
    replace: true
  }, function (err, result) {
    if (err) {
      console.log(err.body.ErrorMessage);
    }
  });
});
