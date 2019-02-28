// HUGE PERFORMANCE NOTE!!!! WE CAN CHECK IF A CHILD COMMENT EXISTS BY ONE OF THE PARAMETERS
// WITHIN EACH COMMENT SO THAT WE DON'T HAVE TO MAKE NEEDLESS API CALLS IF NONE EXIST


$( document ).ready(function() {
    $('#previous').submit(async function(event) {
        event.preventDefault();
        $('#childBtn').css('color', '#c2c2c2');
        await getPrevComment();
        updateButtonDisplay();
        updateCommentDisplay();
    });

    $('#next').submit(async function(event) {
        event.preventDefault();
        $('#childBtn').css('color', '#c2c2c2');
        await getNextComment();
        updateButtonDisplay();
        updateCommentDisplay();
        console.log(comment)
    });

    $('#parent').submit(async function(event) {
        event.preventDefault();
        clearCommentDisplay();
        await getParentComment();
        updateButtonDisplay();
        updateCommentDisplay();
    });

    $('#child').submit(async function(event) {
        event.preventDefault();
        clearCommentDisplay()
        await getChildComment();
        updateButtonDisplay();
        updateCommentDisplay();
    });


    test()
})

//////////////////////////////////  Display Functionality   //////////////////////////////////

function clearCommentDisplay() {
    $('#author').html("")
    $('#body').html("")
}

function updateCommentDisplay() {
    $('#author').html(comment.author)
    $('#body').html(comment.body)
}

function updateButtonDisplay() {
    if (commentIndex == 0) {
        $('#prevBtn').css('color', '#c2c2c2')
        $('#prevBtn').css('cursor', 'default')
    } else {
        $('#prevBtn').css('color', '#000000')
        $('#prevBtn').css('cursor', 'pointer')
    }
    if (comment.parent_id == submission.name) {
        if (commentIndex == (submission.comments.length-1)) {
            $('#nextBtn').css('color', '#c2c2c2')
            $('#nextBtn').css('cursor', 'default')
        } else {
            $('#nextBtn').css('color', '#000000')
            $('#nextBtn').css('cursor', 'pointer')
        }
    } else {
        if (commentIndex == (commentCache.length-1) || commentCache.length == undefined) {
            $('#nextBtn').css('color', '#c2c2c2')
            $('#nextBtn').css('cursor', 'default')
        } else {
            $('#nextBtn').css('color', '#000000')
            $('#nextBtn').css('cursor', 'pointer')
        }
    }
    if (comment.parent_id == submission.name) {
        $('#parentBtn').css('color', '#c2c2c2')
        $('#parentBtn').css('cursor', 'default')
    } else {
        $('#parentBtn').css('color', '#000000')
        $('#parentBtn').css('cursor', 'pointer')
    }
    // Avoids eradic behavior when quickly accessing next/prev comments
    const index = commentIndex
    expandComment(comment, 1).then(comment => {
        if (index == commentIndex) {
            if (comment.replies[0] == undefined) {
                $('#childBtn').css('color', '#c2c2c2')
                $('#childBtn').css('cursor', 'default')
            } else {
                $('#childBtn').css('color', '#000000')
                $('#childBtn').css('cursor', 'pointer')
            }
        }
    })
}

function toggleLoadStatus() {
    if (loadStatus) {
        $('#loadStatus').html("")
        loadStatus = false
    } else {
        $('#loadStatus').html("Loading Comments")
        loadStatus = true
    }
}

//////////////////////////////////  HTTP Request Functionality    //////////////////////////////////


async function getSubmission(submissionID) {
    const data = {
        submissionID: submissionID
    }
    var submission
    await $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: window.location + 'submission/get',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(res) {
            submission =  res.submission
        },
        error: function() {
            console.log('Server failed to respond.');
        }
    });
    return submission
}

// Expand the comments on a submission
async function expandSubmission(submissionID, numComments) {
    const data = {
        submissionID: submissionID,
        numComments: numComments
    }
    var submission
    await $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: window.location + 'submission/expandComments',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(res) {
            submission = res.submission
        },
        error: function() {
            console.log('Server failed to respond.');
        }
    });
    return submission
}

async function getComment(commentID) {
    const data = {
        commentID: commentID
    }
    var comment
    await $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: window.location + 'comment/get',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(res) {
            comment = res.comment
        },
        error: function() {
            console.log('Server failed to respond.');
        }
    });
    return comment
}

// Expand the replies to a comment
async function expandComment(comment, numReplies) {
    const data = {
        commentID: comment.name,
        numReplies: numReplies
    }
    var comment
    await $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: window.location + 'comment/expandReplies',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(res) {
            comment = res.comment
        },
        error: function() {
            console.log('Server failed to respond.');
        }
    });
    return comment
}


//////////////////////////////////  Navigation Functionality    //////////////////////////////////


var submission // Stores <= #maxComments comments
var commentCache = {} // Stores a cache of <= #maxReplies replies
var commentIndex = 0
var commentPath = [] // Stores the indexes of subcomments accessed
var maxComments = 50 // 500 (Set to 50 for testing)
var maxReplies = 100
var comment // Used to pass information to client
var hasChild = false// Determines if a comment has a child comment
var loadStatus = false

async function test() {
    toggleLoadStatus()
    await initializeSubmission('z1c9z')
    comment = submission.comments[0]
    toggleLoadStatus()
    updateCommentDisplay()
    updateButtonDisplay()
}

async function initializeSubmission(submissionID) {
    submission = await expandSubmission(submissionID, 20)
    expandSubmissionReplies(submissionID)
}

async function expandSubmissionReplies(submissionID) {
    submission = await expandSubmission(submissionID, maxComments)
}


//////////////////////////////////  Comment Functionality   //////////////////////////////////


// Begins updating the comment cache so that user can quickly access comments then more thorough update
async function updateCommentCache(comment) {
    var parent
    // Initial update for quick access
    toggleLoadStatus()
    parent = await expandComment(comment, 5)
    commentCache = parent.replies
    updateButtonDisplay()
    // Secondary update for larger number of comments
    if (commentCache.length == 5) {
        parent = await expandComment(comment, 20)
        commentCache = parent.replies
        updateButtonDisplay()
    }
    if (commentCache.length > 10) {
        parent = await expandComment(comment, maxReplies)
        commentCache = parent.replies
        updateButtonDisplay()
    }
    toggleLoadStatus()
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

async function getChildComment() {
    // If a reply to this comment exists, fetch it and return
    if (comment.replies[0] != undefined) {
        updateCommentCache(comment)
        const child = await getComment(comment.replies[0].name)
        commentPath.push(commentIndex)
        commentIndex = 0 // Only update commentIndex if a reply existed
        comment = child
    } else { // Try Expanding the replies if reply not found
        comment = await expandComment(comment, 1)
        if (comment.replies[0] != undefined) {
            const child = await getComment(comment.replies[0].name)
            commentPath.push(commentIndex)
            commentIndex = 0 // Only update commentIndex if a reply existed
            comment = child
        }
    }
}

async function getParentComment() {
    // If we have not yet reached the comment ceiling
    if (comment.parent_id != submission.name) {
        const parent = await getComment(comment.parent_id)
        if (parent.parent_id != submission.name) {
            updateCommentCache(parent)
        }
        updateCommentIndex(parent)
        comment = parent
    }
}

async function getPrevComment() {
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
    comment = prev
}

async function getNextComment() {
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
    comment = next
}


////////////////////////////////// TO BE IMPLEMENTED //////////////////////////////////

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