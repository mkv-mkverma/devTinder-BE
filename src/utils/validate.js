import validator from "validator";
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body ?? {};

  if (!firstName?.trim() || !lastName?.trim()) {
    throw new Error("firstName and lastName is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("emailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const isAllowedEditFields = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );
  return isAllowedEditFields;
};

export { validateSignUpData, validateEditProfileData };
