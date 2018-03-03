import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { CONFIG } from '../../api/config.js';
import { Experiences } from '../../api/experiences/experiences.js';
import { Incidents } from '../../api/incidents/incidents.js';
import { Locations } from '../../api/locations/locations.js';
import { Submissions } from "../../api/submissions/submissions";
import { Availability } from "../../api/coordinator/availability";
import { Assignments } from "../../api/coordinator/assignments";
import { log } from '../../api/logs.js';

import { CONSTANTS } from "../../api/testing/testingconstants";
import { onLocationUpdate } from "../../api/locations/methods";
import { createIncidentFromExperience, startRunningIncident } from "../../api/incidents/methods";
import { findUserByUsername } from '../../api/users/methods';
import { Detectors } from "../../api/detectors/detectors";

Meteor.startup(() => {
  SyncedCron.start();
  log.debug("Running in mode: ", CONFIG.MODE );

  if(!(CONFIG.MODE === "DEV" || CONFIG.MODE === "PROD")){
    if(CONFIG.DEBUG){
      clearDatabase();
      createTestData();
    }
  }
});

Meteor.methods({
  freshDatabase() {
    clearDatabase();
    createTestData();
  },
  startTestExperiences(){
    createTestExperiences();
  },
  startStorytime(){

  }
});

function clearDatabase () {
  Meteor.users.remove({});
  Experiences.remove({});
  Submissions.remove({});
  Availability.remove({});
  Assignments.remove({});
  Locations.remove({});
  Incidents.remove({});
  Detectors.remove({});
}

function createTestExperiences(){
  Object.values(CONSTANTS.experiences).forEach(function (value) {
    Experiences.insert(value);
    let incident = createIncidentFromExperience(value);
    startRunningIncident(incident);
  });
  log.info(`Created ${ Experiences.find().count() } experiences`);
}

function createTestData(){
  Object.values(CONSTANTS.users).forEach(function (value) {
    Accounts.createUser(value)
  });
  log.info(`Populated ${ Meteor.users.find().count() } accounts`);

  Object.values(CONSTANTS.detectors).forEach(function (value) {
    Detectors.insert(value);
  });
  log.info(`Populated ${ Detectors.find().count() } detectors`);

  createTestExperiences();

  let uid1 = findUserByUsername('garrett')._id;
  let uid2 = findUserByUsername('garretts_brother')._id;
  let uid3 = findUserByUsername('meg')._id;
  let uid4 = findUserByUsername('megs_sister')._id;
  let uid5 = findUserByUsername('josh')._id;

  Meteor.users.update({
    _id: {$in: [uid1, uid2]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesGarret": true} }
  });

  Meteor.users.update({
    _id: {$in: [uid3, uid4]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesMeg": true} }
  });

  Meteor.users.update({
    _id: {$in: [uid1, uid3, uid5]}
  }, {
    $set: { 'profile.staticAffordances': {"lovesDTR": true} }
  });

  log.debug('FOR LOCATION TESTING RUN >>>> python simulatelocations.py '+ uid1 + " " + uid2 + " " +  uid3);
}
