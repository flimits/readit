// TODO: Add reaction testing.

const postsData = [
    {
        "title": "I like this js framework",
        "author": "",
        "postText": "I've started to learn about React and I really like it. It takes some time to understand it but it's totally worth it",
        "reactions": [
            {
                "author": "",
                "applause": "true",
            },
            {
                "author": "",
                "applause": "true",
            }
        ],
        "tags": [
            "react"
        ]
    },
    {
        "title": "I love React",
        "author": "",
        "postText": "I think it's really cool and super useful. It handles a LOT and makes front end super dynamic",
        "reactions": [
            {
                "author": "",
                "applause": "true",
            },
            {
                "author": "",
                "applause": "true",
            }
        ]
    },
    {
        "title": "I want to make cookies",
        "author": "",
        "postText": "What's everyone's favorite cookie recipe?",
        "reactions": [
            {
                "author": "",
                "applause": "true",
            },
            {
                "author": "",
                "applause": "true",
            }
        ],
        "tags": [
            "baking"
        ]
    },
    {
        "title": "GTA 6 trailer leak??",
        "author": "",
        "postText": "Anyone see the trailer early??",
        "reactions": [
            {
                "author": "",
                "applause": "true",
            },
            {
                "author": "",
                "applause": "true",
            }
        ],
        "tags": [
            "gaming",
            "leak"
        ]
    },
    {
        "title": "I love GraphQL",
        "author": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "author": "",
                "text": "Yeah I really like it too"
            }
        ]
    },
    {
        "title": "I love MERN",
        "author": "",
        "postText": "It just makes sense",
        "comments": [
            {
                "author": "",
                "text": "Yeah I really like it too"
            }
        ],
        "tags": [
            "mern",
            "webdev",
            "react"
        ]
    }
]


const postsDataBad = [
    {
        "author": "",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "postText": "I think react is really neat",
    },
    {
        "title": "I love React",
        "author": "",
    },
    {
        "title": "I'm a tester",
        "author": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "author": "",
            }
        ]
    },
    {
        "title": "I'm a tester 2",
        "author": "",
        "postText": "It's quick to get info from db",
        "comments": [
            {
                "text": "Yeah I really like it too"
            }
        ]
    }
]

module.exports = { postsData, postsDataBad }