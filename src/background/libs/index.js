import WalletInterfaceLib from './WalletInterface.js';
const walletInterface = new WalletInterfaceLib();

    $("#generate-mnemonic").click(async()=> {
        //alert('Generate Mnemonic')
        let result = await walletInterface.test();
        //let result = "test2 test2"
        $('#mnemonic').html(result);
    });