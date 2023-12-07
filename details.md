## Coding Snippets

Mutation of updating a nested subdoc's array.
```js
addReactionToComment: async (parent, { postId, commentId, ...newReaction }) => {
  return await Post.findOneAndUpdate(
    { _id: new ObjectId(postId), 'comments._id': new ObjectId(commentId) },
    {
      $push: { 'comments.$.reactions': newReaction }
    },
    { new: true }
  )
}
```

## Credits

[Comparing ObjectIds](https://futurestud.io/tutorials/mongodb-how-to-compare-objectids-in-node-js)

[MongoDB Indexes for $text](https://stackoverflow.com/a/59922531)

## Resources 

[JWT docs](https://www.npmjs.com/package/jsonwebtoken)

[Mongoose $each](https://www.mongodb.com/docs/manual/reference/operator/update/push/)