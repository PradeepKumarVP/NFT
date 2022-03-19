
App = {
  loading: false,
  contracts: {},  
  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);
    
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const CrowdFunding = await $.getJSON('CrowdFunding.json')
    App.contracts.CrowdFunding = TruffleContract(CrowdFunding)
    App.contracts.CrowdFunding.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.crowd = await App.contracts.CrowdFunding.deployed()
  },
  render: async () => {
    
  }  ,
  showDonatePage:async () =>{
    $("#donatepage").show();
    $("#balancepage").hide();
    // $("#transferfrompage").hide();
    // $("#balancepage").hide();
  },
  showDistributePage:async () =>{
    $("#donatepage").hide();
    $("#balancepage").hide();
    await App.crowd.releaseFund({from:App.account});
    // $("#balancepage").hide();
    // $("#balancepage").hide();
  },
  
  showRegisterPage:async () =>{
    $("#donatepage").hide();
    $("#balancepage").hide();
    await App.crowd.register({from:App.account});
  },
  showbalancePage:async () =>{
    $("#donatepage").hide();
    $("#balancepage").show();
    var bal=await App.crowd.balanceamount();
    bal=bal/1000000000000000000;
    $("#dispbal").html(bal.toString());
    // $("#transferfrompage").hide();
    // $("#balancepage").show();
  } ,
  donateAmount:async () =>{   
    var amt=$("#transferamount").val();  
    amt=parseInt(amt)*1000000000000000000;
    await App.crowd.donateAmount({from: App.account,value:amt.toString()});
  },

  fetchBalance:async () =>{
    var toadr=$("#balanceaddress").val();
    var bal=await App.token.balanceOf(toadr);
    $("#dispbalnce").html(bal.toString())    
  }
 
}

$(document).ready(async function(){
   await App.load();
});


