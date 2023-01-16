import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomauth = token.length < 500;

    let decodedData;

    if (token && isCustomauth) {
      decodedData = jwt.verify(token,process.env.JWT_VERIFY_ID);
      req.userId = decodedData.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
