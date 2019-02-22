require('dotenv').config

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
router.use(bodyParser.json())

// Reddit API
const Snoowrap = require('snoowrap')
const Snoostorm = require('snoostorm')

const redditConfig = new Snoowrap({
    userAgent: 'user agent web:com.redditfocus:v0.0 (by /u/ndsamu)',
    //refreshToken: process.env.REFRESH_TOKEN,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
})

//const reddit = new Snoostorm(redditConfig)

redditConfig.getSubmission('3g8u2t').title.then(onSuccess)

function onSuccess(result) {
    console.log(result)
}

/*
post.on('post'), (post) => {
    console.log(post)
}


const streamOpts = {
    subreddit: 'all',
    results: 1
}

const comments = reddit.CommentStream(streamOpts)

comments.on('comment', (comment) => {
    console.log(comment.author)
    console.log(comment.body)
})
*/

router.get('/', (req,res) => {
    res.send("Website UP")
})

module.exports = router