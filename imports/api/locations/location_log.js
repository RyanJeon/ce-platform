import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

export const Location_log = new Mongo.Collection('location_log');

Schema.Location_log = new SimpleSchema({
    uid: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        label: 'user id'
    },
    lat: {
        type: Number,
        decimal: true,
        min: -90,
        max: 90
    },
    lng: {
        type: Number,
        decimal: true,
        min: -180,
        max: 180
    },
    time: {
        type: Number,
    },
    affordances: {
        type: [String]
    }
});

Location_log.attachSchema(Schema.Location_log);

Location_log.allow({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});
