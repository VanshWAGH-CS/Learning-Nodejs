const { getUser } = require('../service/auth');

function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies?.["token"];
    if(!tokenCookie)
        return next();

    const token = tokenCookie;
    const user = getUser(token);

    req.user = user;
    return next();
}

//admin or ...
function restrictTo(roles){
    return function(req, res, next){
        if(!req.user) return res.redirect('./login');

        if(!roles.includes(req.user.role))return res.end('UnAuthrized');
        return next();
    };
}
async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.header['authorization'];
    if (!userUid) return res.redirect('/login');
    const token = userUid.split('Bearer ')[1];
    const user = getUser(userUid);
    if (!user) return res.redirect("/login");

    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const userUid = req.header['authorization'];
    const token = userUid.split('Bearer ')[1];

   const user = getUser(userUid); 
    req.user = user;
    next();
}

module.exports = {
    checkForAuthentication,
    restrictTo,
};
