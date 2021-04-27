const mongoose = require('mongoose');
const actor = require('../models/actor');
const Actor = require('../models/actor');
const Movie = require('../models/movie');
let print = console.log;
module.exports = {
    getAll: function (req, res) {

        query_empty = Object.keys(req.query).length === 0 && req.query.constructor === Object;

        if (query_empty) {
            Actor.find({}).populate('movies').exec(function(err, actors){
                if (err) {
                    return res.status(404).json(err);
                } else {
                    res.json(actors);
                }
            });
        }

        else {
            let min = new Date().getFullYear() - parseInt(req.query.min);
            let max = new Date().getFullYear() - parseInt(req.query.max);
            
            Actor.find({bYear: {$lte: min, $gte: max}}).populate('movies').exec(function(err, actors){
                if (err) {
                    return res.status(404).json(err);
                } else {
                    res.json(actors);
                }
            })
        }
        
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();
        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },
    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },
    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            res.json(actor);
        });
    },
    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();
            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            })
        });
    },

    //-------------------------------------------------------------------------

    hardDelete: function (req, res) {
        let actorToDelete = req.params.id;

        Actor.findById(actorToDelete, "movies", function(err, docs){
                // Delete Actor First
                Actor.findByIdAndDelete(actorToDelete, function(err2, docs2){res.json(docs2)});

                // Delete corresponding movies
                let moviesarray = docs.movies;
                for (let i=0; i<moviesarray.length; i++) {
                    let movieToDelete = mongoose.Types.ObjectId(moviesarray[i]);
                    Movie.findByIdAndDelete(movieToDelete, function(err3, docs3){})
                }
        });
    },

    deleteOneMovie: function (req, res) {
        let movieToDelete = req.params.mID;
        let actor = req.params.aID;

        Actor.findByIdAndUpdate(actor, {$pull: {movies: movieToDelete}}, function(err, docs){
            if (err) print (err)
            else res.json(docs);
        })
    }
};