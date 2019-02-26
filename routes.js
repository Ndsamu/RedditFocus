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

var submission // Stores <= #maxComments comments
var commentCache = {} // Stores a cache of <= #maxReplies replies
var commentIndex = 0
var commentPath = [] // Stores the indexes of subcomments accessed
var maxComments = 500
var maxReplies = 100
var comment // Used to pass information to client

async function test() {
    await initializeSubmission('z1c9z')
    comment = submission.comments[0]
}

async function initializeSubmission(submissionID) {
    console.log("initializeSubmission: Started")
    submission = await reddit.getSubmission(submissionID).expandReplies({limit: 50, depth: 1})
    expandSubmissionReplies(submissionID)
    console.log("initializeSubmission: Complete")
}

async function expandSubmissionReplies(submissionID) {
    console.log("expandingSubmissionReplies: Started")
    submission = await reddit.getSubmission(submissionID).expandReplies({limit: maxComments, depth: 1})
    console.log("expandingSubmissionReplies: Complete")
}


//////////////////////////////////  Comment Functionality   //////////////////////////////////

// Begins updating the comment cache so that user can quickly access comments then more thorough update
async function updateCommentCache(commentID) {
    var parent
    // Initial update for quick access
    parent = await reddit.getComment(commentID).expandReplies({limit: 5, depth: 1})
    commentCache = parent.replies
    console.log("First cache update complete.")
    // Secondary update for larger number of comments
    parent = await reddit.getComment(commentID).expandReplies({limit: 20, depth: 1})
    commentCache = parent.replies
    console.log("Second cache update complete.")
    parent = await reddit.getComment(commentID).expandReplies({limit: maxReplies, depth: 1})
    commentCache = parent.replies
    console.log("Third cache update complete.")
}

// Updates comment index in the case where a parent comment is accessed
// Loops through replies to ensure that index is accurate

async function updateCommentIndex(child) {
    // If parent is not the original submission, access the commentCache
    if (child.parent_id != submission.name) {
        if (commentPath) { // Check if comment index can be referenced from the commentPath
            commentIndex = commentPath.pop()
        } else { // Otherwise, loop through comments for the original and return its index
            for (var i=0; i < (commentCache.length-1); i++) {
                if (commentCache[i].name == child.name) {
                    commentIndex = i
                    break
                }
            }
        }
    // Else, access the submission's comments
    } else {
        if (commentPath) { // Check if comment index can be referenced from the commentPath
            commentIndex = commentPath.pop()
        } else { // Otherwise, loop through comments for the original and return its index
            for (var i=0; i < (submission.comments.length-1); i++) {
                if (submission.comments[i].name == child.name) {
                    commentIndex = i
                    break
                }
            }
        }
    }
}

async function getChildComment(parent) {

    // If a reply to this comment exists, fetch it and return
    if (parent.replies[0]) {
        updateCommentCache(parent.name)
        const child = await reddit.getComment(parent.replies[0].name).fetch()
        commentPath.push(commentIndex)
        commentIndex = 0 // Only update commentIndex if a reply existed
        return child
    } else { // Try Expanding the replies if reply not found
        parent = await parent.expandReplies({limit: 1, depth: 1})
        if (parent.replies[0]) {
            updateCommentCache(parent.name)
            const child = await reddit.getComment(parent.replies[0].name).fetch()
            commentPath.push(commentIndex)
            commentIndex = 0 // Only update commentIndex if a reply existed
            return child
        }
    }
    // Return original if no reply existed
    return parent
}

async function getParentComment(comment) {

    // If we have not yet reached the comment ceiling
    if (comment.parent_id != submission.name) {
        var parent = await reddit.getComment(comment.parent_id).fetch()
        if (parent.parent_id != submission.name) {
            updateCommentCache(parent.parent_id)
        }
        updateCommentIndex(parent)
        return parent
    }
    // If parent is a submission then we have reached the comment ceiling and return the original
    return comment
}

async function getPrevComment(comment) {
    var prev = comment // Default case where no previous comment exists

    // If parent is a comment, access commentCache
    if (comment.parent_id != submission.name && commentIndex > 0) {
        commentIndex -= 1
        prev = commentCache[commentIndex]
    // If parent is a submission, access comments parameter
    } else if (comment.parent_id == submission.name && commentIndex > 0) {
        commentIndex -= 1
        prev = submission.comments[commentIndex]
    }

    return prev
}

async function getNextComment(comment) {
    var next = comment // Default case (last comment reached)

    // If parent is a comment, access commentCache
    if (comment.parent_id != submission.name && commentIndex < (commentCache.length-1)) {
        commentIndex += 1
        next = commentCache[commentIndex]
    // If parent is a submission, access comments parameter
    } else if (comment.parent_id == submission.name && commentIndex < (submission.comments.length-1)) {
        commentIndex += 1
        next = submission.comments[commentIndex]
    }

    return next
}


// Returns the parent of any object
function getParent(element) {
    switch (element.constructor.name) {
        case 'Submission':
            break;
        case 'Comment':
            return getParentComment(element)
            break;
        default:
            return null
    }
}


router.get('/', async (req,res) => {
    await test()
    data = {
        comment: {
            name: comment.author.name,
            body: comment.body
        }
    }
    res.render('pages/index', data)
})

router.post('/navigate/previous', async (req, res) => {
    comment = await getPrevComment(comment)
    data = {
        comment: {
            name: comment.author.name,
            body: comment.body
        }
    }
    res.render('pages/index', data)
})

router.post('/navigate/next', async (req, res) => {
    comment = await getNextComment(comment)
    data = {
        comment: {
            name: comment.author.name,
            body: comment.body
        }
    }
    res.render('pages/index', data)
})

router.post('/navigate/parent', async (req, res) => {
    comment = await getParentComment(comment)
    data = {
        comment: {
            name: comment.author.name,
            body: comment.body
        }
    }
    res.render('pages/index', data)
})

router.post('/navigate/child', async (req, res) => {
    comment = await getChildComment(comment)
    data = {
        comment: {
            name: comment.author.name,
            body: comment.body
        }
    }
    res.render('pages/index', data)
})

module.exports = router