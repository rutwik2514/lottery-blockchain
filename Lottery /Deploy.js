const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3=require('web3');
const {interface,bytecode}=require('./compile');

const provider=new HDWalletProvider(
    'term water borrow cruise shield predict craft mixture physical member walk asthma',
    'https://sepolia.infura.io/v3/f4a43a2ace0a4c2085a527adafb1eb08'

);
const web3 = new Web3(provider);

const deploy = async ()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('deploying from account', accounts[0]);
    const lotteryContract  = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({gas:'1000000', from : accounts[0]})
    .then(console.log('contract deployed'))
    .catch(err=>{console.log(err)});

    console.log(interface);
    console.log('contract deployed successfully');
    console.log('to', lotteryContract.options.address);
    //write below line to prevent a hanging deployment
    provider.engine.stop();

}
deploy();