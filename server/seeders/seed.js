const connection = require('../config/connection');
const { User, Post } = require('../models');
const { usersData, usersDataBad } = require('./user-data');
const { postsData, postsDataBad } = require('./post-data');
const { ObjectId } = require('bson');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log("----- START SEEDING -----\n")

  // Save all the users so we can use their user.id when seeding posts
  const users = await seedUsers();

  await seedPosts(users);

  console.log("----- COMPLETED SEEDING -----");
  process.exit(0);
})

async function seedUsers() {
  let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (usersCheck.length) {
    await connection.dropCollection('users');
  }

  // Save all the users so we can use their user.id when seeding posts
  const newUsers = [];

  console.log("----- USERS SEEDING -----\n")
  for (const user of usersData) {
    try {
      const newUser = await User.create(user);
      // console.log("user:", newUser);
      newUsers.push(newUser); // Save the user object in the array
    } catch (error) {
      // console.log("COULDN'T create user:", user)
      console.error(error)
    }
  }

  // Specifically test validations
  // for (const user of usersDataBad) {
  //   try {
  //     await User.create(user);
  //     console.log("created user:", user)
  //   } catch (error) {
  //     console.log("COULDN'T create user:", user)
  //     console.error(error)
  //   }
  //   console.log()
  // }

  console.log("----- USERS SEEDED -----\n")
  // console.log("users:", newUsers);
  return newUsers
}


async function seedPosts(users) {
  let postsCheck = await connection.db.listCollections({ name: 'posts' }).toArray();
  if (postsCheck.length) {
    await connection.dropCollection('posts');
  }

  console.log("----- POSTS SEEDING -----\n")
  for (const post of postsData) {
    try {
      // Randomly assign a userId to a post
      const randomUser = users[Math.floor(Math.random() * users.length)].id;
      post["userId"] = randomUser;

      // Randomly assign a userId to a comment
      post.comments?.map((comment) => comment.userId = users[Math.floor(Math.random() * users.length)].id)
      post.reactions?.map((reaction) => reaction.userId = users[Math.floor(Math.random() * users.length)].id)

      // TODO: Test this seeding when reaction schema is implemented
      // randomly assign a userId to a reaction
      // post.comments?.map((comment) => comment.reactions?.userId = users[Math.floor(Math.random() * users.length)].id)

      const newPost = await Post.create(post);
      // console.log("created post:", newPost);

      // After the new post is created, add that postId back under the randomUser's document in the db.
      await User.findByIdAndUpdate(randomUser,
        { $push: { posts: new ObjectId(newPost.id) } }
      )
    } catch (error) {
      // console.log("COULDN'T create post:", post)
      console.error(error)
    }
  }

  // Specifically test validations
  // for (const post of postsDataBad) {
  //   try {
  //     await Post.create(post);
  //     console.log("created post:", post)
  //   } catch (error) {
  //     console.log("COULDN'T create post:", post)
  //     console.error(error)
  //   }
  //   console.log()
  // }

  console.log("----- POSTS SEEDED -----\n")
}