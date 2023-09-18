const Thought = require('../models/Thought');
const User = require('../models/User');


module.exports = {
    async getAllThoughts(req,res){// // TODO: verify route - GOOD
        try {
            const thoughts = await Thought.find();
            if (!thoughts){
                return res.status(404).json({messgage: 'No thoughts exists'});
            }
            res.status(200).json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getThought(req,res){// // TODO: verify route - GOOD
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId});
            if ( !thought ){
                return res.status(404).json({messgage: 'No thought with that ID'});
            }
            res.status(200).json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req,res){// // TODO: verify route - GOOD
        try {
            const {thoughtText, username, userId } = req.body;
            if( !thoughtText || !username || !userId ){
                return res.status(400).json({
                    message: 'Required field missing input: thoughText | username | userID'
                });
            };// required fields
            
            // Checking user exists
            const associatedUser = await User.findOne({
                _id: userId,
                username
            });
            if(!associatedUser){
                return res.status(404).json({
                    message: 'No user with that ID/name'
                });
            };

            const newThought = await Thought.create({
                thoughtText,
                username,
            });
            if(!newThought){
                return res.status(404).json({
                    message: 'New thought was not created'
                });
            };
            
            // Pushing new thoughts to associated user list of thoughts
            const updatedUser = await User.updateOne(
                { username },
                { thoughts: [...associatedUser.thoughts, newThought._id] }
            )

            res.status(200).json(newThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req,res){// // TODO: verify route - GOOD
        try {
            const { thoughtText, username } = req.body
            if( !thoughtText || !username  ){
                return res.status(400).json({
                    message: 'Required field missing input: thoughText | username; did you mean to use delete instead'
                });
            };// required fields

            //Checking username exists
            const associatedUser = await User.findOne({ username })
            if( !associatedUser ){
                return res.status(404).json({ message: "No user found with that username" });
            }
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { thoughtText },
                { new: true }
            ); 

            if( !updatedThought ){
                return res.status(404).json({ message: "No thought found with that ID" });
            }

            res.status(200).json(updatedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req,res){
        try {
            //check if exists
            const deletedThought = await Thought.findOneAndDelete({_id: req.params.thoughtId});
            if(!deletedThought){
                return res.status(404).json({ message: "No thought found with that ID" });
            }
            res.status(200).json(deletedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addToReactions(req,res){
        try {
            const { thoughtId } = req.params;
            const { reactionBody, username } = req.body; //username of the reacter
            if( !reactionBody || !username ){
                return res.status(400).json({
                    message: 'Required field missing input: reactionBody | username'
                });
            };// required fields

            // Checking if thought exists
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $push: {
                    reactions: [{ reactionBody, username }]
                }},
                {new: true},
            );
            
            console.log(updatedThought)
            if (!updatedThought){
                return res.status(400).json({
                    message: "No thought found with that ID"
                });
            };
            res.status(200).json(updatedThought);

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeFromReactions(req,res){
        try {
            // Checking request body
            const { reactionId } = req.body;
            if ( !reactionId ){
                return res.status(400).json({
                    message: 'Required field missing input: reactionId'
                });
            };
                 
            // Fetching thought
            const { thoughtId } = req.params;
            const thought = await Thought.findOne({ _id: thoughtId });

            // Checking reactions length
            if (!thought.reactionCount){
                return res.status(200).json({
                    message: "No reactions found"
                });
            };

            // Checking reaction ID
            let associatedReactions = thought.reactions;
            const reactionIndex = associatedReactions.findIndex( (reaction) =>
                reaction.reactionID.toString() == reactionId 
            );
            console.log("The array at" + reactionIndex + " shows " + associatedReactions[reactionIndex])
            //console.log(associatedReactions)         
            if (reactionIndex < 0){
                return res.status(404).json({
                    message: 'Did not find friend under user list of friends'
                });
            };
            
            //const newReactions = 
            associatedReactions.splice(reactionIndex,1);
            console.log("Here's my new array" + associatedReactions);
            const updatedThought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                { $set:
                    {reactions: [...associatedReactions]},
                },
                { new: true }
            )
            res.status(200).json(updatedThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};