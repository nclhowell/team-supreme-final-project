const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = (req, res) => {
  // #swagger.description = "Return all shoes from collection shoes"
  mongodb
  .getDb()
  .db("project2")
  .collection("shoes")
  .find()
  .toArray((err, lists) => {
    if (err) {
      res.statu(400).json({ message: err });
    }
       res.setHeader("Content-Type", "application/json");
       res.status(200).json(lists);
  });
};

 const getSingle = async (req, res, next) => {
    // #swagger.description = "Return single shoe from collection shoes"
    // Validate shoe ID
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("must use a valid Mongo object ID to locate a shoe");
    }
    const shoeId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db("project2")
      .collection("shoes")
      .find({
        _id: shoeId,
      });

    result.toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(result[0]);
    });
  };

  const createSingle = async (req, res) => {
    // #swagger.description = "Create a single Shoe"
    const shoes = {
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      color: req.body.color,
      gender: req.body.gender,
      surfaceType: req.body.surfaceType,
      terrainType: req.body.terrainType,
      terrainLevel: req.body.terrainLevel,
    };
    
    const response = await mongodb
      .getDb()
      .db("project2")
      .collection("shoes")
      .insertOne(shoes);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res
        .status(550)
        .json(
          response.error ||
            "Some error occurred while creating the new shoe."
        );
    }
  };

  const updateSingle = async (req, res) => {
    // #swagger.description = "Update a single Shoe in collection shoes"
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("must use a valid Mongo object ID to update a Shoe");
    }
    const shoeId = new ObjectId(req.params.id);
    const shoes = {
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      color: req.body.color,
      gender: req.body.gender,
      surfaceType: req.body.surfaceType,
      terrainType: req.body.terrainType,
      terrainLevel: req.body.terrainLevel,
      };
    const response = await mongodb
      .getDb()
      .db("project2")
      .collection("shoes")
      .replaceOne({ _id: shoeId }, shoes);
    console.log(response);
    if ((response.modifiedCount = 1)) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            "Catchall Error Occurred.  Could have been anything!"
        );
    }
  };

  const deleteSingle = async (req, res) => {
    // #swagger.description = "Delete a single shoe in collection shoes"
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("must use a valid Mongo object ID to delete a shoe");
    }
    const shoeId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db("project2")
      .collection("shoes")
      .deleteOne({ _id: shoeId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error ||
            "Some error occurred while deleting the shoe."
        );
    }
  };

  function shoesUnitTest() {
    return "Shoes controller is working...";
  }

  module.exports = {
    getAll,
    getSingle,
    createSingle,
    updateSingle,
    deleteSingle,
    shoesUnitTest
  };