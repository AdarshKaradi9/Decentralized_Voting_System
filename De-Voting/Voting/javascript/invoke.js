/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

async function main() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('admin');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('logchain');

        // Submit the specified transaction.
        // createLog transaction - requires 5 argument, ex: ('createLog', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createLog', 'TID3', '1TB','mac','4','66%','4%','7%','6');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID4', '2GB','mac','8','68%','5%','6%','4');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID5', '3GB','mac','16','70%','6%','3%','2');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID6', '400GB','mac','32','72%','7%','2%','4');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID7', '2TB','mac','16','74%','8%','5%','2');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID8', '16GB','mac','64','76%','2%','6%','8');
        await sleep(10000);
        await contract.submitTransaction('createLog', 'TID9', '74','mac','8','78%','4%','5%','6');
        await sleep(10000);

        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
