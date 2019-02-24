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
        console.log("getChildComment: Test1 - Failure")
    }

    var test2 = await getPrevComment(t2_comment3)
    if (test2.name == t2_comment2.name) {
        console.log("getPrevComment: Test2 - Success")
    } else {
        console.log("getChildComment: Test2 - Failure")
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
        console.log("getPrevComment: Test1 - Success")
    } else {
        console.log("getChildComment: Test1 - Failure")
    }

    var test2 = await getNextComment(t2_comment2)
    if (test2.name == t2_comment3.name) {
        console.log("getNextComment: Test2 - Success")
    } else {
        console.log("getNextComment: Test2 - Failure")
    }
}

async function test_navigation() {
    const submission = await reddit.getSubmission('5gn8ru').fetch()
    var t1_comment = submission.comments[0]
    var t2_comment1 = submission.comments[0].replies[0]
    var t2_comment2 = submission.comments[0].replies[1]
    var t3_comment1 = submission.comments[0].replies[0].replies[0]
    var test1 = await getChildComment(t1_comment)
    console.log("Test 1: " + test1.author.name)
    var test2 = await getNextComment(test1)
    console.log("Test 2: " + test2.author.name)
    var test3 = await getNextComment(test2)
    console.log("Test 3: " + test3.author.name)
    var test4 = await getNextComment(test3)
    console.log("Test 4: " + test4.author.name)
    var test5 = await getNextComment(test4)
    console.log("Test 5: " + test5.author.name)
    var test6 = await getNextComment(test5)
    console.log("Test 6: " + test6.author.name)
    var test7 = await getNextComment(test6)
    console.log("Test 7: " + test7.author.name)
    var test8 = await getNextComment(test7)
    console.log("Test 8: " + test8.author.name)
    var test9 = await getNextComment(test8)
    console.log("Test 9: " + test9.author.name)
    var test10 = await getNextComment(test9)
    console.log("Test 10: " + test10.author.name)
    var test11 = await getChildComment(test10)
    console.log("Test 11: " + test11.author.name)
    var test12 = await getParentComment(test11)
    console.log("Test 12: " + test12.author.name)
    var test13 = await getNextComment(test12)
    console.log("Test 13: " + test13.author.name)
    var test14 = await getNextComment(test13)
    console.log("Test 14: " + test14.author.name)
    var test15 = await getNextComment(test14)
    console.log("Test 15: " + test15.author.name)
}

async function test_all() {
    await test_getChildComment()
    await test_getParentComment()
    await test_getPrevComment()
    await test_getNextComment()
    await test_navigation()
}

test_all()


//  Comment Functionality   //

// Returns a Comment Object
async function getChildComment(comment) {
    const child = await reddit.getComment(comment.replies[0]).fetch()
    return child
}

// Returns a Comment Object OR Submission Object (Need to figure out case for Submission)
async function getParentComment(comment) {
    const parent = await reddit.getComment(comment.parent_id).fetch()
    return parent
}

// Parent_id references the "name" parameter of parent comment
async function getPrevComment(comment) {
    var prev = undefined
    const parentComment = await reddit.getComment(comment.parent_id).expandReplies({limit: 15, depth: 1})
    
    parentComment.replies.forEach(function(reply, index) {
        if (comment.name == reply.name && index >= 0) {
            prev = parentComment.replies[index-1]
        }
    })

    return prev
}

async function getNextComment(comment) {
    var next = undefined
    const parentComment = await reddit.getComment(comment.parent_id).expandReplies({limit: 15, depth: 1})
    
    parentComment.replies.forEach(function(reply, index) {
        //commentCache.set(reply.author.name, reply)
        if (comment.name == reply.name && index < 15) {
            next = parentComment.replies[index+1]
        }
    })

    return next
}


// Returns the parent of any object
function getParent(element) {
    switch (element.constructor.name) {
        case 'Subreddit':
            break;
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

// CODE GRAVEYARD

/*

reddit.getSubmission('3g8u2t').selftext.then(body => {
    //var subBody = submission.selftext.replace(/(\r\n|\n|\r)/gm, " ")
    console.log(body.replace(/(\r\n|\n|\r)/gm, " "))
})


reddit.getSubreddit('AskReddit').fetch().then(subreddit => {
    console.log(subreddit.toJSON())
})


reddit.getComment('t3_atmg2l').fetch().then(comment => {
    if (comment.parent_id) {
        console.log("Parent ID")
    } else {
        console.log("No parent ID")
    }
    console.log(comment.parent_id)
})

reddit.getComment('t1_davf98k').fetch().then(comment => {
    console.log(comment.parent_id)
    reddit.getComment(comment.parent_id).fetch().then(comment => {
        console.log(comment.parent_id)
        reddit.getComment(comment.parent_id).fetch().then(comment => {
            console.log(comment.parent_id)
        })
    })
})

async function getSubmission(comment) {
    while (comment.parent_id) {
        await reddit.getComment(comment.parent_id).fetch().then(parent => {
            comment = parent
        })
    }
    return comment

var commentCache = new Map()

if (commentCache.has(comment.author.name)) {
    console.log("Cache hit!")
    return commentCache.get(comment.author.name)
} else {
}

*/