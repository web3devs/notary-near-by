require("@nomicfoundation/hardhat-chai-matchers");
require("@nomiclabs/hardhat-ethers");
require("./tasks/account");
require("./tasks/transfer");
require("./tasks/totalSupply");
require("./tasks/balanceOf");
require("./tasks/approve");
require("./tasks/transferFrom");
require('dotenv').config();

const AURORA_PRIVATE_KEY = process.env.AURORA_PRIVATE_KEY;
const AURORA_API_KEY = process.env.AURORA_API_KEY;

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    aurora: {
      url: `https://mainnet.aurora.dev/${AURORA_API_KEY}`,
      accounts: [`0x${AURORA_PRIVATE_KEY}`],
      chainId: 1313161554,
      gasPrice: 120 * 1000000000
    },
    testnet_aurora: {
      url: 'https://testnet.aurora.dev',
      accounts: [`0x${AURORA_PRIVATE_KEY}`],
      chainId: 1313161555,
      gasPrice: 120 * 1000000000
    },
    local_aurora: {
      url: 'http://localhost:8545',
      accounts: [`0x${AURORA_PRIVATE_KEY}`],
      chainId: 31337,
      gasPrice: 120 * 1000000000
    },
  }
};

