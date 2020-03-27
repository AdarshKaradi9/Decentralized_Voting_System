const bcrypt = require('bcrypt')
const saltRounds = 10;
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
  const db = knex;
  console.log("Clearing the database.....");
  db('username').del().catch(err=>{console.log(err)})
  console.log("Database Cleared......");
  console.log("Adding admin to the Database......")
  var hash = bcrypt.hashSync('admin',saltRounds)
  db('username').insert([{username:`{admin}` , secret:`${hash}`}],['username']).then(data => {console.log("Added Admin Successfully....");console.log(data) 
                                                                                                process.exit(0)
                                                                                            }).catch(err => console.log(err))