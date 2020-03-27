#!/bin/bash

cd ../fabric-samples/first-network
./byfn.sh down

cd ../../De-Voting/Voting
./startFabric.sh javascript

cd javascript
./remove.sh

node del.js
node enrollAdmin.js

#cd Frontend
#node ip.js



