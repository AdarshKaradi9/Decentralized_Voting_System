#!/bin/bash

cd ../fabric-samples/first-network
./byfn.sh down

cd ../../Decentralized_Voting_System/Voting
./startFabric.sh javascript

cd javascript
./remove.sh

node enrollAdmin.js



