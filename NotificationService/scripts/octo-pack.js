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

// Add the files under the ./scripts directory that are needed for deployment
package.append('deploy.sh', './scripts/deploy.sh');
package.append('deploy-prereqs.sh', './scripts/deploy-prereqs.sh');
package.append('variables.sh', './scripts/variables.sh');

// Add the serverless project configuration
package.append('serverless.yml', './serverless.yml');

// Add all the files under the ./.serverless directory
dir = path.resolve('./.serverless');
fs.readdirSync(dir).forEach(function (file) {
    package.append(file, dir + '/' + file);
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
      console.log(err);
    }
  });
});
