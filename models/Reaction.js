const { Schema, Types } = require('mongoose');

//Reaction //! (SCHEMA ONLY)
const reactionSchema = new Schema (
    {
        reactionID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280,
        },
        username: { // The user that created this reaction
            type: String,
            required: true,
        },    
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: {
            getters: true,
          },
        id: false,
    }
);

module.exports = reactionSchema;