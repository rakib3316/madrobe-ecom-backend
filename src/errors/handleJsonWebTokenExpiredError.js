const handleJsonWebTokenExpiredError = (error) => {
  const errorMessages = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Token time is expired",
    errorMessages,
  };
};

export default handleJsonWebTokenExpiredError;
