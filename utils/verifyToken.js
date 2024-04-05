import Jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) res.status(401).json("you are not authenticated!");
  Jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) res.status(403).json("token is not valid!");
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      res.status(403).json("you are not authrized!")
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json("you are not authrized!")
    }
  })
}
