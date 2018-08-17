# Token-Sender-with-Server
A Ethereum Wallet web app using NodeJS to create new accounts and transfer ERC20 tokens

Project uses Infura as service provider and Etherscan API to obtain contract ABI

## Installation
In Administrator Cmd: <br />
``` $ npm install windows-build-tools```

set python path in npm: <br />
``` $ npm config set python C:\Users\YourName\.windows-build-tools\ ```

install all dependencies <br />
``` $ npm install -s ```

## Usage
### Create Accounts
The wallet creation module is hiden by default. To create new wallet, click on ```Create Wallet``` tab in navagation bar. There are two types of wallet creation:<br />
- create account address and private key with a single click
- create password encrypted account and generate keystore file

### Select Token Type
- inputs contract address (currently defaults to a testing token on Ropsten testnest)

### Batch Transaction 
- batch transaction done on given ERC20 token type (Ether transfer feature under development)
- upload recipients info in csv file under the following format: ```Name, Address, Amount``` (units in Wei)
- webpage will be redirected to ```Etherscan``` and transaction hashes will be generated in CSV formt under ```outputs``` folder

### (single transaction under development)

## Todo's
- ~~keystore file download~~ ✓
- transfer Ether
- singe transaction
- user defined gas price
- migrate all functionalities to client-side

