# RedditFocus
A simple Web App which highlights only one post or comment using React, Node.JS, and Express.

##TODO

### Client Side

- Parse URL and pass to Server

### Server Side

- Take parsed URL and determine course of action
    - Plain Reddit URL?
    - Subreddit URL?
    - Post URL?
    - Comment URL?

- Plain Reddit URL
    - Present first post from /r/popular for navigation (hot/new/controversial/top/rising)
        - Use Hot sorting for now

- Subreddit URL
    - Present first post from subreddit (hot/new/controversial/top/rising)
        - Use Hot sorting for now

- Post URL
    - Present Title and Body of post

- Comment URL
    - 



### Relevant Snoowrap Functions

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



```

### Reddit Links

**Reddit**: https://www.reddit.com/

**Subreddit**: https://www.reddit.com/r/funny/

**Post**: https://www.reddit.com/r/funny/comments/5gn8ru/guardians_of_the_front_page/

**Comment**: https://www.reddit.com/r/funny/comments/5gn8ru/guardians_of_the_front_page/datqkrx/