require('dotenv').config

const express = require('express')
const urlParser = require('./utilities/urlParser')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// Reddit API
const Snoowrap = require('snoowrap')

const reddit = new Snoowrap({
    userAgent: process.env.USER_AGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
})

/*
reddit.getSubmission('3g8u2t').selftext.then(body => {
    //var subBody = submission.selftext.replace(/(\r\n|\n|\r)/gm, " ")
    console.log(body.replace(/(\r\n|\n|\r)/gm, " "))
})
*/
var commentIndex = 0
var postIndex = 0


reddit.getHot('redditdev', {limit: 1}).then(post => {
    //console.log('First Post: ', post[0].selftext)
    var idx = 0;
    console.log(post)
    //console.log('Second Post: ', post[100].selftext)
})

router.get('/', (req,res) => {
    res.send("Website UP")
})

router.post('/navigate/previous', (req, res) => {
    res.send("Previous")
})

router.post('/navigate/next', (req, res) => {
    res.send("Next")
})

router.post('/navigate/parent', (req, res) => {
    res.send("Parent")
})

router.post('/navigate/child', (req, res) => {
    res.send("Child")
})

module.exports = router