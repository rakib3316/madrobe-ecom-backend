const handleJsonWebTokenError = (error) => {
  const errorMessages = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid token",
    errorMessages,
  };
};

export default handleJsonWebTokenError;
