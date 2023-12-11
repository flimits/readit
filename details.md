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

[Using async in react `useEffect` hook](https://devtrium.com/posts/async-functions-useeffect)

[Idea for multiple $or queries](https://stackoverflow.com/a/37722869)

[Idea for react rendering with multiple conditions](https://dev.to/samba_code/nested-ternary-statements-in-react-jsx-35kp)

## Resources 

[JWT docs](https://www.npmjs.com/package/jsonwebtoken)

[Mongoose $each](https://www.mongodb.com/docs/manual/reference/operator/update/push/)

[MongoDB Indexes for $text](https://stackoverflow.com/a/59922531)

[MongoDB using Regex in .find()](https://www.mongodb.com/docs/manual/reference/operator/query/regex/#examples)