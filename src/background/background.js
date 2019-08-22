import WalletInterface from './libs/WalletInterface';
import ActionsClass from '../common/class.actions.js';
let walletInterface = new WalletInterface();
const Actions = new ActionsClass();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    	(async () => {
    		switch (request.action) {
                case (Actions.getBackground().changeProtocol):
                    walletInterface.changeProtocol(request.data);
					break;
				case (Actions.getBackground().getPrivatKey):
					result = await walletInterface.getPrivatKey(request.data);
					console.log("PrivatKey:", result)
					sendResponse(result);
					break;
    			case (Actions.getBackground().generationMnemonic):
        			let result = await walletInterface.generateRandomPhrase()
					console.log("Random mnemomic:", result)
					sendResponse(result)
    				break;
    			case (Actions.getBackground().getCiphertext):
    				result = await walletInterface.encryptMnemonic(request.data.mnemonic,request.data.password)
    				console.log("Chipher:", result);
    				sendResponse(result)
    				break;
    			case (Actions.getBackground().getMnemonic):
    				result = await walletInterface.decryptMnemonic(request.data.ciphertext,request.data.password);
    				sendResponse(result);
    				walletInterface.generateAddressAndPrivkey.phrase = result;
    				console.log("Mnemonic:", result);
    				break;
                case (Actions.getBackground().getAddress):
                    result = await walletInterface.getAddress();
                    sendResponse(result);
                    break;
                case (Actions.getBackground().getBalance):
                    result = await walletInterface.setBalance();
                    sendResponse(result);
                    break;
                case (Actions.getBackground().sendTransaction):
                    result = await walletInterface.sendTransaction(request.data.to, request.data.value, request.data.gasPrice);
                    sendResponse(result);
                    break;
    		}
	})();
	return true;
    }
    
);