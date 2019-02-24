# RedditFocus #
A simple Web App which highlights only one post or comment using React, Node.JS, and Express.

## TODO ##

### Client Side ###

- Parse URL and pass to Server

### Server Side ###

- Take parsed URL and determine course of action
    - Plain Reddit URL?
    - Subreddit URL?
    - Post URL?
    - Comment URL?

- Plain Reddit URL
    - Present first post from /r/popular for navigation (hot/new/controversial/top/rising)
        - Use Hot sorting for now

- Subreddit URL
    - Present subreddit with name
    - Present first post from subreddit (hot/new/controversial/top/rising)
        - Use Hot sorting for now

- Post URL
    - Present Author
    - Present Title and Body of post

- Comment URL
    - Present Author
    - Present Comment Body

### Control flow for each Type ###

- Comment (Comment Object)
    - Access Child
        - Access the first comment in the replies parameter (i.e. comment.replies[0])
    - Access Parent
        - Access via parent ID
    - Access Previous Sibling
        - Access parent comment, find index of original comment
        - Access the adjacent sibling as the previous reply (i.e. comment.replies[index-1])
        - If no siblings exist, continue accessing parent comment until sibling is found
    - Access Next Sibling
        - Access parent comment, find index of original comment
        - Access the adjacent sibling as the previous reply (i.e. comment.replies[index+1])
        - If no siblings exist, continue accessing parent comment until sibling is found

- Post (Submission Object)
    - Access Child
        - Use the .comments[index] parameter from a Submission object
    - Access Parent
        - Use getSubreddit(submission.subreddit.display_name)
    - Access Previous Sibling
        - Use getSubreddit(submission.subreddit.display_name).hot() (or possibly user chosen parameter)
        - Access parent comment, find index of original comment
        - Access the adjacent sibling as the previous post (i.e. TBD)
    - Access Next Sibling
        - Use getSubreddit(submission.subreddit.display_name).hot() (or possibly user chosen parameter)
        - Access parent comment, find index of original comment
        - Access the adjacent sibling as the previous post (i.e. TBD)

- Subreddit (Subreddit Object)
    - Access Child
        - Use the getHot() function
        - Use the getNew() function
        - Use the getRandomSubmission() function
        - Use the getTop() function
        - Use the getControversial() function
        - Use the getRising() function
    - Access Parent?
    - Access Previous Sibline?
    - Access Next Sibling?





### Relevant Snoowrap Functions ###

```
// Get top post in redditdev subreddit
reddit.getHot('redditdev', {limit: 1}).then(post => {
    console.log(post[0].selftext)
})

// Get full submission object
reddit.getSubmission('3g8u2t').fetch().then(submission => {
    var subBody = submission.selftext.replace(/(\r\n|\n|\r)/gm, " ");
    console.log(subBody)
})

// Get body of a submission
reddit.getSubmission('3g8u2t').selftext.then(body => {
    console.log(body.replace(/(\r\n|\n|\r)/gm, " "))
})

//Access name (type) of element
console.log(submission.constructor.name)





```

### Reddit Links ###

**Reddit**: https://www.reddit.com/

**Subreddit**: https://www.reddit.com/r/funny/

**Post**: https://www.reddit.com/r/funny/comments/5gn8ru/guardians_of_the_front_page/

**Comment**: https://www.reddit.com/r/funny/comments/5gn8ru/guardians_of_the_front_page/datqkrx/