process.env.NODE_ENV = 'development';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({silent: true});
var shell = require("shelljs");

shell.exec("python $PROGS/React/Solidity/ReactSolid/scripts/testrpc.py");