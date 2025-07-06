const user = require("../models/user");

module.exports.signUpUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new user({ email, username });
    const registeredUser = await user.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Food Book");
      res.redirect("/food");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.logInUser = async (req, res) => {
  req.flash("success", "Welcome back to Food Book");
  let redirectUrl = res.locals.redirectUrl || "/food";
  res.redirect(redirectUrl);
};

module.exports.logOutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged Out!");
    res.redirect("/food");
  });
};
