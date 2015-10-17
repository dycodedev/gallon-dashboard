
# OAuth 2.0

[Read here](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2) for some explanation of what it is.

[The OAuth 2.0 standard](https://tools.ietf.org/html/rfc6749)

## Why

Because its cool and everybody using it. 

## Purpose

OAuth specifies a process for resource owners to authorize third-party access to their server resources without sharing their credentials. Example: Facebook allow us (app developer) to access Facebook user's data or act on behalf that user without the user let us know their password. 

# Implementation

There are 3 main flows and we completed one flow here. Refer to standard above to know what is each.

* [ ] Authorization Code Grant
* [ ] Implicit Grant
* [✓] Resource Owner Password Credentials Grant

### Resource Owner Password Credentials Grant Flow

##### 1. Create user

```
$ node tools/bootstrap/add-user john "John Wick" john@dycode.com test1234 user
```

##### 2. Create app

```
$ node tools/bootstrap/add-oauthclient "Mobile App" john
```

Note: Only trusted user can have an oauth client. ideally they are registered as developer and maybe verified with handphone (make sure its not a bot).

##### 3. Get access token

Replace basic auth params with your own OAuth client app.

```
curl -v -X POST http://localhost:9000/oauth/token -u uZ8D4fbMzI4N3sDKEkAbS0r2JtF2gTDP:qH0TjEO4wNSU67ruChsSbsPENLOhctnF -d 'username=john&password=test1234&grant_type=password'
```

All params `username`, `password` and `grant_type` is required. `grant_type` value must be `password` (depend on the flow type)

Result
```
{"access_token":"AAIzv4rS9m8L9jnMUGfH0QIdWmVrIDU5BEX57Tqi8SWMP4LIAlg9sf4BhfxC7LfgdIjKukFBt28vAwXrpu20DIT3SmMTHCVZoHZyKVO3tRQrmZBmn9czhniwPhQUqDjb","refresh_token":"nBvGHTesy7VNBVISZrPQlnHpOQxqKfMAoKounQM5V2ys5I5kZJbDnmeFLORBZv4xgaI8NNUN5ii1OP4LBVHWn3KRUDLY49ieHyj3fahxwFpnz2A9LvxdlOVwyQdmnxve","expires_in":"2016-04-17T12:51:49.697Z","token_type":"Bearer"}
```

Note: 

* If app request token by request to this endpoint, previous access_token and refresh_token will be replaced. Server only stored hashed token, not actual one.
* By default token length is 128 and is valid for 6 months.

##### 4. Access resource

Use header `Authorization: Bearer ACCESS_TOKEN`

```
curl -v -H "Authorization: Bearer AAIzv4rS9m8L9jnMUGfH0QIdWmVrIDU5BEX57Tqi8SWMP4LIAlg9sf4BhfxC7LfgdIjKukFBt28vAwXrpu20DIT3SmMTHCVZoHZyKVO3tRQrmZBmn9czhniwPhQUqDjb" http://localhost:9000/api
```

or use query param `access_token=ACCESS_TOKEN`

```
curl -v http://localhost:9000/api?access_token=AAIzv4rS9m8L9jnMUGfH0QIdWmVrIDU5BEX57Tqi8SWMP4LIAlg9sf4BhfxC7LfgdIjKukFBt28vAwXrpu20DIT3SmMTHCVZoHZyKVO3tRQrmZBmn9czhniwPhQUqDjb
```

##### 5. Refresh token

When `access_token` expired, app can use `refresh_token` to generate new one.

```
curl -v -X POST http://localhost:9000/oauth/token -u uZ8D4fbMzI4N3sDKEkAbS0r2JtF2gTDP:qH0TjEO4wNSU67ruChsSbsPENLOhctnF -d 'refresh_token=nBvGHTesy7VNBVISZrPQlnHpOQxqKfMAoKounQM5V2ys5I5kZJbDnmeFLORBZv4xgaI8NNUN5ii1OP4LBVHWn3KRUDLY49ieHyj3fahxwFpnz2A9LvxdlOVwyQdmnxve&grant_type=refresh_token'
```

Result
```
{"access_token":"hIiHmzTm7obdCdEmBuBMX7rY8TWnB0EReDwCwEkyA7jDsfWHCmpYxehsCQfSpqTxeHcCtNHbPeFiWqGhHhCiPMsy0YPzbl4SbhryQEXBFHODMrtICWLURbDyVv1w2R1F","refresh_token":"nBvGHTesy7VNBVISZrPQlnHpOQxqKfMAoKounQM5V2ys5I5kZJbDnmeFLORBZv4xgaI8NNUN5ii1OP4LBVHWn3KRUDLY49ieHyj3fahxwFpnz2A9LvxdlOVwyQdmnxve","expires_in":"2016-04-17T13:24:04.877Z","token_type":"Bearer"}
```

Note that previous `access_token` will be replaced.
