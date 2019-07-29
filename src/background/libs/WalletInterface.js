// import EthereumLib from './EthereumLib';
import EthereumTestLib from './EthereumTestLib';
// import EthereumClassicLib = require('./EthereumClassicLib');
// import BitcoinLib = require('./BitcoinLib');
import BitcoinTestLib from './BitcoinTestLib';
// const BitcoinCashLib = require('./BitcoinCashLib');
// const BitcoinCashTestLib = require('./BitcoinCashTestLib');
// const LitecoinLib = require('./LitecoinLib');
const LitecoinTestLib = require('./LitecoinTestLib');
// const DashLib = require('./DashLib');
// const DashTestLib = require('./DashTestLib');
// const Erc20Lib = require('./Erc20Lib');
import Validator from '../core/utilites/Validator';
import Logger from '../core/utilites/Logger'
import Mnemonic from "../core/ianColeman/jsbip39";
import Randomizer from "../core/ianColeman/SafeRandom.js";
import GenerateAddressAndPrivkey from '../core/ianColeman/mnemonicToWallets/GenerateAddressAndPrivkey.js';
import CryptoJS from 'crypto-js';
import Networks from '../core/ianColeman/networks.js';
import HttpService from '../core/services/HttpService.js'

// DONT working
// let phrase = await new Promise((resolve,reject) => {
//                 chrome.storage.local.get(['mnemonic'], response => {
//                     resolve(response)
//                 });             
//             }) 
// console.log(phrase)
//TODO DELETE
let phrase;
if(!phrase){
  phrase = "bean ostrich winter mammal kiss any dream size envelope agree resist lava"
}
console.log(`Current mnemonic:`, phrase);

export default class WalletInterface { 
    constructor(){
        this.networks = Networks;
        this.logger = new Logger();
        this.validator = new Validator();
        this.httpService = new HttpService();
        this.generateAddressAndPrivkey = new GenerateAddressAndPrivkey(this, phrase)
        this.protocols = {};
        //this.protocols.btc = new BitcoinLib(this);
        this.protocols.btctest = new BitcoinTestLib(this);
        //this.protocols.bch = new BitcoinCashLib(this);
        // this.protocols.bchtest = new BitcoinCashTestLib(this);        
        // this.protocols.eth = new EthereumLib(this);
        this.protocols.ethtest = new EthereumTestLib(this);
        // this.protocols.etc = new EthereumClassicLib(this);        
        // this.protocols.erc20 = new Erc20Lib(this);
        // this.protocols.ltc = new LitecoinLib(this);
        this.protocols.ltctest = new LitecoinTestLib(this);
        // this.protocols.dash = new DashLib(this);
        // this.protocols.dashtest = new DashTestLib(this);
        this.mnemonic = new Mnemonic();
        this.randomizer = new Randomizer(0, 255);
    }

    generateRandomPhrase() {
        return new Promise(async(resolve, reject)=>{
            let data = await this.randomizer.resultRandomizer();
            const words = this.mnemonic.toMnemonic(data);
            return resolve(words);
        });
    }

    getPrivatKey(file) {
        return new Promise(async(resolve,reject)=>{
            try{
                //file = "first second"
                console.log(typeof file, file);
                file = JSON.stringify(file);
                let privKey = await this.protocol.getPrivatKey(file);
                return resolve(privKey);


                //return resolve(this.fileService.readUploadedFile(file));
                // var reader = new FileReader();
                // reader.onload = async(e)=>{
                //     var content = reader.result;
                //     console.log("Content:", content)
                //     return resolve(content);
                // }
                // reader.onerror = (e) => {
                //     return reject(e);
                // }
                // console.log("File:", file)
                // reader.readAsText(file);
            }catch(e){
                return reject(e);
            }
        })
    }

    encryptMnemonic(mnemonic, password) {
        return new Promise(async(resolve, reject)=>{
            try{
                let ciphertext = CryptoJS.AES.encrypt(mnemonic, password)
                ciphertext = ciphertext.toString()
                return resolve(ciphertext)
            }catch(e){
                return reject(e)
            }
        })
    }

    decryptMnemonic(ciphertext, password) {
        return new Promise(async(resolve, reject)=>{
            try{
                let bytes = CryptoJS.AES.decrypt(ciphertext, password);
                try{
                    let plaintext = bytes.toString(CryptoJS.enc.Utf8);
                    return resolve(plaintext);
                }catch(e){
                    alert('Wrong password')
                }            
            }catch(e){
                return reject(e);
            }
        });
    }

    setBalance(){
        return new Promise(async(resolve,reject)=>{
            try{
                let balance = await this.getBalance(false)
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        })
    }

    getBalance(raw=true){
        return new Promise(async(resolve,reject)=>{
            try{
                let balance = await this.protocol.getBalance(raw);
                return resolve(balance);
            }catch (e) {
                return reject(e);
            }
        })
    }

    sendTransaction(to,value,gasPrice){
        return new Promise(async(resolve,reject)=>{
            try{
                let txHash = await this.protocol.sendTransaction(to,value,gasPrice)
                return resolve(txHash);
            }catch (e) {
                return reject(e);
            }
        })
    }

    changeProtocol(ticker){
        let chosenProtocol = this.protocols[ticker];
        this.setProtocol(chosenProtocol);
    }

    setProtocol(protocol){
        this.protocol = protocol;
    }

}
