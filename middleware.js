const { NotFoundError, BadRequestError } = require("./expressError");

function validateItem(req, res, next) {
    if (!req.body.name || !req.body.price || isNaN(+req.body.price) ) {
        throw new BadRequestError("Must provide name of item and price (as a number)")
    }
    return next();
}

module.exports = { validateItem };