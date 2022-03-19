pragma solidity ^0.5.16;
contract CrowdFunding {  
    uint public balanceamount=0; 
     address payable public registeredUser ; 
     address owner;
     constructor() public {
         owner=msg.sender;
     }
    function donateAmount() public payable {
            balanceamount=balanceamount+msg.value;
    }
    function register() public{
        registeredUser=msg.sender;
    }
    function releaseFund() public{
        require(msg.sender==owner);
        registeredUser.transfer(balanceamount);
        balanceamount=0;
    }    
}
