/* eslint-disable @typescript-eslint/no-var-requires */
var register = require("@babel/register").default;
var extensions = require("../../../lib/extensions");
register({ extensions: extensions });
