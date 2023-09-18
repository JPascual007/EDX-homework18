const router = require('express').Router();
const {
    getAllThoughts, createThought, updateThought, deleteThought, getThought, addToReactions, removeFromReactions,

} = require('../../controllers/thoughtContoller');

//  /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);


//  /api/thoughts/:thoughtId
router
    .route('/:thoughtId')
    .get(getThought)
    .put(updateThought)
    .delete(deleteThought);

//  /api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(addToReactions) //username+email
    .delete(removeFromReactions);

module.exports = router;