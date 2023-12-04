// TODO: Add reaction testing.

const postsData = [
    {
        "title": "I love React",
        "userId": "",
        "postText": "I think react is really neat",
        "reactions": [
            {
                "userId": "",
                "applause": "true",
            },
            {
                "userId": "",
                "applause": "true",
            }
        ]
    },
    {
        "title": "I love GraphQL",
        "userId": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "userId": "",
                "text": "Yeah I really like it too"
            }
        ]
    },
    {
        "title": "I love MERN",
        "userId": "",
        "postText": "It just makes sense",
        "comments": [
            {
                "userId": "",
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
        "userId": "",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "userId": "",
    },
    {
        "title": "I'm a tester",
        "userId": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "userId": "",
            }
        ]
    },
    {
        "title": "I'm a tester 2",
        "userId": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "text": "Yeah I really like it too"
            }
        ]
    }
]

module.exports = { postsData, postsDataBad }