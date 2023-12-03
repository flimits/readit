// TODO: Add reaction testing.

const postsData = [
    {
        "title": "I love React",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love GraphQL",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "userId": "656c2fe66608877dcd50106a",
                "text": "Yeah I really like it too"
            }
        ]
    },
    {
        "title": "I love MERN",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "It just makes sense",
        "comments": [
            {
                "userId": "656c2fe66608877dcd50106a",
                "text": "Yeah I really like it too"
            }
        ],
        "tags": [
            "mern",
            "web dev"
        ]
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
    {
        "title": "I'm a tester",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "userId": "656c2fe66608877dcd50106a",
            }
        ]
    },
    {
        "title": "I'm a tester 2",
        "userId": "656c2fe66608877dcd50106a",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "text": "Yeah I really like it too"
            }
        ]
    }
]

module.exports = { postsData, postsDataBad }