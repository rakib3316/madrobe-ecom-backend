const handleDuplicationError = (error) => {
  const email = error.keyValue.email;

  const errorMessages = [
    {
      path: email,
      message: `This email ${email} is being duplicated`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Duplication Error",
    errorMessages,
  };
};

export default handleDuplicationError;
