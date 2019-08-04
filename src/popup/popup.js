import MessageManagerClass from '../common/class.messageManager.js';
import ActionsClass from '../common/class.actions.js';
const Actions = new ActionsClass();
//const MessageManager = new MessageManagerClass();

$(document).ready(function() {
    console.log( "ready!" );
    let ticker = document.getElementById("wallet-interface").value
    chrome.runtime.sendMessage({"action": (Actions.getBackground().changeProtocol),"data": ticker}); 

    $("#wallet-interface").on('input',async()=> {
        console.log('changeProtocol')
        let ticker = document.getElementById("wallet-interface").value
        chrome.runtime.sendMessage({"action": (Actions.getBackground().changeProtocol),"data": ticker});
    });

    $("#fileInput").on("change", async(e)=> {
        let password = document.getElementById('password').value;
        let fileInput = document.getElementById("fileInput");
        // dont correctly work
        let file = fileInput.files[0]
        console.log(typeof file, file)
        let result = await new Promise(async(resolve,reject)=>{
                var reader = new FileReader();
                reader.onload = async(e)=>{
                    var content = reader.result;
                    return resolve(content);
                }
                reader.onerror = (e) => {
                    return reject(e);
                }
                reader.readAsText(file);  
        })
        console.log(result)
        let privatKey = await new Promise((resolve, reject) => {
			chrome.runtime.sendMessage({"action": (Actions.getBackground().getPrivatKey), "data": result}, response => {
  				resolve(response)
			});					
        })
        console.log(privatKey);
        chrome.storage.local.set({'privatKey': privatKey}, function() {
            console.log('PrivatKey saved');
        });
        // let data = {"password": password, "mnemonic": mnemonic}
		// let ciphertext = await new Promise((resolve, reject) => {
		// 	chrome.runtime.sendMessage({"action": (Actions.getBackground().getCiphertext), "data": data}, response => {
  		// 		resolve(response)
		// 	});					
		// })
		// chrome.storage.local.set({'ciphertext': ciphertext}, function() {
      	// 	console.log('Ciphertext saved');
    	// });
    });

    $("#generate-mnemonic").on("click", async ()=> {
    	let password = document.getElementById('password').value;
		let mnemonic = await new Promise((resolve, reject) => {
			chrome.runtime.sendMessage({"action": (Actions.getBackground().generationMnemonic)}, response => {
  				resolve(response)
			});			
		})
		$('#mnemonic').html(mnemonic);
		let data = {"password": password, "mnemonic": mnemonic}
		let ciphertext = await new Promise((resolve, reject) => {
			chrome.runtime.sendMessage({"action": (Actions.getBackground().getCiphertext), "data": data}, response => {
  				resolve(response)
			});					
		})
		chrome.storage.local.set({'ciphertext': ciphertext}, function() {
      		console.log('Ciphertext saved');
    	});
    });

    $("#open-wallet").on("click", async ()=> {
        let password = document.getElementById('password').value;
        if(!password){
            alert('Enter your password')
        }else{
        	// ciphertext is object {}
            let ciphertext = await new Promise((resolve,reject) => {
    			chrome.storage.local.get(['ciphertext'], response => {
    				resolve(response)
    			});            	
            }) 
			let data = {"password": password, "ciphertext": ciphertext.ciphertext}
			let mnemonic = await new Promise((resolve, reject) => {
				chrome.runtime.sendMessage({"action": (Actions.getBackground().getMnemonic), "data": data}, response => {
  					resolve(response)
				});					
			})
            if(!mnemonic){
            	alert('Wrong password')
            }else{
            	chrome.storage.local.set({'mnemonic': mnemonic}, function() {
      				console.log('Mnemonic saved');
    			});
                $('#open-wallet-done').html('Wallet is open');
            }
        }
    });

    $("#showaddress").click(async()=> {
        let ticker = document.getElementById("wallet-interface").value;
        ticker = ticker.toUpperCase();
        console.log('Generate Address: ', ticker)
        let data = {"ticker": ticker}
        let result = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({"action": (Actions.getBackground().getAddress), "data": data}, response => {
                    resolve(response)
                });                 
        })
        console.log(result)
        $('#address').html(result);
    });

    $("#get-balance").click(async()=> {
        let result = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({"action": (Actions.getBackground().getBalance)}, response => {
                    resolve(response)
            });                 
        })
        console.log("Balance: ",result)
        $('#balance').html(result);       
    });

    $("#send").click(async ()=> {
        let to = document.getElementById('receiver').value;
        let value = document.getElementById('value').value;
        let gasPrice = document.getElementById('gasprise').value;
        let data = {"to": to, "value": value, "gasPrice": gasPrice};
        let result = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({"action": (Actions.getBackground().sendTransaction), "data": data}, response => {
                    resolve(response)
                });                 
        })
        console.log(result)
        $('#txhash').html(result);
    });

});