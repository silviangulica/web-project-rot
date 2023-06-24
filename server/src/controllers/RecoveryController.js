const router = require("../routers/router");
const userService = require("../services/UserService");
const { getRequestBody, handleErrors } = require("../utils/RequestUtils");
const {
  UserNotFoundError,
  InvalidCodeError,
  PasswordTooShortError,
} = require("../utils/CustomErrors");
const User = require("../models/User");
const sendMail = require("../services/MailService");
const bcrypt = require("bcryptjs");

// Generates a random code for recovery
const generateRandomCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      code += Math.floor(Math.random() * 10);
    } else {
      code += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
  }

  return code;
};

/* Generates the recovery code and sends it to the user's email
 */
router.add("post", "/recovery", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    let { email } = JSON.parse(body);
    console.log("[\x1b[32mPOST\x1b[0m]: Email request for recovery: " + email);

    let user = await userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError(`User email ${email} was not found`);
    }

    // Generate a code
    let code = generateRandomCode();
    console.log("[\x1b[32mPOST\x1b[0m]: Generated code: " + code);

    // Encrypt code
    let encryptedCode = await bcrypt.hash(code, 10);
    console.log("[\x1b[32mPOST\x1b[0m]: Encrypted code: " + encryptedCode);

    // Update user's recovery code
    let userUpdated = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          "recoveryCode.code": encryptedCode,
          "recoveryCode.expirationTime": Date.now() + 1000 * 60 * 5, // 5 minutes
          needRecovery: "true",
        },
      }
    );
    console.log(userUpdated);

    // Send email with code
    let mailOptions = {
      from: "webrot7@gmail.com",
      to: email,
      subject: "Recovery code",
      text: `Your recovery code is: ${code}`,
    };
    sendMail(mailOptions);

    res.end(JSON.stringify({ email: user.email }));
  } catch (err) {
    handleErrors(err, res);
  }
});

/* Checks if the code is valid and if it is, sends the user's email
 */
router.add("post", "/checkCode", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    let { email, code } = JSON.parse(body);

    let user = await userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError(`User email ${email} was not found`);
    }

    isCodeValid = await bcrypt.compare(code, user.recoveryCode.code);
    if (!isCodeValid) {
      throw new InvalidCodeError(`Invalid code`);
    }

    if (Date.now() > user.recoveryCode.expirationTime) {
      console.log("Crap la timp");
      throw new InvalidCodeError(`Code expired`);
    }

    res.end(JSON.stringify({ email: user.email }));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("post", "/changePassword", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    let { email, password } = JSON.parse(body);

    let user = await userService.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError(`User email ${email} was not found`);
    }

    if (password.length < 6) {
      throw new PasswordTooShortError(`Password too short`);
    }

    let encryptedPassword = await bcrypt.hash(password, 10);
    let userUpdated = await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: encryptedPassword,
          needRecovery: "false",
        },
      }
    );

    console.log(userUpdated);
    console.log("[\x1b[32mPOST\x1b[0m]: Password changed for: " + email);
    res.end(JSON.stringify({ msg: "Succes" }));
  } catch (err) {
    handleErrors(err, res);
  }
});
