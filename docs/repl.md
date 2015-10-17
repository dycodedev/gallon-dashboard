
# REPL Fully Loaded

To make it easy to work on model Mongoose style, we use customized REPL where we loaded all models there.

See implementation in [tools/repl.js](tools/repl.js)

Make sure to append `;0;` at the end of command or you will see load of Mongoose objects. 

Example

```
App> OAuthAccessToken.findOne({}).populate('client').populate('user').exec(function(err, token){ console.log(token)});0;
```

