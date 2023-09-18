const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction')

//Thoughts
const thoughtSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: { // The user that created this thought
            type: String,
            required: true,
        },    
        reactions: [ reactionSchema ], //Array of nested documents created with the `reactionSchema`
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get( function (){
        return this.reactions.length;
    });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;