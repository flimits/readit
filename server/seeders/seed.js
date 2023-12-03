const connection = require('../config/connection');
const { User } = require('../models');
const { usersData, usersDataBad } = require('./user-data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log("----- START SEEDING -----\n")
  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  }

  console.log("----- USER SEEDING -----\n")
  await seedUsers();
  console.log("----- USERS SEEDED -----\n")


  console.log("----- COMPLETED SEEDING -----");
  process.exit(0);
})

async function seedUsers() {
  for (const user of usersData) {
    try {
      await User.create(user);
      // console.log("created user:", user)
    } catch (error) {
      // console.log("couldn't create user:", user)
      console.error(error)
    }
  }

  // Specifically test validations
  // for (const user of usersDataBad) {
  //   try {
  //     await User.create(user);
  //     console.log("created user:", user)
  //   } catch (error) {
  //     console.log("couldn't create user:", user)
  //     console.error(error)
  //   }
  //   console.log()
  // }
}