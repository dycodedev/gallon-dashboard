
# Gallon Dashboard & REST API

* OAuth 2.0
* API Documentation
* Bootstrapping data

## Checklist

* [ ] OAuth 2.0 server
    * [ ] Authorization Code Grant
    * [ ] Implicit Grant
    * [✓] Resource Owner Password Credentials Grant
* [ ] User signup flow (signup, signup with provider, welcome email)
* [ ] Resource API
    * [✓] User
    * [✓] Device
    * [✓] Trigger's Actions
* [ ] Tests
* [ ] API Documentation

## REST Developer Documentation

* [OAuth 2.0 implementation](docs/oauth2.md)
* [REPL fully loaded](docs/repl.md)

## Running Server

Using nodemon / node
```sh
APPENV=dev.local nodemon app.js
```

Using pm2
```sh
APPENV=production pm2 start app.js --name gallon-dashboard
```

## Note on APPENV variable

`APPENV` environment variable is used to identify configuration file which is being used by the app. The possible values are `dev.local`, `local`, or `production`.
