import { Injectable, OnModuleInit } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

@Injectable()
export class Web3Service implements OnModuleInit {
  private web3Instance: any;

  constructor() {
    this.web3Instance = new Web3(
      new Web3.providers.HttpProvider(
        `https://${process.env.ETHEREUM_NETWORK}.infura.io/v3/${process.env.INFURA_API_KEY}`,
      ),
    );
  }
  async onModuleInit() {
    // const transaction = await this.initiateTransactionObject();
    // const receipt = await this.getTransactionReceipt(transaction);
    // console.log('receipt', receipt);
  }

  get web3(): any {
    return this.web3Instance;
  }

  async getSigner() {
    const signer = this.web3.eth.accounts.privateKeyToAccount(
      process.env.SIGNER_PRIVATE_KEY,
    );

    return this.web3.eth.accounts.wallet.add(signer);
  }

  async getGasLimit(signer: any) {
    return await this.web3.eth
      .estimateGas({
        from: signer.address,
        to: '0xAED01C776d98303eE080D25A21f0a42D94a86D9c',
        value: this.web3.utils.toWei('0.002'),
      })
      .then((gasLimit) => {
        console.log('gasLimit: ', gasLimit);
        return gasLimit;
      });
  }

  async initiateTransactionObject() {
    const signer = await this.getSigner();
    const limit = await this.getGasLimit(signer);
    const tx = {
      from: await signer.address,
      to: '0xAED01C776d98303eE080D25A21f0a42D94a86D9c',
      value: this.web3.utils.numberToHex(
        this.web3.utils.toWei('0.01', 'ether'),
      ),
      gas: this.web3.utils.toHex(limit),
      nonce: this.web3.eth.getTransactionCount(signer.address),
      maxPriorityFeePerGas: this.web3.utils.toHex(
        this.web3.utils.toWei('2', 'gwei'),
      ),
      chainId: 5,
      type: 0x2,
    };
    const signedTx = await this.web3.eth.accounts.signTransaction(
      tx,
      signer.privateKey,
    );
    return signedTx.rawTransaction;
  }

  async getTransactionReceipt(transaction: any) {
    // Sending the transaction to the network
    const receipt = await this.web3.eth
      .sendSignedTransaction(transaction)
      .once('transactionHash', (txhash) => {
        console.log(`Mining transaction ...`);
        console.log('transaction hash: ' + txhash);
        console.log(
          `https://${process.env.ETHEREUM_NETWORK}.etherscan.io/tx/${txhash}`,
        );
      });
    return receipt.blockNumber;
  }
}
