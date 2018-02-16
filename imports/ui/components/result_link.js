import './result_link.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Schema } from '../../api/schema.js';

Template.resultLink.onCreated(function () {
  this.autorun(() => {
    new SimpleSchema({
      incidentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      date: {
        type: String
      },
      experience: {
        type: Schema.Experience
      }
    }).validate(Template.currentData());
  });
});


Template.resultLink.helpers({
  formatDate(date) {
    var d = new Date(parseInt(date));
    var string = ""
    string += d.getMonth() + 1 + "/" + d.getDate() + ", " + d.getHours() + ":" + d.getMinutes();
    return string;
  }

});