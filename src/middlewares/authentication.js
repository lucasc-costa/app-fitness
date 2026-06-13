import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../infra/error.js";

function canRequest(req, res, next) {
  const sendToken = req.headers.authorization?.split(" ")[1];

  jwt.verify(sendToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const UnauthorizedErrorObject = new UnauthorizedError({
          message: "O Token informado está expirado.",
          action: "Realize novamente o Login.",
        });
        return res
          .status(UnauthorizedErrorObject.statusCode)
          .json(UnauthorizedErrorObject);
      } else {
        const UnauthorizedErrorObject = new UnauthorizedError({
          message: "Token informado invalido.",
          action: "Realize novamente o Login.",
        });
        return res
          .status(UnauthorizedErrorObject.statusCode)
          .json(UnauthorizedErrorObject);
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
