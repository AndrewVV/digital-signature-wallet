const WeiConverter = require('../core/helpers/WeiConverter');
const bitcoin = require('bitcoinjs-lib');
const network = bitcoin.networks.testnet
const DASHDECIMALS = 8;
class DashTestLibClass{
    constructor(wallet){
        console.log('Dash Testnet Active');
        this.generateAddAndPriv = wallet.generateAddressAndPrivkey;
        this.validator = wallet.validator;
        this.httpService = wallet.httpService;
    }

    getBalance(raw=true){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.generateAddAndPriv.generateAddress("DASHTEST");
                this.validator.validateBtcAddress(address)
                let url = `https://chain.so/api/v2/get_address_balance/DASHTEST/${address}`
                let result = await this.httpService.getRequest(url).then(response=>response.json());
                this.validator.validateObject(result);
                let balance = result.data.confirmed_balance;
                this.validator.validateNumber(balance);
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        });
    }

    sendTransaction(to,amount,fee){
        return new Promise(async(resolve,reject)=>{
            try{
            	let rawTx = await this.createSignRawTx(to,amount,fee);
                let url = `https://chain.so/api/v2/send_tx/DASHTEST`
                let body = JSON.stringify({"tx_hex": rawTx});
               	let result = await this.httpService.postRequest(url, body).then(response=>response.json())
               	console.log('Транзакция отправлена')
                return resolve(result.data.txid);
            }catch (e) {
                return reject(e)
            }
        })
    }

  	createSignRawTx(to, amount,fee){
    	return new Promise(async(resolve,reject)=>{
	  		if(!fee){
	  			fee=0.0001;
	  		}
            amount = parseFloat(amount);
            fee = parseFloat(fee);
            this.validator.validateBtcAddress(to);
            this.validator.validateNumber(amount);
            this.validator.validateNumber(fee);

            amount = this.fromDecimals(amount);
            fee = this.fromDecimals(fee);
            amount = Math.round(amount)
            fee = Math.round(fee)

    		let privKey = await this.generateAddAndPriv.generatePrivKey("DASHTEST");
            this.validator.validateString(privKey);
    		let keyring = await bitcoin.ECPair.fromWIF(privKey,network);
			let txb = new bitcoin.TransactionBuilder(network)
			let from = await this.generateAddAndPriv.generateAddress("DASHTEST");
            this.validator.validateBtcAddress(from);
			let utxoData = await this.getUtxos(from, amount, fee);
    		let utxos = utxoData.outputs;
    		let change = utxoData.change;
    		for(let key in utxos){
        		txb.addInput(utxos[key].txid, utxos[key].vout)
    		}
            txb.addOutput(to, amount);
            txb.addOutput(from, change);
    		let i = 0;
    		for(let key in utxos){
    		    txb.sign(i, keyring)
    		    i++;
    		}
			let txHash = txb.build().toHex()
            this.validator.validateString(txHash);
			return resolve(txHash)
		})
    }

    getUtxos(address,amount,fee){
        return new Promise(async(resolve,reject)=>{
            try{
	            this.validator.validateBtcAddress(address);
	            this.validator.validateNumber(amount);
	            this.validator.validateNumber(fee);

                let balance = await this.getBalance();
                balance = parseFloat(balance);
               	balance = this.fromDecimals(balance);
               	amount = parseFloat(amount);
               	amount = Math.round(amount)
               	fee = parseFloat(fee);

                if(balance >= amount+fee){
                	let allUtxo = await this.listUnspent(address);
                	let tmpSum = 0;
                	let requiredUtxo = [];
                	for(let key in allUtxo){
                    	if(tmpSum<=amount+fee){
                    		tmpSum+=parseFloat(allUtxo[key].value);
                    		requiredUtxo.push({
                    	    	txid:allUtxo[key].txid,
                    	    	vout:allUtxo[key].output_no
                    		})
                    	}else{
                    		break;
	                    }
	                }
               		tmpSum = this.fromDecimals(tmpSum);
               		tmpSum = Math.round(tmpSum)

	                let change = tmpSum - amount - fee;
	                this.validator.validateNumber(change);
	                return resolve({
	                	"change":change,
	                    "outputs":requiredUtxo
	                });
	            }else{
	            	throw new Error("Insufficient balance: trying to send "+amount+"+"+fee+" when having "+balance)
	            }
            }catch(e){
                return reject(e);
            }
        });
    }

    listUnspent(address){
        return new Promise(async(resolve,reject)=>{
            try{
   	            this.validator.validateBtcAddress(address);
   	            let url = `https://chain.so/api/v2/get_tx_unspent/DASHTEST/${address}`
                let data = await this.httpService.getRequest(url).then(response=>response.json())
                let unspents = data.data.txs;
                return resolve(unspents);
            }catch(e){
                return reject(e);
            }
        })
    }

    toDecimals(amount){
        return WeiConverter.formatToDecimals(amount,DASHDECIMALS);
    }
    fromDecimals(amount){
        return WeiConverter.formatFromDecimals(amount,DASHDECIMALS);
    }    
}
module.exports = DashTestLibClass;