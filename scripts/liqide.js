const { Web3 } = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/-your-infura-api');

const dexABI = [
    ]; // ABI of the DEX contract. You can find it in the artifacts folder.
const dexAddress = 'token dex address';
const dexContract = new web3.eth.Contract(dexABI, dexAddress);

const tokenABI = [
    ]; // ABI of the token contract. You can find it in the artifacts folder.
const tokenAddress = 'token contract address'; // Address of the token contract
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
        console.log('Existing liquidity is being controlled...');
        const { reserveEth, reserveToken } = await checkLiquidity();

        if (reserveEth !== '0' && reserveToken !== '0') {
             // Calculate token amount based on available liquidity
            const requiredTokenAmount = BigInt(ethAmount) * BigInt(reserveToken) / BigInt(reserveEth);
            tokenAmount = requiredTokenAmount.toString();
            console.log('Required amount of tokens:', web3.utils.fromWei(tokenAmount, 'ether'));
        }

        console.log('Token approval is being given...');
        const approvalTx = await tokenContract.methods.approve(dexAddress, tokenAmount).send({ from: account.address });
        console.log('Token approval granted. Transaction hash:', approvalTx.transactionHash);

        console.log('Initiating the process of adding liquidity...');
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await dexContract.methods.addLiquidity(tokenAmount).estimateGas({
            from: account.address,
            value: ethAmount
        });

        console.log('Estimated gas:', gasEstimate);

        const tx = {
            from: account.address,
            to: dexAddress,
            gas: Math.floor(Number(gasEstimate) * 1.5),
            gasPrice: gasPrice,
            value: ethAmount,
            data: dexContract.methods.addLiquidity(tokenAmount).encodeABI()
        };

        console.log('The transaction is being signed...');
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        console.log('Sending the transaction...');
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
        console.log('The process is successful:', receipt.transactionHash);
        console.log('Gas use:', receipt.gasUsed);
        console.log('Transaction status:', receipt.status ? 'Successful' : 'Failed');

        console.log('Updated liquidity is being checked...');
        await checkLiquidity();
    } catch (error) {
        console.error('Hata detayı:', error);
        if (error.receipt) {
            console.error('Transaction hash', error.receipt.transactionHash);
            console.error('Gas use:', error.receipt.gasUsed);
            console.error('Transaction status:', error.receipt.status ? 'Successful' : 'Failed');
        }
    }
}

// Usage
const privateKey = 'privatekey of metamask wallet';
const ethToAdd = web3.utils.toWei('0.15', 'ether');
let tokenToAdd = web3.utils.toWei('10', 'ether'); // This value will be automatically adjusted according to available liquidity

addLiquidity(privateKey, ethToAdd, tokenToAdd)
    .then(() => console.log('Transaction completed'))
    .catch((error) => console.error('General error:', error));
