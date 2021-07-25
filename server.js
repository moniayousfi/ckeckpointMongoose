const express = require("express");
require('dotenv').config()
const app = express();  
const PORT = process.env.PORT;
const connectdb= require('./config/connectDB')
const Person = require('./models/Person')
//connect to mongodb database 
connectdb();
//Create and Save a Record of a Model:
var createAndSavePerson = function(done) {
    var moniayousfi = new Person({name: "Monia Yousfi", age: 29, favoriteFoods: ["eggs", "fish", "fresh fruit"]});
  
    moniayousfi.save(function(err, data) {
      if (err) return console.error(err);
      done(null, data)
    });
  };


//Create Many Records with model.create()
const arrayOfPeople = [
  { name: "Dalila", age: 28, favoriteFoods: ["Couscous"] },
  { name: "Lassad", age: 38, favoriteFoods: ["Pizza"] },
  { name: "Abdlahfidh", age: 30, favoriteFoods: ["Lasagne"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.log(err);
    done(null, people);
  });
};

//Use model.find() to Search Your Database
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, personFound) => {
    if (err) return console.log(err);
    done(null, personFound);
  });
};



// Use model.findOne() to Return a Single Matching Document from Your Database
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

//Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) =>
    err ? console.log(err) : done(null, data)
  );
};
//Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "Pizza";
  Person.findById(personId, (err, data) => {
    if (err) return console.log(err);
    data.favoriteFoods.push(foodToAdd);
    data.save((err, dataNext) =>
      err
        ? console.error("error saving data: ", err.message)
        : done(null, dataNext)
    );
  });
};

//Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { $set: { age: ageToSet } },
    { new: true },
    (err, data) => (err ? done(err, data) : done(null, data))
  );
};
//Delete One Document Using model.findByIdAndRemove
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) =>
    err ? done(err, data) : done(null, data)
  );
};
//MongoDB and Mongoose - Delete Many Documents with model.remove()
const removeManyPeople = (done) => {
  const nameToRemove = "Lassad";
  Person.remove({ name: nameToRemove }, (err, data) =>
    err ? done(err, data) : done(null, data)
  );
};
//Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
  const foodToSearch = "Couscous";
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, dataNext) =>
      err
        ? console.error("error getting data: ", err.message)
        : done(null, dataNext)
    );
};


app.listen(PORT,(error)=>{
    error? console.error(error):
    console.log(`server is running on port ${PORT}`)
})