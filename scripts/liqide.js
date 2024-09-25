const { Web3 } = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/c35decbfada24d1498e166a9e4170c9b');

const dexABI = [
    {
    "inputs": [
    {
    "internalType": "contract IERC20",
    "name": "_token",
    "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "target",
    "type": "address"
    }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "account",
    "type": "address"
    }
    ],
    "name": "AddressInsufficientBalance",
    "type": "error"
    },
    {
    "inputs": [],
    "name": "FailedInnerCall",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "token",
    "type": "address"
    }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "provider",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "ethAmount",
    "type": "uint256"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmount",
    "type": "uint256"
    }
    ],
    "name": "LiquidityAdded",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "provider",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "ethAmount",
    "type": "uint256"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmount",
    "type": "uint256"
    }
    ],
    "name": "LiquidityRemoved",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "swapper",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "ethAmountIn",
    "type": "uint256"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "tokenAmountOut",
    "type": "uint256"
    }
    ],
    "name": "Swapped",
    "type": "event"
    },
    {
    "inputs": [],
    "name": "FEE_PERCENTAGE",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "uint256",
    "name": "tokenAmount",
    "type": "uint256"
    }
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "getReserves",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "ethReserve",
    "type": "uint256"
    },
    {
    "internalType": "uint256",
    "name": "tokenReserve",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "uint256",
    "name": "ethAmount",
    "type": "uint256"
    }
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "reserveEth",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "reserveToken",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "uint256",
    "name": "minTokens",
    "type": "uint256"
    }
    ],
    "name": "swapEthForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "uint256",
    "name": "tokenAmount",
    "type": "uint256"
    },
    {
    "internalType": "uint256",
    "name": "minEth",
    "type": "uint256"
    }
    ],
    "name": "swapTokensForEth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "token",
    "outputs": [
    {
    "internalType": "contract IERC20",
    "name": "",
    "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    }
    ]; // DEX kontratının ABI'si
const dexAddress = '0x9cFD667d919bf178dca459cC596f5110BcE8BBc1';
const dexContract = new web3.eth.Contract(dexABI, dexAddress);

const tokenABI = [
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "initialOwner",
    "type": "address"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "spender",
    "type": "address"
    },
    {
    "internalType": "uint256",
    "name": "allowance",
    "type": "uint256"
    },
    {
    "internalType": "uint256",
    "name": "needed",
    "type": "uint256"
    }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "sender",
    "type": "address"
    },
    {
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
    },
    {
    "internalType": "uint256",
    "name": "needed",
    "type": "uint256"
    }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "approver",
    "type": "address"
    }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "receiver",
    "type": "address"
    }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "sender",
    "type": "address"
    }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "spender",
    "type": "address"
    }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "owner",
    "type": "address"
    }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "account",
    "type": "address"
    }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
    },
    {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "Approval",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "previousOwner",
    "type": "address"
    },
    {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
    }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
    },
    {
    "anonymous": false,
    "inputs": [
    {
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
    },
    {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
    },
    {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "Transfer",
    "type": "event"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "owner",
    "type": "address"
    },
    {
    "internalType": "address",
    "name": "spender",
    "type": "address"
    }
    ],
    "name": "allowance",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "spender",
    "type": "address"
    },
    {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "approve",
    "outputs": [
    {
    "internalType": "bool",
    "name": "",
    "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "account",
    "type": "address"
    }
    ],
    "name": "balanceOf",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "decimals",
    "outputs": [
    {
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "name",
    "outputs": [
    {
    "internalType": "string",
    "name": "",
    "type": "string"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "owner",
    "outputs": [
    {
    "internalType": "address",
    "name": "",
    "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "symbol",
    "outputs": [
    {
    "internalType": "string",
    "name": "",
    "type": "string"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
    {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "to",
    "type": "address"
    },
    {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "transfer",
    "outputs": [
    {
    "internalType": "bool",
    "name": "",
    "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "from",
    "type": "address"
    },
    {
    "internalType": "address",
    "name": "to",
    "type": "address"
    },
    {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
    }
    ],
    "name": "transferFrom",
    "outputs": [
    {
    "internalType": "bool",
    "name": "",
    "type": "bool"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
    },
    {
    "inputs": [
    {
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
    }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
    }
    ]; // Token kontratının ABI'si
const tokenAddress = '0x253bC3bfBd5A97d39D32745c553dB2FD3b3C5f3f'; // Token kontratının adresi
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

async function checkLiquidity() {
    const reserveEth = await dexContract.methods.reserveEth().call();
    const reserveToken = await dexContract.methods.reserveToken().call();
    console.log('Mevcut likidite:', {
        ETH: web3.utils.fromWei(reserveEth, 'ether'),
        Token: web3.utils.fromWei(reserveToken, 'ether')
    });
    return { reserveEth, reserveToken };
}


async function addLiquidity(privateKey, ethAmount, tokenAmount) {
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    try {
        console.log('Mevcut likidite kontrol ediliyor...');
        const { reserveEth, reserveToken } = await checkLiquidity();

        if (reserveEth !== '0' && reserveToken !== '0') {
            // Mevcut likiditeye göre token miktarını hesapla
            const requiredTokenAmount = BigInt(ethAmount) * BigInt(reserveToken) / BigInt(reserveEth);
            tokenAmount = requiredTokenAmount.toString();
            console.log('Gerekli token miktarı:', web3.utils.fromWei(tokenAmount, 'ether'));
        }

        console.log('Token onayı veriliyor...');
        const approvalTx = await tokenContract.methods.approve(dexAddress, tokenAmount).send({ from: account.address });
        console.log('Token onayı verildi. İşlem hash:', approvalTx.transactionHash);

        console.log('Likidite ekleme işlemi başlatılıyor...');
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await dexContract.methods.addLiquidity(tokenAmount).estimateGas({
            from: account.address,
            value: ethAmount
        });

        console.log('Tahmini gaz:', gasEstimate);

        const tx = {
            from: account.address,
            to: dexAddress,
            gas: Math.floor(Number(gasEstimate) * 1.5),
            gasPrice: gasPrice,
            value: ethAmount,
            data: dexContract.methods.addLiquidity(tokenAmount).encodeABI()
        };

        console.log('İşlem imzalanıyor...');
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        console.log('İşlem gönderiliyor...');
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        console.log('İşlem başarılı:', receipt.transactionHash);
        console.log('Gaz kullanımı:', receipt.gasUsed);
        console.log('İşlem durumu:', receipt.status ? 'Başarılı' : 'Başarısız');

        console.log('Güncellenmiş likidite kontrol ediliyor...');
        await checkLiquidity();
    } catch (error) {
        console.error('Hata detayı:', error);
        if (error.receipt) {
            console.error('İşlem hash:', error.receipt.transactionHash);
            console.error('Gaz kullanımı:', error.receipt.gasUsed);
            console.error('İşlem durumu:', error.receipt.status ? 'Başarılı' : 'Başarısız');
        }
    }
}

// Kullanım
const privateKey = '0x4776901c3336f1d87e0f0bd51106fe1524e3350b4fc06b63c89f1356102dd08b';
const ethToAdd = web3.utils.toWei('0.15', 'ether');
let tokenToAdd = web3.utils.toWei('10', 'ether'); // Bu değer, mevcut likiditeye göre otomatik ayarlanacak

addLiquidity(privateKey, ethToAdd, tokenToAdd)
    .then(() => console.log('İşlem tamamlandı'))
    .catch((error) => console.error('Genel hata:', error));