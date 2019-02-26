// GOTG: 5gn8ru
// Random: atxpa0

async function test_getChildComment() {
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

    var baseComment = await getChildComment(submission.comments[0])
    baseComment = baseComment.expandReplies({limit:10, depth:1})
    console.log(baseComment.replies)
    commentIndex = 9 // Starting with comment 10
    var test = baseComment.replies[commentIndex]
    await updateCommentCacheBuffer(test.parent_id)

    for (i=9; i>0; i--) {
        test = await getPrevComment(test)
        if (test.name == baseComment.replies[i-1]) {
            console.log('getPrevComment: Test ' + i + '- Success')
        } else {
            console.log('getPrevComment: Test ' + i + '- Failure')
        }
    }
}

async function test_getNextComment() {
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
    
    console.log('Original Comment: ' + t1_comment.author.name + '\n' + t1_comment.body)

    var test0 = await getNextComment(t1_comment)
    console.log("Test 0: " + test0.author.name + '\n' + test0.body + '\n\n')
    var test1 = await getNextComment(test0)
    console.log("Test 1: " + test1.author.name + '\n' + test1.body + '\n\n')
    var test2 = await getNextComment(test1)
    console.log("Test 2: " + test2.author.name + '\n' + test2.body + '\n\n')
    var test3 = await getPrevComment(test2)
    console.log("Test 3: " + test3.author.name + '\n' + test3.body + '\n\n')
    var test4 = await getPrevComment(test3)
    console.log("Test 4: " + test4.author.name + '\n' + test4.body + '\n\n')
    var test5 = await getPrevComment(test4)
    console.log("Test 5: " + test5.author.name + '\n' + test5.body + '\n\n')
    var test6 = await getPrevComment(test5)
    console.log("Test 6: " + test6.author.name + '\n' + test6.body + '\n\n')
    var test7 = await getChildComment(test6)
    console.log("Test 7: " + test7.author.name + '\n' + test7.body + '\n\n')
    var test8 = await getChildComment(test7)
    console.log("Test 8: " + test8.author.name + '\n' + test8.body + '\n\n')
    var test9 = await getNextComment(test8)
    console.log("Test 9: " + test9.author.name + '\n' + test9.body + '\n\n')
    var test10 = await getNextComment(test9)
    console.log("Test 10: " + test10.author.name + '\n' + test10.body + '\n\n')
    var test11 = await getNextComment(test10)
    console.log("Test 11: " + test11.author.name + '\n' + test11.body + '\n\n')
}

async function test_all() {
    //await initializeSubmission('5gn8ru')
    //await test_getChildComment()
    //await test_getParentComment()
    //await test_getPrevComment()
    //await test_getNextComment()
    await test_commentNavigation()
}

//test_all()