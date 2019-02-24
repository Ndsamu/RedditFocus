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



function test_getChildComment() {
    reddit.getSubmission('5gn8ru').fetch().then(async submission => {
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
    })
}

function test_getPrevComment() {
    reddit.getSubmission('5gn8ru').fetch().then(async submission => {
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
    })
}

function test_getNextComment() {
    reddit.getSubmission('5gn8ru').fetch().then(async submission => {
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
    })
}

function test_navigation() {
    reddit.getSubmission('5gn8ru').fetch().then(async submission => {
        var t1_comment = submission.comments[0]
        var t2_comment1 = submission.comments[0].replies[0]
        var t2_comment2 = submission.comments[0].replies[1]
        var t3_comment1 = submission.comments[0].replies[0].replies[0]
        var test1 = await getChildComment(t1_comment)
        var test2 = await getNextComment(test1)
        var test3 = await getNextComment(test2)
        var test4 = await getNextComment(test3)
        var test5 = await getNextComment(test4)
        var test6 = await getNextComment(test5)
        var test7 = await getNextComment(test6)
        var test8 = await getNextComment(test7)
        var test9 = await getNextComment(test8)
        var test10 = await getNextComment(test9)
        var test11 = await getPrevComment(test10)
        var test12 = await getPrevComment(test11)
        var test13 = await getNextComment(test12)
        var test14 = await getNextComment(test13)
        var test15 = await getNextComment(test14)


        var tests = [t1_comment, test1, test2, test3, test4, test5, 
            test6, test7, test8, test9, test10, test11, test12, test13, test14, test15]

        tests.forEach(function(test) {
            console.log(test.author.name)
        })
    })
}

//test_getChildComment()
//test_getParentComment()
//test_getPrevComment()
//test_getNextComment()
test_navigation()


//  Comment Functionality   //

// Returns a Comment Object
async function getChildComment(comment) {
    await reddit.getComment(comment.replies[0]).fetch().then(child => {
        comment = child
    })
    return comment
}

// Returns a Comment Object OR Submission Object (Need to figure out case for Submission)
async function getParentComment(comment) {
    await reddit.getComment(comment.parent_id).fetch().then(parent => {
        comment = parent
    })
    return comment
}

// Parent_id references the "name" parameter of parent comment
async function getPrevComment(comment) {
    var prev = undefined
    await reddit.getComment(comment.parent_id).expandReplies({limit: 15, depth: 1}).then(parentComment => {
        parentComment.replies.forEach(function(reply, index) {
            if (comment.name == reply.name && index >= 0) {
                prev = parentComment.replies[index-1]
            }
        })
    })
    return prev
}

async function getNextComment(comment) {
    var next = undefined
    await reddit.getComment(comment.parent_id).expandReplies({limit: 15, depth: 1}).then(parentComment => {
        parentComment.replies.forEach(function(reply, index) {
            //commentCache.set(reply.author.name, reply)
            if (comment.name == reply.name && index < 15) {
                next = parentComment.replies[index+1]
            }
        })
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

function test_getParentComment() {
    reddit.getSubmission('5gn8ru').fetch().then(async submission => {
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
    })
}

*/