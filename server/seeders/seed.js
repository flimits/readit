const connection = require('../config/connection');
const { User, Post } = require('../models');
const { usersData, usersDataBad } = require('./user-data');
const { postsData, postsDataBad } = require('./post-data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log("----- START SEEDING -----\n")

  // await seedUsers();

  await seedPosts();

  console.log("----- COMPLETED SEEDING -----");
  process.exit(0);
})

async function seedUsers() {
  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  }

  console.log("----- USERS SEEDING -----\n")
  for (const user of usersData) {
    try {
      const newUser = await User.create(user);
      console.log("user:", newUser);
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

  console.log("----- USERS SEEDED -----\n")
}


async function seedPosts() {
  let postsCheck = await connection.db.listCollections({ name: 'posts' }).toArray();
  if (postsCheck.length) {
    await connection.dropCollection('posts');
  }

  console.log("----- POSTS SEEDING -----\n")
  for (const post of postsData) {
    try {
      const newPost = await Post.create(post);
      console.log("user:", newPost);
      console.log("created user:", post)
    } catch (error) {
      console.log("couldn't create post:", post)
      console.error(error)
    }
  }

  // Specifically test validations
  for (const post of postsDataBad) {
    try {
      await Post.create(post);
      console.log("created post:", post)
    } catch (error) {
      console.log("couldn't create post:", post)
      console.error(error)
    }
    console.log()
  }

  console.log("----- POSTS SEEDED -----\n")
}