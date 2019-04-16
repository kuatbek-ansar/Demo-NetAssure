Affiniti Network Assure - Security Gateway
===

## [Official Repository - ana-main](https://bitbucket.org/affiniti/ana-main)

## Description

Affiniti Network Assure helps users monitor the status of their internal
networks by providing real time and historical data about each device in their
network

## Documentation

Inline code documentation is provided for each class using the `typedoc` format.

Code Documentation is available in [HTML format](http://localhost:8080) via

```bash
npm install -g typedoc http-server
typedoc --module commonjs --out /path/to/documentation/html/ src
cd /path/to/documentation/html/
http-server
```
## Installation

Install dependencies with `npm`

```bash
npm install
```

## Usage

Start the application with [Docker](docker). The docker image exposes the security gateway on port 5050 for forwarding to the host machine.

```bash
docker run -p 5050:5050
```

## Testing

Tests are written with [Mocha](https://mochajs.org/) and [Chai - Expect](http://chaijs.com/guide/styles/#expect)

Tests are separated by type based on the name/title of the test. 

Unit tests (tests that have no external dependency) are annotated with "`: Unit`" to the end of the test name
```js
describe('Complex Class: Unit', function() {
    //...important tests
});
```

Integration tests (tests that test while calling outside of this code base) are annotated with "`: Integration`" to the end of the test name
``` js
describe('Service Class: Integration', function() {
    //...tests that call an external service (ie Salesforce)
});
```
> You can also specify `Unit` or `Integration` on individual tests: `it('Should check a function: Unit, function() { /...`

You can run a selection of tests, or all of them at once.
* `npm test`
    * Runs all the `Unit` tests
* `npm run test-integrations`
    * Runs all the `Integration` tests
* `npm run test-all`
    * Runs _all_ tests `Unit` and `Integration` (as well as any that don't have either annotation)
* `npm run watch-tests`
    * Starts `nodemon` and runs all `Unit` tests while watching for changes


## Bug Reports

## Coding standards

This project's coding style follows the conventions outlined below. Please strive to follow these guidelines when contributing.


https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines

https://github.com/airbnb/javascript

https://github.com/toddmotto/angular-styleguide

https://scotch.io/tutorials/angularjs-best-practices-directory-structure

https://teropa.info/blog/2015/10/18/refactoring-angular-apps-to-components.html

https://gist.github.com/matttelliott/83edc2c24fa9c5dad35f52f355a3aeec

## Database Migrations and Entity Changes

If you change the signature of any of the `.entity.ts` files, you _must_ create a migration for it.

This is a file you must create (typeorm's migrate:gen is flaky)

* In the server directory, run 

```
$ typeorm migrations:create -n name-of-migration
```

* This will generate a file in the `server/migrations` called "[timestamp]-name-of-migration.ts". 

* Edit the file and rename the class to "NameOfMigration[timestamp]". Do not change any of the 13 digits in the timestamp.

The class defined in that file _must_ implement the TypeORM `MigrationInterface`


Use TypeORM's `QueryRunner` to write the SQL string to perform the update to the database as well as a rollback to undo the changes should we need to

Once you've created the migration class, jump to the terminal and run `npm run migrate:run` to execute the migrations in order, or if you do not need
to rebuild the entire project, use

```
$  ts-node ./node_modules/typeorm/cli.js migrations:run
```

TypeORM will check the `migrations` table and skip the migrations that have already executed, then call any new ones in order based on the timestamps
in the class names.

Some warnings:

* Make sure that your sql uses raw table names, not databasename.tableName, as some deployments may not name their database exactly the same as your own.

* Do your best to not destroy data! This will be run on a production database

* The `down` function must put everything back to the way it was before the migration ran

* Remember foreign keys if you're adding/dropping columns or tables!

* TEST! Verify the migration will run without error

    * To re-run a migration, delete the record from the `migrations` table and run `npm run migrate:run` again

    * Test the migration both ways. Use the following to test the 'down' script:

```
$  ts-node ./node_modules/typeorm/cli.js migrations:revert
```

