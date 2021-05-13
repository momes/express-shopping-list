//add use strict

/** Routes for sample app. */

const express = require("express");

const { items } = require("./fakeDb");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("./expressError");
// didn't end up using badrequesterror, remove this first
const middleware = require("./middleware");//rename this, can just destructure middleware
// and bring in the thing we want

/** GET /items: get list of items
 * 
 * [{"name":"popsicle","price":1.45},
 * {"name":"cheerios","price":3.4}]
 * 
 */
router.get("/", function (req, res, next) {
  return res.json({"items": items});
});

/** POST /items: accept JSON body, add item, and return it 
 * {"name": "popsicle", "price": 1.45} =>
  {added: {name: "popsicle", price: 1.45}}
*/
router.post("/", middleware.validateItem, function (req, res, next) {
    add_item = { //change to camelCase and add let or const
        name: req.body.name,
        price: +req.body.price
    }
    items.push(add_item)
    return res.status(201).json({added: add_item});
  });

/** GET /items: get list of items
 * returns:
 * {"name": "popsicle", "price": 1.45}
 */
router.get("/:name", function (req, res, next) {

  //use req.params since we aren't passing this info in the query string
  let desiredItemName = req.params.name;
  let foundItem = items.find(item => item.name === desiredItemName);

  if (!foundItem){ //could be better as if foundItem === undefined
    throw new NotFoundError("Item not found");
  }

  //in the event that we have multiple items with the same name,
  // we could filter through our items array and get a new array of all
  // matching elements, which we could then loop through 
  // and display in our response
  return res.json(foundItem);
});

/*
PATCH /items/:name: accept JSON body, modify item, return it:

{name: "new popsicle", price: 2.45} =>
  {updated: {name: "new popsicle", price: 2.45}}
*/
router.patch('/:name', middleware.validateItem, function (req, res, next){

  let desiredItemName = req.params.name; //popsicle
  let foundItem = items.find(item => item.name === desiredItemName)

  if (!foundItem){
    throw new NotFoundError("Item not found");
  }

  let newItemName = req.body.name;
  let newItemPrice = req.body.price;

  const {name,price} = req.body; //destructuring

  foundItem.price = +newItemPrice;
  foundItem.name = newItemName;

  return res.json({"updated": foundItem});
})

/*
DELETE /items/:name: delete item:

{message: "Deleted"}
*/
router.delete('/:name', function (req, res, next){

  let desiredItemName = req.params.name;
  let foundItemIdx = items.findIndex(item => item.name === desiredItemName);

  //error message to account for if foundItemIdx === -1
  //throw error

  items.splice(foundItemIdx, 1);

  return res.json({"message": "Deleted"});
})
  

/** DELETE /users/[id]: delete user, return {message: Deleted} */
router.delete("/:id", function (req, res, next) {
  db.User.delete(req.params.id);
  return res.json({ message: "Deleted" });
});

module.exports = router;
