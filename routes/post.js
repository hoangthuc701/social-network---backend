const express= require('express');
const router = express.Router();

const {postsByUser,
    getPosts,
    createPost,
    postById,
    isPoster,
    deletePost,
    updatePost,
    postPhoto,
    getPost,
    like,
    unlike,
    comment,
    unComment
} = require('./../controllers/post')
const {createPostValidator} = require('./../validator/index')
const {requireSignin} = require('./../controllers/auth')
const {userById} = require('./../controllers/user')


//like, unlike
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, unComment);
router.put('/post/like',requireSignin,like);
router.put('/post/unlike',requireSignin,unlike);



router.get('/post/all', getPosts);
//post route
router.get('/post/:postId', getPost)
router.post('/post/new/:userId',requireSignin,createPost);
router.get('/posts/by/:userId',postsByUser);
router.put('/post/:postId',requireSignin, isPoster, updatePost);
router.delete('/post/:postId',requireSignin, isPoster, deletePost);

//getphoto
router.get('/post/photo/:postId',postPhoto);


//any route containing : userId, our app will first exwcute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('postId', postById);
module.exports = router;