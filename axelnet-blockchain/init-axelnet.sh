#!/bin/bash

# A driver script for initializing the axelnet-blockchain
export $(grep -v '^#' .env | xargs)
npx hardhat node --fork ${API_URL}