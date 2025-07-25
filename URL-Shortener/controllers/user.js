const User = require("../models/user");
const { v4: uuidv4 } = require('uuid');
const { setUser } = require("../service/auth");
const bcrypt = require('bcrypt');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
    });
    return res.redirect("/login");
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.render('login', {
            error: "Invalid Username or Password",
        });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render('login', {
            error: "Invalid Username or Password",
        });
    }


    const token = setUser(user);
    res.cookie('token', token);
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};
