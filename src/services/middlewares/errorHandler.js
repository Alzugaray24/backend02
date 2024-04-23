import EErrors from "../errors-enum.js";

const errorHandler = (error, req, res, next) => {
  console.error("Error detectado entrando al Error Handler");
  console.log("Error:", error);
  console.log("Request:", req);
  console.log("Response:", res);
  console.log("Next:", next);
  switch (error.code) {
    case EErrors.ROUTING_ERROR:
      res.status(404).send({ status: "error", error: "Routing error" });
      break;
    case EErrors.INVALID_TYPES_ERROR:
      res.status(400).send({ status: "error", error: error.message });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(500).send({ status: "error", error: "Database error" });
      break;
    case EErrors.AUTHENTICATION_ERROR:
      res.status(401).send({ status: "error", error: "Authentication error" });
      break;
    case EErrors.FILESYSTEM_ERROR:
      res.status(500).send({ status: "error", error: "Filesystem error" });
      break;
    case EErrors.NETWORK_ERROR:
      res.status(500).send({ status: "error", error: "Network error" });
      break;
    case EErrors.PERMISSIONS_ERROR:
      res.status(403).send({ status: "error", error: "Permissions error" });
      break;
    case EErrors.CONFIGURATION_ERROR:
      res.status(500).send({ status: "error", error: "Configuration error" });
      break;
    case EErrors.SECURITY_ERROR:
      res.status(403).send({ status: "error", error: "Security error" });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error!" });
  }
};

export default errorHandler;
