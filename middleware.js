const { NotFoundError, BadRequestError } = require("./expressError");

function validateItem(req, res, next) {

    //make everything in the if condition on 7 a variable
    //can then check if that variable is valid in the if condition

    //change req.body.price to account for when a price is 0
    if (!req.body.name || !req.body.price || isNaN(+req.body.price) ) {
        throw new BadRequestError("Must provide name of item and price (as a number)")
    }
    return next();
}

//could add piece of middleware 

module.exports = { validateItem };