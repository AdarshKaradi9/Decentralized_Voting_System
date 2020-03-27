/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt')
const app = express();
const saltRounds = 10;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const util = require('util');

const knex = require('knex')({
    client: 'pg',
    version: '12.1',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '0000',
      database : 'login'
    }
  });


app.use(express.json());
app.use(cors());

const db = knex;


let network = require('./network.js');

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const appAdmin = 'admin';

//get all assets in world state
app.get('/queryAll', async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryAll', '');
  let parsedResponse = await JSON.parse(response);
  res.send(parsedResponse);

});



app.get('/getCurrentStanding', async (req, res) => {

  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', 'votableItem');
  let parsedResponse = await JSON.parse(response);
  console.log(parsedResponse);
  res.send(parsedResponse);

});

//vote for some candidates. This will increase the vote count for the votable objects
app.post('/castBallot', async (req, res) => {
  console.log("cast",req.body)
  let networkObj = await network.connectToNetwork(req.body.voterId);
  req.body = JSON.stringify(req.body);
  
  let args = [req.body];

  let response = await network.invoke(networkObj, false, 'castVote', args);
  if (response.error) {
    res.send(response.error);
  } else {
    res.send(response);
  }
});

//query for certain objects within the world state
app.post('/queryWithQueryString', async (req, res) => {
  console.log('dfd',req.body.selected);
  let networkObj = await network.connectToNetwork(appAdmin);
  let response = await network.invoke(networkObj, true, 'queryByObjectType', req.body.selected);
  let parsedResponse = await JSON.parse(response);
  console.log('dfd',req.body.selected);
  res.send(parsedResponse);

});

//get voter info, create voter object, and update state with their voterId
app.post('/registerVoter', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);
  let voterId = req.body.voterId;

  //first create the identity for the voter and add to wallet
  let response = await network.registerVoter(voterId, req.body.registrarId, req.body.firstName, req.body.lastName);
  console.log('response from registerVoter: ');
  console.log(response);
  if (response.error) {
    res.send(response.error);
  } else {
    let networkObj = await network.connectToNetwork(voterId);
    if (networkObj.error) {
      res.send(networkObj.error);
    }

    req.body = JSON.stringify(req.body);
    let args = [req.body];
    //connect to network and update the state with voterId  

    let invokeResponse = await network.invoke(networkObj, false, 'createVoter', args);
    
    if (invokeResponse.error) {
      res.send(invokeResponse.error);
    } else {

      console.log('after network.invoke ');
      let parsedResponse = JSON.parse(invokeResponse);
      parsedResponse += '. Use voterId to login above.';
      var response1 = {
        data: parsedResponse,
        resStatus: 'success'
      }
      res.send(response1);

    }

  }


});

//used as a way to login the voter to the app and make sure they haven't voted before 
app.post('/validateVoter', async (req, res) => {
  let networkObj = await network.connectToNetwork(req.body.voterId)
  if (networkObj.error) {
    res.send(networkObj);
  }

  let invokeResponse = await network.invoke(networkObj, true, 'readMyAsset', req.body.voterId);
  if (invokeResponse.error) {
    res.send(invokeResponse);
  } else {
    console.log('after network.invoke ');
    let parsedResponse = await JSON.parse(invokeResponse);
    console.log(parsedResponse);
    // let response = `Voter with voterId ${parsedResponse.voterId} is ready to cast a ballot.` 
    var response1 = { 
      data: parsedResponse,
      resStatus: 'success'
  }
    res.send(response1);
  }

});

app.post('/queryByKey', async (req, res) => {
  console.log('req.body: ');
  console.log(req.body);

  let networkObj = await network.connectToNetwork(appAdmin);
  console.log('after network OBj');
  let response = await network.invoke(networkObj, true, 'readMyAsset', req.body.key);
  response = JSON.parse(response);
  if (response.error) {
    console.log('inside eRRRRR');
    res.send(response.error);
  } else {
    console.log('inside ELSE');
    res.send(response);
  }
});


app.listen(3001,() => {
	console.log("Server Listening on Port 3001");
});
