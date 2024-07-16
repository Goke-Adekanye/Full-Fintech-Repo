// Define the collections object
const Collections = {
  CardGenerationService: "CardGenerationService",
};

// Define the service list object
const serviceList = {
  [Collections.CardGenerationService]: Collections.CardGenerationService,
};

// Define the function to validate the request body
const validateRequestBody = (schema, body) => {
  const { error } = schema.validate(body);
  if (error) {
    const formattedError = error.details.reduce((acc, detail) => {
      return detail.message.replace(`"${detail.path[0]}"`, detail.path[0]);
    }, {});
    return formattedError;
  }
  return null;
};

module.exports = { Collections, serviceList, validateRequestBody };
