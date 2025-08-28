<p align="center">
  <img width=25% src="https://raw.githubusercontent.com/WolferyScripting/WolferyJS/b4f029eec7424d043df15b4d5b8ff02979e924f7/static/icon-transparent.png">
  <p align="center">A comprehensive API wrapper for https://wolfery.com.</p>
</p>
<p align="center">
  <a href="https://npmjs.com/package/wolfery.js"><img src="https://img.shields.io/npm/v/wolfery.js.svg?style=flat-square&color=informational"></a>
  <img src="https://img.shields.io/github/stars/WolferyScripting/WolferyJS?color=yellow&style=flat-square">
  <img src="https://img.shields.io/npm/dw/wolfery.js?color=red&style=flat-square">
  <a href="https://coveralls.io/github/WolferyScripting/WolferyJS"><img src="https://coveralls.io/repos/github/WolferyScripting/WolferyJS/badge.svg" alt="Coverage Status" /></a>
</p>


If you need help getting things to work or want to report an issue, we have a [post on the wolfery forum](https://forum.wolfery.com/t/3271). You can also create an issue here.

# Sections
[Installation](#installation) | [Documentation](#documentation) | [Node Version](#node-version) | [Basic Usage](#basic-usage) | [Contributing](#contributing)

## Installation

```
npm i wolfery.js
```

## Documentation
All documentation can be found [here](https://wolferyjs.furry.cool), simply click on the version.

## Node Version

We use the LTS Node 20 version `20.19.4`, but you can almost certainly get away with 18.x or lower. If you run into any issues, you should try using a newer node version.

## Basic Usage
[Password](#login-with-password) | [Bot Token](#login-with-bot-token) | [Management Token](#login-with-management-token)

### Login With Password
```js
const WolferyJS = require("wolfery.js");
const client = new WolferyJS({
    authentication: {
        type:     "password",
        username: "<username>",
        password: "<password>"
    }
});
// user = https://wolferyjs.furry.cool/latest/classes/User.html
// player = https://wolferyjs.furry.cool/latest/classes/Player.html
client.on("connected", async (user, player) => {
    console.log(`Logged in as @${user.identity.name} (${user.id})`);
    const ctrl = await player.chars.first().wakeup();
    await ctrl.say("I said this through the WolferyJS wrapper.");
    await ctrl.sleep();
});
client.connect();
```

### Login With Bot Token
```js
const WolferyJS = require("wolfery.js");
const client = new WolferyJS({
    authentication: {
        type:  "bot",
        token: "<token>"
    }
});
// user = https://wolferyjs.furry.cool/latest/classes/BotUser.html
// no player
client.on("connected", async (user) => {
    console.log(`Logged in as bot ${user.char.fullname} (${user.char.id})`);
    const ctrl = await user.wakeup();
    await ctrl.say("I said this through the WolferyJS wrapper.");
    await ctrl.sleep();
});
client.connect();
```

### Login With Management Token
```js
const WolferyJS = require("wolfery.js");
const client = new WolferyJS({
    authentication: {
        type:  "token",
        token: "<token>"
    }
});
// user = https://wolferyjs.furry.cool/latest/classes/TokenUser.html
// no player
client.on("connected", async (user) => {
    console.log(`Logged in as bot ${user.char.fullname} (${user.char.id})`);
    const ctrl = await user.wakeup();
    await ctrl.say("I said this through the WolferyJS wrapper.");
    await ctrl.sleep();
});
client.connect();
```

## Contributing
Contributions are welcome and appreciated.<br>
The comments, definitions, exports, types, resource ids, and properties of collections and models are generated from the [collections.json](https://github.com/WolferyScripting/WolferyJS/blob/dev/schema/collections.json) and [models.json](https://github.com/WolferyScripting/WolferyJS/blob/dev/schema/models.json) files in the [schema](https://github.com/WolferyScripting/WolferyJS/tree/dev/schema) folder.<br>
An overview of how these are structured can be found in the [schema.ts](https://github.com/WolferyScripting/WolferyJS/blob/dev/schema/schema.ts) file as typebox json schema definitions.<br>
To regenerate the collections & models, simply run `pnpm build:schema`. Subcommands exist to run only rebuild specifics.

Do not directly edit anything in the [generated](https://github.com/WolferyScripting/WolferyJS/tree/dev/generated) folder, or the comments on collections or models. The first line and any line containing `@resourceID` will be overwritten when the schema is built.
