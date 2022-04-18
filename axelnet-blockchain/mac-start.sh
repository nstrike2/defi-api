#!/bin/bash

# A script for a Mac machine to boot up our axelnet-blockchain
export $(grep -v '^#' .env | xargs)
npx hardhat node --fork ${API_URL}