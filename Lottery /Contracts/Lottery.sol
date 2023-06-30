// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.17;


contract Lottery {
    address public manager;
    address[] public players;
    function Lottery() public {
        manager=msg.sender;

    }
    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }
    function random() private view returns (uint){
        uint tempnum=uint(keccak256(block.difficulty, now, players));
        return tempnum;
    }
    function pickWinner() public onlyManagerCanCall returns(uint) {
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        players=new address[](0);
        return index;

        
    }
    modifier onlyManagerCanCall(){
        require(msg.sender==manager);
        _;
    }
    function getAllPlayers() public view returns(address[]){
        return players;
    }
}
