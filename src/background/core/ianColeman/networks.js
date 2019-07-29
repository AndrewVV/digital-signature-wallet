var networks = {
    // BCH = 0, BTC = 1, DASH = 2, ETC = 3, ETH = 4, LTC = 5, BTCTEST = 6, LTCTEST = 7, DASHTEST = 8, BCHTEST = 9, ETHTEST = 10.
    "BCH":{
        name: "BCH - Bitcoin Cash",
        ticker:"BCH",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x00,
                scriptHash: 0x05,
                wif: 0x80
            };            
        },
    },
    "BCHNETWORK":{
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    "BTC":{
        name: "BTC - Bitcoin",
        ticker:"BTC",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x00,
                scriptHash: 0x05,
                wif: 0x80
            };
        },
    },
    "BTCNETWORK":{
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    "DASH":{
        name: "DASH - Dash",
        ticker:"DASH",
        onSelect: function() {
            network = {
                messagePrefix: 'unused',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x4c,
                scriptHash: 0x10,
                wif: 0xcc
            };
        },
    },
    "DASHNETWORK":{
        messagePrefix: 'unused',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc
    },
    "ETC":{
        name: "ETC - Ethereum Classic",
        ticker:"ETC",
        segwitAvailable: false,
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x00,
                scriptHash: 0x05,
                wif: 0x80
            };            
        },
    },
    "ETCNETWORKS":{
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    "ETH":{
        name: "ETH - Ethereum",
        ticker:"ETH",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x00,
                scriptHash: 0x05,
                wif: 0x80
            };
        },
    },
    "LTC":{
        name: "LTC - Litecoin",
        ticker:"LTC",
        onSelect: function() {
            network = {
                messagePrefix: '\x19Litecoin Signed Message:\n',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4,
                },
                pubKeyHash: 0x30,
                scriptHash: 0x32,
                wif: 0xb0
            };
        },
    },
    "LTCNETWORKS":{
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4,
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },
    "BTCTEST":{
        name: "BTC - Bitcoin Testnet",
        ticker:"BTCTEST",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'tb',
                bip32: {
                  public: 0x043587cf,
                  private: 0x04358394
                },
                pubKeyHash: 0x6f,
                scriptHash: 0xc4,
                wif: 0xef
            };
        },
    },
    "BTCTESTNETWORK":{
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
          public: 0x043587cf,
          private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    "LTCTEST":{
        name: "LTC - Litecoin Testnet",
        ticker:"LTCTEST",
        onSelect: function() {
            network = {
                messagePrefix: '\x19Litecoin Signed Message:\n',
                bip32: {
                  public: 0x043587cf,
                  private: 0x04358394,
                },
                pubKeyHash: 0x6f,
                scriptHash: 0xc4,
                wif: 0xef
            };
        },
    },
    "DASHTEST":{
        name: "DASH - Dash Testnet",
        ticker:"DASHTEST",
        onSelect: function() {
            network = {
                messagePrefix: 'unused',
                bip32: {
                  public: 0x043587cf,
                  private: 0x04358394
                },
                pubKeyHash: 0x8c,
                scriptHash: 0x13,
                wif: 0xef
            };
        },
    },
    "BCHTEST":{
        name: "BCHTEST - Bitcoin Cash Testnet",
        ticker:"BCHTEST",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x043587cf,
                  private: 0x04358394
                },
                pubKeyHash: 0x6F,
                scriptHash: 0xC4,
                wif: 0xef
            };            
        },
    },
    "BCHTESTNETWORK":{
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x043587cf,
          private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    "ETHTEST":{
        name: "ETH - Ethereum Testnet",
        ticker:"ETHTEST",
        onSelect: function() {
            network = {
                messagePrefix: '\x18Bitcoin Signed Message:\n',
                bech32: 'bc',
                bip32: {
                  public: 0x0488b21e,
                  private: 0x0488ade4
                },
                pubKeyHash: 0x00,
                scriptHash: 0x05,
                wif: 0x80
            };
        },
    },
}

module.exports = networks;