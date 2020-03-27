#!/bin/bash
cd /var/run
sudo chmod 777 docker.sock
cd -
chmod 777 -R *
cd ../fabric-samples/first-network
./byfn.sh down
docker rm $(docker ps -aq)
cd ../../Decentralized_Voting_System/Voting
./startFabric.sh javascript
cd javascript
./remove.sh
node enrollAdmin.js