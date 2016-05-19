import './home.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';

import '../partials/home_profile.js';
import '../partials/home_subscriptions.js';
import '../components/active_experience.js';
import '../components/result_link.js';

Template.home.onCreated(function() {
  this.subscribe('experiences'); // TODO: make more specific
  this.subscribe('incidents');
});

Template.home.helpers({
  activeExperiences() {
    return Meteor.users.findOne(Meteor.userId()).profile.activeExperiences;
  },
  pastIncidents() {
    return Meteor.user().profile.pastIncidents;
  },
  activeExperienceArgs(experienceId) {
    return {
      experience: Experiences.findOne(experienceId)
    };
  },
  resultLinkArgs(pastIncident) {
    const incident = Incidents.findOne(pastIncident);
    return {
      incidentId: pastIncident,
      experience: Experiences.findOne(incident.experienceId)
    }
  }
});
