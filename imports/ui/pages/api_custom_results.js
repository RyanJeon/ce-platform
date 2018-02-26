import { Template } from "meteor/templating";
import '../components/displayImage.html';


Template.api_custom_results.onCreated(() => {

});

Template.api_custom_results.helpers({
  data() {
    console.log("results data is", this);
    return this;
  },
});

Template.registerHelper( 'getImageById', (data, id) => {
  console.log("data: ", data);
  let image = data.images.find(function(x){
    return x._id === id;
  });
  console.log(image);
  return image;
});

Template.photosByCategories.helpers({
  categories() {
    console.log("results data is", this);
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });

    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    console.log(this.images)
    console.log(this.images.length);
    let specific = this.images.filter(function(x){
      console.log("image for", x.needName, category);
      return x.needName === category;
    });

    console.log("specific", specific);
    return specific;
  }
});

Template.scavengerHunt.helpers({
  categories() {
    let needNames = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    let categoriesSet = new Set(needNames);
    return [...categoriesSet];
  },
  imagesByCategory(category){
    console.log(this.images)
    console.log(this.images.length);
    let specific = this.images.filter(function(x){
      console.log("image for", x.needName, category);
      return x.needName === category;
    });

    console.log("specific", specific);
    return specific;
  },
  getNeed(image){
    return image.needName
  },
  uncompletedNeeds(){
    let needs = this.experience.contributionTypes.map(function(x){
      return x.needName;
    });
    completedNeeds = [];
    for (i=0; i<this.images.length; i++){
      completedNeeds.push(this.images[i].needName);
    }
    let unfinished = needs.filter(x => !completedNeeds.includes(x))
    return unfinished
  },
  numTasksRemaining(){
    return this.images.length + "/" + this.experience.contributionTypes.length + " tasks completed";
  }
});

Template.storybook.helpers({
  notFirst(index){
    return index !==0;
  },
  notLast(index){
    return (index+1) < this.images.length;
  },
  firstSentence(){
    let pageOne = this.experience.contributionTypes.find(function(x) {
      return x.needName === "pageOne";
    });
    return pageOne.toPass.firstSentence;
  },
  previousSentence(index){
    const instance = Template.instance()
    let previousSubmission = instance.data.submissions[index-1];
    return previousSubmission.content.sentence
  }
});

let slideIndex = 1;
function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

Template.storybook.onCreated(function() {
  this.autorun(() => {
    window.onload = function () {
      showSlides(slideIndex);
    }
  });
});

Template.storybook.events({
  'click .prev'(event, instance) {
    event.preventDefault();
    plusSlides(-1)
  },
  'click .next'(event, instance) {
    event.preventDefault();
    plusSlides(1)
  }
});
