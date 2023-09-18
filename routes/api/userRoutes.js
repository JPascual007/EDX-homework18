const router = require('express').Router();
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    addToFriends,
    removeFromFriends
  } = require('../../controllers/userController');


//  /api/users
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

//  Route not specified by scope
//  However, convention and the friend routes suggests this to be in effect

//  /api/users/:userId
router
    .route('/:userId')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);


//  /api/users/:userId/friends/:friendId
router
    .route('/:userId/friends/:friendId')
    .post(addToFriends)
    .delete(removeFromFriends);

module.exports = router;