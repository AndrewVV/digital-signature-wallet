const WeiConverter = require('../core/helpers/WeiConverter');
const bitcoin = require('bitcoinjs-lib');
const BCHDECIMALS = 8;
class BitcoinCashLibClass{
    constructor(wallet){
        console.log('BitcoinCash Active');
        this.generateAddAndPriv = wallet.generateAddressAndPrivkey;
        this.validator = wallet.validator;
        this.httpService = wallet.httpService;
        this.network = wallet.networks.BCHNETWORK
    }

    getBalance(raw=true){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.generateAddAndPriv.generateAddress("BCH");
                this.validator.validateBtcAddress(address)
                let url = `https://rest.bitcoin.com/v2/address/details/${address}`
                let result = await this.httpService.getRequest(url).then(response=>response.json());
                this.validator.validateObject(result);
                let balance = result.balance;
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
                let url = `https://rest.bitcoin.com/v2/rawtransactions/sendRawTransaction/${rawTx}`
                let result = await this.httpService.getRequest(url).then(response=>response.json());
               	console.log('Транзакция отправлена')
                return resolve(result);
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
	  		to = await this.converterAddressToOld(to)
            amount = parseFloat(amount);
            fee = parseFloat(fee);
            this.validator.validateBtcAddress(to);
            this.validator.validateNumber(amount);
            this.validator.validateNumber(fee);

            amount = this.fromDecimals(amount);
            fee = this.fromDecimals(fee);
            amount = Math.round(amount)
            fee = Math.round(fee)

			let from = await this.generateAddAndPriv.generateAddress("BCH");
			from = await this.converterAddressToOld(from)
            this.validator.validateBtcAddress(from);

			let utxoData = await this.getUtxos(from, amount, fee);
    		let utxos = utxoData.outputs;
    		let change = utxoData.change;

			let tx = coinjs.transaction();
			let txouts = coinjs.Txouts();
			let scriptPubKey = await this.scriptPubKey(from)

    		for(let key in utxos){
        		tx.addinput(utxos[key].txid, utxos[key].vout, scriptPubKey)
        		console.log(utxos[key].txid, utxos[key].vout, scriptPubKey)
        		txouts.addtxout(scriptPubKey, utxos[key].satoshis);
        		console.log(scriptPubKey, utxos[key].satoshis)
    		}

			tx.addoutput2(to, amount);
			tx.addoutput2(from, change);

			let txRawHash = tx.serialize()
			let txOutsHash = txouts.serialize()

    		let privKey = await this.generateAddAndPriv.generatePrivKey("BCH");
            this.validator.validateString(privKey);
            console.log(privKey, txRawHash, txOutsHash)
			let signedTX = await this.signRawYx(privKey, txRawHash, txOutsHash)
			return resolve(signedTX)
		})
    }

    signRawYx(privKey, txRawHash, txOutsHash){
    	return new Promise(async(resolve,reject)=>{
    		let tx = coinjs.transaction();
    		let t = tx.deserialize(txRawHash);
            let txouts = coinjs.Txouts();
            txouts.deserialize(txOutsHash)
            let sighashType = '1'
            let signedTX = t.sign(privKey, sighashType, txouts.data);
    		return resolve(signedTX)
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
                    	if(tmpSum<amount+fee){
                    		tmpSum+=parseFloat(allUtxo[key].satoshis);
                    		requiredUtxo.push({
                    	    	txid:allUtxo[key].txid,
                    	    	vout:allUtxo[key].vout,
                    	    	satoshis:allUtxo[key].satoshis
                    		})
                    	}else{
                    		break;
	                    }
	                }

	                let change = tmpSum - amount - fee;
	                this.validator.validateNumber(change);
	                return resolve({
	                	"change":change,
	                    "outputs":requiredUtxo
	                });
	            }else{
	            	alert("Insufficient balance: trying to send "+amount+" + "+fee+" when having "+balance)
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
   	            // temp test vallet
   	            address = 'qpzdn8sc9lyhwy0w36p86h5dj5xhh09k9cz6wj9sq9'
   	            let url = `https://rest.bitcoin.com/v2/address/utxo/${address}`
                let data = await this.httpService.getRequest(url).then(response=>response.json())
                let unspents = data.utxos;
                console.log(unspents)
                return resolve(unspents);
            }catch(e){
                return reject(e);
            }
        })
    }

    scriptPubKey(address){
        return new Promise(async(resolve,reject)=>{
            try{
   	            this.validator.validateBtcAddress(address);
   	            // temp test vallet
   	            //address = 'qpzdn8sc9lyhwy0w36p86h5dj5xhh09k9cz6wj9sq9'
   	            let url = `https://rest.bitcoin.com/v2/address/utxo/${address}`
                let data = await this.httpService.getRequest(url).then(response=>response.json())
                let scriptPubKey = data.scriptPubKey;
                return resolve(scriptPubKey);
            }catch(e){
                return reject(e);
            }
        })
    }

    converterAddressToOld(address){
    	return new Promise(async(resolve,reject)=>{
            try{
                this.validator.validateBtcAddress(address)
                let url = `https://rest.bitcoin.com/v2/address/details/${address}`
                let result = await this.httpService.getRequest(url).then(response=>response.json());
                this.validator.validateObject(result);
                let legacyAddress = result.legacyAddress;
                return resolve(legacyAddress);            	
            }catch(e){
                return reject(e);
            }
        })    	
    }

    toDecimals(amount){
        return WeiConverter.formatToDecimals(amount,BCHDECIMALS);
    }
    fromDecimals(amount){
        return WeiConverter.formatFromDecimals(amount,BCHDECIMALS);
    }    
}
module.exports = BitcoinCashLibClass;