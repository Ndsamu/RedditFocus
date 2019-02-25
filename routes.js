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

// GOTG: 5gn8ru
// Random: atxpa0

async function test_getChildComment() {
    const submission = await reddit.getSubmission('5gn8ru').fetch()
    var t1_comment = submission.comments[0]
    var t2_comment = submission.comments[0].replies[0]
    var t3_comment = submission.comments[0].replies[0].replies[0]
    var t4_comment = submission.comments[0].replies[0].replies[0].replies[0]

    var test1 = await getChildComment(t1_comment)
    if (test1.name == t2_comment.name) {
        console.log("getChildComment: Test1 - Success")
    } else {
        console.log("getChildComment: Test1 - Failure")
    }

    var test2 = await getChildComment(t2_comment)
    if (test2.name == t3_comment.name) {
        console.log("getChildComment: Test2 - Success")
    } else {
        console.log("getChildComment: Test2 - Failure")
    }

    var test3 = await getChildComment(t3_comment)
    if (test3.name == t4_comment.name) {
        console.log("getChildComment: Test3 - Success")
    } else {
        console.log("getChildComment: Test3 - Failure")
    }
}

async function test_getParentComment() {
    const submission = await reddit.getSubmission('5gn8ru').fetch()
    var t1_comment = submission.comments[0]
    var t2_comment = submission.comments[0].replies[0]
    var t3_comment = submission.comments[0].replies[0].replies[0]
    var t4_comment = submission.comments[0].replies[0].replies[0].replies[0]

    var test1 = await getParentComment(t4_comment)
    if (test1.name == t3_comment.name) {
        console.log("getParentComment: Test1 - Success")
    } else {
        console.log("getParentComment: Test1 - Failure")
    }

    var test2 = await getParentComment(t3_comment)
    if (test2.name == t2_comment.name) {
        console.log("getParentComment: Test2 - Success")
    } else {
        console.log("getParentComment: Test2 - Failure")
    }

    var test3 = await getParentComment(t2_comment)
    if (test3.name == t1_comment.name) {
        console.log("getParentComment: Test3 - Success")
    } else {
        console.log("getParentComment: Test3 - Failure")
    }
}

async function test_getPrevComment() {
    const submission = await reddit.getSubmission('5gn8ru').fetch()
    var t1_comment = submission.comments[0]
    var t2_comment1 = submission.comments[0].replies[0]
    var t2_comment2 = submission.comments[0].replies[1]
    var t2_comment3 = submission.comments[0].replies[2]
    
    var test1 = await getPrevComment(t2_comment2)
    if (test1.name == t2_comment1.name) {
        console.log("getPrevComment: Test1 - Success")
    } else {
        console.log("getPrevComment: Test1 - Failure")
    }

    var test2 = await getPrevComment(t2_comment3)
    if (test2.name == t2_comment2.name) {
        console.log("getPrevComment: Test2 - Success")
    } else {
        console.log("getPrevComment: Test2 - Failure")
    }
}

async function test_getNextComment() {
    const submission = await reddit.getSubmission('5gn8ru').fetch()
    var t1_comment = submission.comments[0]
    var t2_comment1 = submission.comments[0].replies[0]
    var t2_comment2 = submission.comments[0].replies[1]
    var t2_comment3 = submission.comments[0].replies[2]
    
    var test1 = await getNextComment(t2_comment1)
    if (test1.name == t2_comment2.name) {
        console.log("getNextComment: Test1 - Success")
    } else {
        console.log("getNextComment: Test1 - Failure")
    }

    var test2 = await getNextComment(t2_comment2)
    if (test2.name == t2_comment3.name) {
        console.log("getNextComment: Test2 - Success")
    } else {
        console.log("getNextComment: Test2 - Failure")
    }
}

async function test_commentNavigation() {
    await initializeSubmission('5gn8ru')

    const t1_comment = submission.comments[0]
    
    console.log('Original Comment: ' + t1_comment.author.name)
    var test = await getNextComment(t1_comment)
    for (var i=0; i<20; i++) {
        console.log("Test" + i + ": " + test.author.name)
        test = await getNextComment(test)
    }
}

async function test_expandReplies() {
    submission = await reddit.getSubmission('5gn8ru').expandReplies({limit: 100, depth: 1})
    console.log("Num Comments: " + submission.comments.length)
}

var submission
var commentCache = {}

async function initializeSubmission(submissionID) {
    submission = await reddit.getSubmission(submissionID).expandReplies({limit: 100, depth: 1})
}

async function updateCommentCache(commentID) {
    commentCache = await reddit.getComment(commentID).expandReplies({limit: 10, depth: 1})
}

async function test_all() {
    //await test_getChildComment()
    //await test_getParentComment()
    //await test_getPrevComment()
    //await test_getNextComment()
    await test_commentNavigation()
    //await test_expandReplies()
}

test_all()


//  Comment Functionality   //


async function getChildComment(comment) {
    await updateCommentCache(comment.name)
    var child = comment
    const original = await comment.expandReplies({limit: 1, depth: 1})
    if (original.replies[0]) {
        child = await reddit.getComment(original.replies[0].name).fetch()
    }
    return child
}

async function getParentComment(comment) {
    const parent = await reddit.getComment(comment.parent_id).fetch()
    if (parent.constructor.name == 'Comment') {
        await updateCommentCache(parent.parent_id)
    }
    return parent
}


async function getPrevComment(comment) {
    var prev = comment
    var parent = await reddit.getComment(comment.parent_id).fetch()
    var i

    if (parent.constructor.name == 'Comment') {
        for (i = 1; i<commentCache.length; i++) {
            if (comment.name == commentCache[i].name) {
                prev = commentCache[i-1]
                break
            }
        }
    } else {
        for (i = 1; i<submission.comments.length; i++) {
            if (comment.name == submission.comments[i].name) {
                prev = submission.comments[i-1]
                break
            }
        }
    }

    return prev
}

async function getNextComment(comment) {
    var next = comment
    var parent = await reddit.getComment(comment.parent_id).fetch()
    var i

    if (parent.constructor.name == 'Comment') {
        for (i = 0; i<(commentCache.length-1); i++) {
            if (comment.name == commentCache[i].name) {
                next = commentCache[i+1]
                break
            }
        }
    } else {
        for (i = 0; i<(submission.comments.length-1); i++) {
            if (comment.name == submission.comments[i].name) {
                next = submission.comments[i+1]
                break
            }
        }
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