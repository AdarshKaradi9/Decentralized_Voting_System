

'use strict';


const { Contract } = require('fabric-contract-api');
const path = require('path');
const fs = require('fs');


const electionDataPath = path.join(process.cwd(), './lib/data/electionData.json');
const electionDataJson = fs.readFileSync(electionDataPath, 'utf8');
const electionData = JSON.parse(electionDataJson);

const ballotDataPath = path.join(process.cwd(), './lib/data/candidates.json');
const ballotDataJson = fs.readFileSync(ballotDataPath, 'utf8');
const ballotData = JSON.parse(ballotDataJson);

let Ballot = require('./Ballot.js');
let Election = require('./Election.js');
let Voter = require('./Voter.js');
let VotableItem = require('./VotableItem.js');

class MyAssetContract extends Contract {

  async init(ctx) {
    let voters = [];
    let votableItems = [];
    let elections = [];
    let election;

    let voter1 = await new Voter('V1', '234', 'Horea', 'Porutiu');
    let voter2 = await new Voter('V2', '345', 'Duncan', 'Conley');

    voters.push(voter1);
    voters.push(voter2);

    await ctx.stub.putState(voter1.voterId, Buffer.from(JSON.stringify(voter1)));
    await ctx.stub.putState(voter2.voterId, Buffer.from(JSON.stringify(voter2)));

    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {

      let electionStartDate = await new Date(2019, 11, 3);
      let electionEndDate = await new Date(2021, 11, 4);

      election = await new Election(electionData.electionName, electionData.electionCountry,
        electionData.electionYear, electionStartDate, electionEndDate);

      elections.push(election);

      await ctx.stub.putState(election.electionId, Buffer.from(JSON.stringify(election)));

    } else {
      election = currElections[0];
    }

    let repVotable = await new VotableItem(ctx, 'Candidate1', ballotData.Candidate1Brief);
    let demVotable = await new VotableItem(ctx, 'Candidate2', ballotData.Candidate2Brief);
    let indVotable = await new VotableItem(ctx, 'Candidate3', ballotData.Candidate3Brief);
    let grnVotable = await new VotableItem(ctx, 'Candidate4', ballotData.Candidate4Brief);
    let libVotable = await new VotableItem(ctx, 'Candidate5', ballotData.Candidate5Brief);

    votableItems.push(repVotable);
    votableItems.push(demVotable);
    votableItems.push(indVotable);
    votableItems.push(grnVotable);
    votableItems.push(libVotable);

    for (let i = 0; i < votableItems.length; i++) {
    
      await ctx.stub.putState(votableItems[i].votableId, Buffer.from(JSON.stringify(votableItems[i])));

    }

    for (let i = 0; i < voters.length; i++) {

      if (!voters[i].ballot) {

        await this.generateBallot(ctx, votableItems, election, voters[i]);

      } else {
        console.log('these voters already have ballots');
        break;
      }

    }

    return voters;

  }

  async generateBallot(ctx, votableItems, election, voter) {

    let ballot = await new Ballot(ctx, votableItems, election, voter.voterId);
    
    voter.ballot = ballot.ballotId;
    voter.ballotCreated = true;

    await ctx.stub.putState(ballot.ballotId, Buffer.from(JSON.stringify(ballot)));

    await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));

  }


  async createVoter(ctx, args) {

    args = JSON.parse(args);

    let newVoter = await new Voter(args.voterId, args.registrarId, args.firstName, args.lastName);

    await ctx.stub.putState(newVoter.voterId, Buffer.from(JSON.stringify(newVoter)));

    let currElections = JSON.parse(await this.queryByObjectType(ctx, 'election'));

    if (currElections.length === 0) {
      let response = {};
      response.error = 'no elections. Run the init() function first.';
      return response;
    }

    let currElection = currElections[0];

    let votableItems = JSON.parse(await this.queryByObjectType(ctx, 'votableItem'));
    
    await this.generateBallot(ctx, votableItems, currElection, newVoter);

    let response = `voter with voterId ${newVoter.voterId} is updated in the world state`;
    return response;
  }



  async deleteMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);
    if (!exists) {
      throw new Error(`The my asset ${myAssetId} does not exist`);
    }

    await ctx.stub.deleteState(myAssetId);

  }

  async readMyAsset(ctx, myAssetId) {

    const exists = await this.myAssetExists(ctx, myAssetId);

    if (!exists) {
      let response = {};
      response.error = `The my asset ${myAssetId} does not exist`;
      return response;
    }

    const buffer = await ctx.stub.getState(myAssetId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async myAssetExists(ctx, myAssetId) {

    const buffer = await ctx.stub.getState(myAssetId);
    return (!!buffer && buffer.length > 0);

  }

  async castVote(ctx, args) {
    args = JSON.parse(args);

    let votableId = args.picked;

    let electionExists = await this.myAssetExists(ctx, args.electionId);

    if (electionExists) {

      let electionAsBytes = await ctx.stub.getState(args.electionId);
      let election = await JSON.parse(electionAsBytes);
      let voterAsBytes = await ctx.stub.getState(args.voterId);
      let voter = await JSON.parse(voterAsBytes);

      if (voter.ballotCast) {
        let response = {};
        response.error = 'this voter has already cast this ballot!';
        return response;
      }

      let currentTime = await new Date(2020, 11, 3);

      let parsedCurrentTime = await Date.parse(currentTime);
      let electionStart = await Date.parse(election.startDate);
      let electionEnd = await Date.parse(election.endDate);

      if (parsedCurrentTime >= electionStart && parsedCurrentTime < electionEnd) {

        let votableExists = await this.myAssetExists(ctx, votableId);
        if (!votableExists) {
          let response = {};
          response.error = 'VotableId does not exist!';
          return response;
        }

        let votableAsBytes = await ctx.stub.getState(votableId);
        let votable = await JSON.parse(votableAsBytes);

        await votable.count++;

        let result = await ctx.stub.putState(votableId, Buffer.from(JSON.stringify(votable)));
        console.log(result);

        voter.ballotCast = true;
        voter.picked = {};
        voter.picked = args.picked;

        let response = await ctx.stub.putState(voter.voterId, Buffer.from(JSON.stringify(voter)));
        console.log(response);
        return voter;

      } else {
        let response = {};
        response.error = 'the election is not open now!';
        return response;
      }

    } else {
      let response = {};
      response.error = 'the election or the voter does not exist!';
      return response;
    }
  }

  
  async queryAll(ctx) {

    let queryString = {
      selector: {}
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }

  async queryWithQueryString(ctx, queryString) {

    console.log('query String');
    console.log(JSON.stringify(queryString));

    let resultsIterator = await ctx.stub.getQueryResult(queryString);

    let allResults = [];


    while (true) {
      let res = await resultsIterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};

        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;

        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }

        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await resultsIterator.close();
        console.info(allResults);
        console.log(JSON.stringify(allResults));
        return JSON.stringify(allResults);
      }
    }
  }

  async queryByObjectType(ctx, objectType) {

    let queryString = {
      selector: {
        type: objectType
      }
    };

    let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
    return queryResults;

  }
}
module.exports = MyAssetContract;
