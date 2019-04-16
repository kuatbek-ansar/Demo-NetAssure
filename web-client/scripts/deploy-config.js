let fs = require('fs');

let sourceConfigFile = process.argv[2];
let destinationConfigFile = process.argv[3];

let config = require(sourceConfigFile);

// Application settings
config.Version = '#{Octopus.Action.Package.PackageVersion}';
config.AllowDiagnostics = '#{Client-AllowDiagnostics}';
config.EnableDiagnostics = '#{Client-EnableDiagnostics}';

fs.writeFile(destinationConfigFile, JSON.stringify(config), function (err) {
  if (err) {
    return console.log(`Error Writing File: ${err}`);
  }
});
