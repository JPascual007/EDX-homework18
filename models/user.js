const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema (
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            validate: {
                validator: (value)=>{ value.match(/[A-Z]/g) }, //TODO: 
                message: 'Please enter a valid email'
            },
        },
        thoughts: [{ // Array of `_id` values referencing the `Thought` model
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{ // Array of `_id` values referencing the `User` model (self-reference)
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get( function (){
        return this.friends.length;
    });

const User = model('user', userSchema);

module.exports = User;