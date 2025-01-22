const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
      return res.redirect('/user/login');
    }
    next();
  };

  export { authMiddleware }