
const bignumber = require('bignumber.js');
const wei = new bignumber('1000000000000000000');

let getEtherValue = (weiValue) => { return weiValue/wei; }

export default getEtherValue
