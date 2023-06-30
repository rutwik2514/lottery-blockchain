const path = require('path');
const fs = require('fs');
const solc = require('solc');


const lotteryPath=path.resolve(__dirname,'Contracts','Lottery.sol');
const source = fs.readFileSync(lotteryPath,'utf8');

// console.log(solc.compile(source,1));

const compiledContract = solc.compile(source,1);

module.exports=compiledContract.contracts[':Lottery'];