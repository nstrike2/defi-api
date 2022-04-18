/**
 * @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
// load API_URL
const { API_URL } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: API_URL,
      },
      mining: {
        auto: true,
      },
    }
  }
};
