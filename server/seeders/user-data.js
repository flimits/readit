const usersData = [
    {
        "userName": "nathan",
        "email": "nathan@debug.com",
        "password": "password",
    },
    {
        "userName": "jorgeC",
        "email": "jorge@debug.com",
        "password": "password",
    },
    {
        "userName": "steven",
        "email": "steven@debug.com",
        "password": "password",
    },
    {
        "userName": "deepak",
        "email": "deepak@debug.com",
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