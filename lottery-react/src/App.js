import "./App.css";
import web3 from "./web3";
import React from "react";
import Lottery from "./Lottery";
function App() {

  const [manager, setManager] = React.useState();
  const [numberofPlayers,setNumberOfPlayers] = React.useState();
  const [balance,setBalance]=React.useState();
  const [ether, setEther] = React.useState();
  const [message,setMessage] = React.useState("");
  const [message2,setMessage2] = React.useState("");



  async function getManager() {
    const tempManager = await Lottery.methods.manager().call();
    await setManager(tempManager);
    console.log('hello',tempManager);
  }
  async function getAllPlayers(){
    const tempPlayers = await Lottery.methods.getAllPlayers().call();
    await setNumberOfPlayers(tempPlayers.length);
  }
  async function getBalacne(){
    const tempBalance = await web3.eth.getBalance(Lottery.options.address);
    await setBalance(tempBalance);
    console.log('balance is', tempBalance);
  }

  React.useEffect(() => {
    getManager();
    getAllPlayers();
    getBalacne()
   
  }, []);


  async function handleChange(e){
    await setEther(e.target.value);
    console.log(ether);
  }
  async function handelClick(event){
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await setMessage('Please wait while we enter you into contract')
    console.log('sending', ether, 'ether');
    await Lottery.methods.enter().send({
      from : accounts[0],
      value : web3.utils.toWei(ether,'ether')
    }).then((result) => {
      console.log(result);
    }).catch((err) => {
       console.log('error',err);
    });

    setMessage('Congrats! You have enter the lottery')
    getAllPlayers();
    getBalacne();
  }
  async function handelClick2(event){
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await setMessage2('Please wait while we pick winner of lottery')
    const winner = await Lottery.methods.pickWinner().send({
      from:accounts[0]

    })
    await setMessage2(`Winner is selected`)
    console.log('winner is', winner);
    getBalacne();
    getAllPlayers();

  }


  return (
    <>
    <h2>Lottery Contract</h2>
      <p> Currently Managed by our Manager : {manager}</p>
      <p>At this moment there are total:  {numberofPlayers} players and total : {balance} ether</p>
      <hr />
      <h4>Wanna try your luck?</h4>
      <label>Amount of ether to enter</label>
      <input type="number" onChange={handleChange} />
      <button className="btn" onClick={handelClick} >Click to Enter</button>
      <p>{message}</p>
      <hr />
      <h4>Lets Pick Winner</h4>
      <button onClick={handelClick2}>Pick Winner</button>
      <p>{message2} </p>
    </>
  );
}

export default App;
