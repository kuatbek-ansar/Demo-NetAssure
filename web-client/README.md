````# Network Assure

## Important Links

* Team City Server [http://199.167.241.16:8111/overview.html](http://199.167.241.16:8111)
* Dev Server [http://anadev1.affiniti.com/#/login](http://anadev1.affiniti.com)

## Documentation

* ORM - [Type ORM](http://typeorm.io/#/)
* [Zabbix](https://www.zabbix.com/documentation/3.0/manual/api) documentation for the Zabbix API

## Getting Started

> Note that the notation below is for bash;
if you're using a different console in Windows you may need to use backslashes instead to get tab-ahead support.

1. Install node modules in both the top and server level directories. It is highly recommended that you have a 5.x version of npm

            ```
            npm install --no-save
            cd server
            npm install --no-save
            cd ..
            ```

2. Install the following node modules globally

            ```
            npm install -g typescript
            npm install -g ts-node
            npm install -g @angular/cli
            npm install -g karma-cli
            ```

3. Start the database docker container

            Linux
            ```
            ./database/scripts/run-maria.sh
            ```

            Windows
            ```
            ./database/scripts/run-maria.ps1
            ```

4. Run the existing migrations to bring your database up to date

            ```
            cd server
            npm run migrate:run
            cd ..
            ```

5. Start the app components

            ```
            npm run all

            ```

Done!

## Development Server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code and Docs scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

Changes to the API will require regeneration of the swagger configuration file. You can do so with the following command:

    ```
    cd server
    ./node_modules/.bin/swaggerGen -c swagger.json
    cd ..
    ```
    
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## DB Migrations

To run the existing migrations the easiest way is to go into the server folder and run

`ts-node .\node_modules\typeorm\cli.js migrations:run`

This command can also be run via npm

`npm run migrate:run`

Much more detail available in the readme in the server folder. 

## Useful Developer Extensions

**Chrome**
  - Augury

**VS Code**
  - Editor Config
  - Angular Language Service
  - TSLint
  - vscode-icons
  - mysql (MySql management tool)
