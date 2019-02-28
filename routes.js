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

var requests = 0
var start = new Date().getTime()
var end

router.get('/', (req,res) => {
    res.render('pages/index')
})

router.post('/submission/get', async (req, res) => {
    const submission = await reddit.getSubmission(req.body.submissionID).fetch()
    const data = {
        submission: submission
    }
    res.json(data)
    requests+=1
    end = new Date().getTime()
    console.log('Average Comments/Second: ' + requests/(end-start))
})

router.post('/submission/expandComments', async (req, res) => {
    const submission = await reddit.getSubmission(req.body.submissionID).expandReplies({limit: req.body.numComments, depth: 1})
    const data = {
        submission: submission
    }
    res.json(data)
    requests+=submission.comments.length
    end = new Date().getTime()
    console.log('Average Comments/Second: ' + requests/(end-start))
})

router.post('/comment/get', async (req, res) => {
    const comment = await reddit.getComment(req.body.commentID).fetch()
    const data = {
        comment: comment
    }
    res.json(data)
    requests+=1
    end = new Date().getTime()
    console.log('Average Comments/Second: ' + requests/(end-start))
})

router.post('/comment/expandReplies', async (req, res) => {
    const comment = await reddit.getComment(req.body.commentID).expandReplies({limit: req.body.numReplies, depth: 1})
    const data = {
        comment: comment
    }
    res.json(data)
    requests+=comment.replies.length
    end = new Date().getTime()
    console.log('Average Comments/Second: ' + requests/(end-start))
})

module.exports = router