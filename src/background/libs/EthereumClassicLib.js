let Web3 = require('web3');
let EthereumTx  = require('ethereumjs-tx');
const NonceService = require('../core/services/NonceService');
const WeiConverter = require('../core/helpers/WeiConverter');

class EthereumClassicLibClass{
    constructor(wallet){
        console.log('Etereum Classic Active');
        this.generateAddAndPriv = wallet.generateAddressAndPrivkey;
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://188.165.217.104:5000'));

        this.logger = wallet.logger;
        this.validator = wallet.validator;
        this.nonceService = new NonceService(this.web3,this.validator,this.logger);
        this.httpService = wallet.httpService;
        this.network = wallet.networks.ETCNETWORKS
    }
    getBalance(raw=true){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.generateAddAndPriv.generateAddress("ETC");
                let balance = await this.web3.eth.getBalance(address);
                if(!raw){
                    balance = this.toDecimals(balance);
                }
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        });
    }

    // getBalance(raw=true){
    //     return new Promise(async(resolve,reject)=>{
    //         try{
    //             let address = await this.generateAddAndPriv.generateAddress("ETC");
    //             this.validator.validateBtcAddress(address)
    //             let url =  `https://ethereumclassic.network/`
    //             let body = JSON.stringify({"jsonrpc":"2.0", "method":"eth_getBalance", "params": [address], "id":1 });               	
    //            	let result = await this.httpService.postRequest(url, body).then(response=>response.json())
    //             this.validator.validateObject(result);
    //             let balanceHex = parseInt(result.result);
    //             let balance = this.toDecimals(parseInt(balanceHex));
    //             console.log(balance)
    //             return resolve(balance);
    //         }catch (e) {
    //             return reject(e);
    //         }         
    //     });
    // }

    sendTransaction(to,value,gasPrice){
        return new Promise(async(resolve,reject)=>{
            try{
            	// let rawTx = await this.createSignRawTx(to,amount,fee);
             //    let url = `https://chain.so/api/v2/send_tx/LTC`
             //    let body = JSON.stringify({"tx_hex": rawTx});
             //   	let result = await this.httpService.postRequest(url, body).then(response=>response.json())
             //   	console.log('Транзакция отправлена')
             //    return resolve(result.data.txid);

                let userAddress = await this.generateAddAndPriv.generateAddress("ETC");
                let userPrivateKey = await this.generateAddAndPriv.generatePrivKey("ETC");
                // if(userAddress===to){
                //     throw new Error('To and From Addresses are the same');
                // }
                var data = this.formatTransactionParams(userAddress,to,userPrivateKey,value,gasPrice);
                return resolve(await this.makeTransaction(data));
            }catch (e) {
                return reject(e)
            }
        })
    }

    formatTransactionParams(_from,_to,_privkey,_value='0',_gasPrice='10',_gasLimit=100000,_data=''){
        this.validator.validateEthAddress(_from,'_From Address');
        this.validator.validateEthAddress(_to,'_To Address');
        this.validator.validateString(_privkey,'Private Key',true);
        try{
            this.validator.validateString(_value,'Value');            
        }catch(e){
            _value = _value.toString();
            this.validator.validateString(_value,'Value');
        }
        try{
            this.validator.validateString(_gasLimit,'Gas Limit');            
        }catch(e){
            _gasLimit = _gasLimit.toString();
            this.validator.validateString(_gasLimit,'Gas Limit');            
        }
        try{
            this.validator.validateString(_gasPrice,'Gas Price');
        }catch(e){
            _gasPrice = _gasPrice.toString();
            this.validator.validateString(_gasPrice,'Gas Price');
        }
        return {
            from:_from,
            to:_to,
            privateKey:_privkey,
            gasLimit:parseInt(_gasLimit),
            gasPrice:this.web3.utils.numberToHex(this.web3.utils.toWei(_gasPrice, 'gwei')),
            data:_data,
            value:this.web3.utils.numberToHex(this.web3.utils.toWei(_value))
        }
    }

    makeTransaction(params){
        return new Promise(async (resolve,reject)=>
        {
            try{
                let privKeyBuffer = new Buffer.from(params.privateKey,'hex');
                let nonce = await this.nonceService.getNextNonce(params.from);
                let txParams = {
                    nonce: nonce,
                    gasPrice: params.gasPrice,
                    gasLimit: params.gasLimit,
                    to: params.to,
                    value: params.value,
                    data: params.data,
                };
                let tx = new EthereumTx(txParams);
                tx.sign(privKeyBuffer);
                let raw = '0x' + tx.serialize().toString('hex');
                let result = await this.sendTransactionWithHash(raw);
                return resolve(result);
            }catch(e){
                return reject(e);
            }
        });
    }

    sendTransactionWithHash(raw_tx){
        return new Promise(async (resolve,reject)=>{
            await this.web3.eth.sendSignedTransaction(raw_tx).on('transactionHash', (hash)=>{
                return resolve(hash);
            }).on('error',(data)=>{
                return reject(data);
            });
        })
    }

  // 	createSignRawTx(to, amount,fee){
  //   	return new Promise(async(resolve,reject)=>{
	 //  		if(!fee){
	 //  			fee=0.0001;
	 //  		}
  //           amount = parseFloat(amount);
  //           fee = parseFloat(fee);
  //           this.validator.validateBtcAddress(to);
  //           this.validator.validateNumber(amount);
  //           this.validator.validateNumber(fee);

  //           amount = this.fromDecimals(amount);
  //           fee = this.fromDecimals(fee);
  //           amount = Math.round(amount)
  //           fee = Math.round(fee)

  //   		let privKey = await this.generateAddAndPriv.generatePrivKey("LTC");
  //   		let keyring = await bitcoin.ECPair.fromWIF(privKey,this.network);
		// 	let txb = new bitcoin.TransactionBuilder(this.network)
		// 	let from = await this.generateAddAndPriv.generateAddress("LTC");
  //           this.validator.validateBtcAddress(from);
		// 	let utxoData = await this.getUtxos(from, amount, fee);
  //   		let utxos = utxoData.outputs;
  //   		let change = utxoData.change;
  //   		for(let key in utxos){
  //       		txb.addInput(utxos[key].txid, utxos[key].vout)
  //   		}
  //           txb.addOutput(to, amount);
  //           txb.addOutput(from, change);
  //   		let i = 0;
  //   		for(let key in utxos){
  //   		    txb.sign(i, keyring)
  //   		    i++;
  //   		}
		// 	let txHash = txb.build().toHex()
  //           this.validator.validateString(txHash);
		// 	return resolve(txHash)
		// })
  //   }

  //   getUtxos(address,amount,fee){
  //       return new Promise(async(resolve,reject)=>{
  //           try{
	 //            this.validator.validateBtcAddress(address);
	 //            this.validator.validateNumber(amount);
	 //            this.validator.validateNumber(fee);

  //               let balance = await this.getBalance();
  //               balance = parseFloat(balance);
  //              	balance = this.fromDecimals(balance);
  //              	amount = parseFloat(amount);
  //              	amount = Math.round(amount)
  //              	fee = parseFloat(fee);

  //               if(balance >= amount+fee){
  //               	let allUtxo = await this.listUnspent(address);
  //               	let tmpSum = 0;
  //               	let requiredUtxo = [];
  //               	for(let key in allUtxo){
  //                   	if(tmpSum<=amount+fee){
  //                   		tmpSum+=parseFloat(allUtxo[key].value);
  //                   		requiredUtxo.push({
  //                   	    	txid:allUtxo[key].txid,
  //                   	    	vout:allUtxo[key].output_no
  //                   		})
  //                   	}else{
  //                   		break;
	 //                    }
	 //                }
  //              		tmpSum = this.fromDecimals(tmpSum);
  //              		tmpSum = Math.round(tmpSum)

	 //                let change = tmpSum - amount - fee;
	 //                this.validator.validateNumber(change);
	 //                return resolve({
	 //                	"change":change,
	 //                    "outputs":requiredUtxo
	 //                });
	 //            }else{
	 //            	throw new Error("Insufficient balance: trying to send "+amount+"+"+fee+" when having "+balance)
	 //            }
  //           }catch(e){
  //               return reject(e);
  //           }
  //       });
  //   }

  //   listUnspent(address){
  //       return new Promise(async(resolve,reject)=>{
  //           try{
  //  	            this.validator.validateBtcAddress(address);
  //  	            let url = `https://chain.so/api/v2/get_tx_unspent/LTC/${address}`
  //               let data = await this.httpService.getRequest(url).then(response=>response.json())
  //               let unspents = data.data.txs;
  //               return resolve(unspents);
  //           }catch(e){
  //               return reject(e);
  //           }
  //       })
  //   }

    toDecimals(amount){
        return WeiConverter.formatToDecimals(amount,18);
    }
    fromDecimals(amount){
        return WeiConverter.formatFromDecimals(amount,18);
    }    
}
module.exports = EthereumClassicLibClass;