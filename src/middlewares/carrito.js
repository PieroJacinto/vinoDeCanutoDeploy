module.exports = (req,res, next) => {    
    res.locals.cart = []
    next();
}