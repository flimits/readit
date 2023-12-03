const usersData = [
    {
        "userName": "tester1",
        "email": "test@debug.com",
        "password": "password",
    },
]

const usersDataBad = [
    {
        "userName": "test",
        "email": "test@debug.com",
        "password": "password"
    },
    {
        "userName": "tester2",
        "email": "test@debug.com",
        "password": "pass"
    },
    {
        "userName": "tester3",
        "email": "test@debug",
        "password": "password"
    },
    {
        "userName": "tester4",
        "email": "test@debug",
    },
    {
        "userName": "tester5",
        "password": "password"
    },
    {
        "email": "test@debug",
        "password": "password"
    }
]

module.exports = { usersData, usersDataBad }