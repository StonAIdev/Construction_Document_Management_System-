module.exports = (req, res, next) => {
  const { username, user_password } = req.body;
  function validEmail(username) {
    // return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username);

    return true;
  }
  if (req.path === "/register") {
    if (![username, user_password].every(Boolean)) {
      return res.json({
        status: "Missing Credentials",
        message: "Missing Credentials",
      });
    } else if (!validEmail(username)) {
      return res.json({
        status: "Invalid Email",
        message: "Please enter correct email",
      });
    }
  } else if (req.path === "/login") {
    if (![username, user_password].every(Boolean)) {
      return res.json({
        status: "Missing Credentials",
        message: "Missing Credentials",
      });
    } else if (!validEmail(username)) {
      return res.json({
        status: "Invalid Email",
        message: "Please enter correct email",
      });
    }
  }
  next();
};
