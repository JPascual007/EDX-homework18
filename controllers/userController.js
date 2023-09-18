const User = require('../models/User');

module.exports = {
    async getAllUsers(req,res){ // // TODO: verify route - GOOD
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getUser(req,res){ // // TODO: verify route - GOOD
        try {
            const user = await User.findOne({ 
                _id: req.params.userId,
            });

            if (!user) {
                return res.status(404).json({
                    message: 'No user with that ID',
                 });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req,res){ // // TODO: verify route - GOOD
        try {
            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
            });
            res.status(200).json(newUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateUser(req,res){ // // TODO: verify route - GOOD
        try {
            const userId = req.params.userId;
            const { username, email }= req.body;
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { username, email },
                { new: true }
            );
            // console.log(user)
            if (!user) {
                return res.status(404).json({
                    message: 'No user with that ID',
                });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteUser(req,res){  // TODO: verify route - GOOD AND remove associated thoughts (import to use)
        try {
            const deletingUser = await User.findOneAndDelete({
                _id: req.params.userId,
            });
            
            if(!deletingUser){
                res.status(404).json({
                    message: 'No user with that ID',
                }); 
            }
            res.status(200).json(deletingUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addToFriends(req,res){ // // TODO: verify route - GOOD
        try {   
            const { userId, friendId } = req.params;
            const existingUser = await User.findOne({ _id: userId });

            if ( !existingUser ) {
                return res.status(404).json({
                    message: 'No user with that ID'
                });
            };
            console.log("User identified");
            
            let { friends } = existingUser;
            const friendIndex = friends.findIndex( (friend) => 
                friend == friendId
            );
            if ( friendIndex >= 0 ){
                return res.status(400).json({
                    message: 'User already is friend with that user'
                });
            };
            console.log("User is not already friends");

            const newFriend = await User.findOne({ _id: friendId });
            if ( !newFriend ){
                return res.status(404).json({
                    message: 'No friend with that ID'
                });
            };
            console.log("Friend user identified");

            friends = [...friends, newFriend._id];
            
            const updatedUser = await User.updateOne(
                { _id: userId },
                { friends },
                { new: true }
            )
            if ( !updatedUser ){
                return res.status(500).json("Update failed");
            }
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeFromFriends(req,res){ // TODO: verify route -
        try {

            const { userId, friendId } = req.params;
            const existingUser = await User.findOne({ _id: userId });
            if ( !existingUser ) {
                return res.status(404).json({
                    message: 'No user with that ID'
                });
            };
            console.log("User identified")

            if ( !existingUser.friendCount ){
                return res.status(404).json({
                    message: 'Did not find friend under user list of friends'
                });
            };
            console.log("User friend group confirmed")

            const { friends } = existingUser;
            const friendIndex = friends.findIndex( (friend) => {
                return friend == friendId;
            });
            console.log(friendIndex)
            if (friendIndex < 0){
                return res.status(404).json({
                    message: 'Did not find friend under user list of friends'
                });
            };

            const newFriend = await User.findOne({ _id: friendId });
            if ( !newFriend ){
                return res.status(404).json({
                    message: 'No friend with that ID'
                });
            };
            console.log("Friend user identified")

            //! NOTE: Splice can use negative values to check from right side of array               
            friends.splice(friendIndex, 1)

            const updatedUser = await User.updateOne(
                { _id: userId },
                { friends },
                { new: true }
            )
            if ( !updatedUser ){
                return res.status(500).json("Update failed");
            }
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};