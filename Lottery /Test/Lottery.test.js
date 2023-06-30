const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { interface, bytecode } = require("../compile");

//ganache used to connect to local network
const web3 = new Web3(ganache.provider());
let accounts;
let lottery;


beforeEach(async () => {
  console.log('coming');
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
  // console.log(lottery);
});



describe("lottery contract", () => {


  it("deploys contract", () => {
    assert.ok(lottery.options.address);
    // console.log("hi");
  });


  it("allows to enter lottery", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getAllPlayers().call({
      from: accounts[0],
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });


  it("allows multiple account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });
    const players = await lottery.methods.getAllPlayers().call({
      from: accounts[0],
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });


  it("sends minimum ether", async () => {
    let verify = true;
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei("0.002", "ether"),
      });
      //Method 1 : one method to verify is above 4 lines of code shall give some error in contract
      //and then it will go to catch and will check using assert if gives err or not
      //if it gives err means person is not allowed to enter and if above 4 lines of code
      //does not throw error, means it allowed person to enter, so we did assert(false) immediatly
      //so that test case fails

      //Method 2: use boolean equation and verify it at end, but it is not optimised method,
      //   above one is optimised method
      assert(false);
    } catch (err) {
      verify = false;
      assert(err);
    }
    const players = await lottery.methods.getAllPlayers().call({
      from: accounts[0],
    });
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
    assert.equal(false, verify);
  });


  it('only manager can pick winner', async()=>{
    try{
        await lottery.methods.pickWinner().call({
            from: accounts[1]
        })
        assert(false);

    }catch (err){
        assert(err)
    }
  })

  it('money gets transferred', async()=>{
    await lottery.methods.enter().send({
        from:accounts[1],
        value: web3.utils.toWei("2", "ether"),
    })
    const initialBalance = await web3.eth.getBalance(accounts[1]);
     await lottery.methods.pickWinner().send({
        from:accounts[0],
    })
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance-initialBalance;

    //we used 1.8 because on difference should be 2, but for requesting we will need gas
    //which will cost us so difference will be slightly less than 2
    assert(difference > web3.utils.toWei('1.8','ether'));
  })
});





