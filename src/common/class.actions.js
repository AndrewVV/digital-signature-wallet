
export default class Actions {
    getBackground () {
        return {
            changeProtocol: 'bg_change_protocol',
            getPrivatKey: 'getPrivatKey',
            generationMnemonic: 'bg_generation_mnemonic',
            getCiphertext: 'bg_get_ciphertext',
            getMnemonic: 'bg_get_mnemonic',
            getAddress: 'bg_get_address',
            getBalance: 'bg_get_balance',
            sendTransaction: 'bg_send_transaction'
        }
    }
}