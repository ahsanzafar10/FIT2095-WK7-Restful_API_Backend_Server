var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
let print = console.log;


module.exports = {
    getAll: function (req, res) {

        Movie.find({}).populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        })

    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    // ----------------------------------------------------------------------------
    deleteOne: function (req, res) {
        let movieToDelete = mongoose.Types.ObjectId(req.params.id);
        Movie.findByIdAndDelete(movieToDelete, function (err, docs){
            if (err) {print(err)}
            else{res.json(docs)};
        })
    },

    deleteOneActor: function (req, res) {
        let movie = mongoose.Types.ObjectId(req.params.mID);
        let actorToDelete = req.params.aID;

        Movie.findByIdAndUpdate(movie, {$pull: {actors: actorToDelete}}, function(err, docs){
            if (err) print(err);
            else {res.json(docs)}
        })
    },

    addActor: function(req, res) {
        let movie = mongoose.Types.ObjectId(req.params.id);
        let actorToAdd = mongoose.Types.ObjectId(req.body.id);

        Movie.findByIdAndUpdate(movie, {$push: {actors: actorToAdd}}, function (err, docs){
            if (err) print (err);
            else res.json(docs);
        });
    },

    getMoviesBetween: function(req,res) {
        let year1 = parseInt(req.params.year1);
        let year2 = parseInt(req.params.year2);

        Movie.find({year: {$gte: year1, $lte: year2}}, function(err, docs) {
                res.json(docs);
        });
    },

    deleteMoviesBetween: function (req, res) {
        let year1 = parseInt(req.params.year1);
        let year2 = parseInt(req.params.year2);

        Movie.deleteOne({year: {$gte: year1, $lte: year2}}, function(err, docs) {
                res.json(docs);
        });
    }
};