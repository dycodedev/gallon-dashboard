
# Gallon Dashboard & REST API

* OAuth 2.0
* Freeboard
* Express 4
* Mongoose

## REST Developer Documentation

* [OAuth 2.0 implementation](docs/oauth2.md)
* [REPL fully loaded](docs/repl.md)

## Running Server

Using nodemon / node
```sh
APPENV=dev.local IOT_CONNECTIONSTR=AZURE_IOTHUB_OWNER_CONNECTIONSTRING nodemon app.js
```

Using pm2
```sh
APPENV=production pm2 start app.js --name gallon-dashboard
```

## Environment variables.

You can omit these variables by replacing their references inside the configuration file.

* `APPENV` environment variable is used to identify configuration file which is being used by the app. The possible values are `dev.local`, `local`, or `production`.

* `IOT_CONNECTIONSTR` is an IoT hub owner connection string. The value can be obtained from Azure Portal.

