const postsData = [
    {
        "title": "I love React",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "I think react is really neat",

    }
]

const postsDataBad = [
    {
        "userId": "656c2fe66608877dcd50106a",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "userId": "656c2fe66608877dcd50106a",
    },
]

module.exports = { postsData, postsDataBad }