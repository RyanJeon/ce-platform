import './api_custom_results.html';
import './storyPageResults.html'
import '../components/displayImage.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import PhotoSwipe from 'photoswipe/dist/photoswipe.min';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.min';

import { Experiences } from '../../api/experiences/experiences.js';
import { Images } from '../../api/images/images.js';
import { TextEntries } from '../../api/text-entries/text-entries.js';
import { Submissions } from '../../api/submissions/submissions.js';

import { Incidents } from '../../api/incidents/incidents.js';


Template.api_custom_results.helpers({
  data2pass(){
    const instance = Template.instance();
    console.log(instance.state.get("incidentId"));
    var imgs =  Images.find({incidentId: instance.state.get("incidentId")}).fetch();
    var text =  TextEntries.find({incidentId: instance.state.get("incidentId")}).fetch();
    var subs = Submissions.find({incidentId: instance.state.get("incidentId")}).fetch();
    return {"images": imgs, "text": text, "submissions": subs}
  },
  template_name() {
    const instance = Template.instance();
    console.log("temp name:", instance.state.get('experience').resultsTemplate);
    return instance.state.get('experience').resultsTemplate;
  },
});
Template.registerHelper( 'getImage', (id) => {
  var img =  Images.findOne({_id: id});
  return {img: Images.findOne({_id: id})};
});
Template.registerHelper( 'getText', (id) => {
  var text = TextEntries.findOne({_id: id});
  console.log('text: ', text.text);
  console.log('getting text for ', id)

  return text.text;
});

Template .registerHelper('var',function(name, value){
  this[name] = value;
});

Template.api_custom_results.onCreated(function() {
  const incidentId = Router.current().params._id;

  this.subscribe('images', incidentId);
  this.subscribe('submissions', incidentId);
  this.subscribe('textEntries.byIncident', incidentId);
  const incHandle = this.subscribe('incidents.byId', incidentId);
  const expHandle = this.subscribe('experiences.byIncident', incidentId);

  this.state = new ReactiveDict();
  this.state.set('incidentId', incidentId);
  this.filter = new ReactiveVar({ incidentId: incidentId});

  this.autorun(() => {
    if (expHandle.ready() && incHandle.ready()) {
      const experience = Experiences.findOne();
      if (experience.route == 'button_game') {
        Router.go(`/results/button_game/${incidentId}`);
      }
      if (experience.route == 'custom') {
        Router.go(`/results/custom/${incidentId}`);
      }
      const incident = Incidents.findOne();
      this.state.set({
        incident: incident,
        experience: experience,
        modules: experience.modules
      });
    }
  });
});


///storybook
var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");

  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

Template.storyPageResults.onCreated(function() {
  this.autorun(() => {
    console.log("loaded")
    window.onload = function () {
      showSlides(slideIndex);
    }
  });
});

Template.storyPageResults.helpers({
  getNextSentenceId(photoIndex){
    const instance = Template.instance()

    var submission = instance.data.submissions[photoIndex-1];
    console.log(submission)
    console.log(submission.content.nextSentence)
    return submission.content.nextSentence

  },
  shouldLoadText(index){
    return index > 0;
  }
});

Template.storyPageResults.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    console.log("LEFTT");
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    console.log("RIGHT");
    plusSlides(1)
  }
});
