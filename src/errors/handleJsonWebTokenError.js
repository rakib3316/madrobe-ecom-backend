const handleJsonWebTokenError = (error) => {
  const errorMessages = [
    {
      path: "",
      message: error.message,
    },
  ];

  const statusCode = 401;
  return {
    statusCode,
    message: "Invalid token",
    errorMessages,
  };
};

export default handleJsonWebTokenError;
