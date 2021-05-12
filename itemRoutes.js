/** Routes for sample app. */

const express = require("express");

const { items } = require("./fakeDb");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("./expressError");
const middleware = require("./middleware");

/** GET /items: get list of items */
router.get("/", function (req, res, next) {
  return res.json(items);
});

/** POST /items: accept JSON body, add item, and return it 
 * {"name": "popsicle", "price": 1.45} =>
  {added: {name: "popsicle", price: 1.45}}
*/
router.post("/", middleware.validateNewItem, function (req, res, next) {
    add_item = {
        name: req.body.name,
        price: +req.body.price
    }
    items.push(add_item)
    return res.json({added: add_item});
  });
  

/** DELETE /users/[id]: delete user, return {message: Deleted} */
router.delete("/:id", function (req, res, next) {
  db.User.delete(req.params.id);
  return res.json({ message: "Deleted" });
});

module.exports = router;
