import jwt from "jsonwebtoken";

function canRequest(req, res, next) {
  const sendToken = req.headers.authorization?.split(" ")[1];

  jwt.verify(sendToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expirado",
        });
      } else {
        return res.status(401).json({
          message: "Token inválido",
        });
      }
    } else {
      req.user = decoded;
      next();
    }
  });
}

const authentication = {
  canRequest,
};

export default authentication;
