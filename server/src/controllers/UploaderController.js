const router = require("../routers/router");
const userService = require("../services/UserService");
const authService = require("../services/AuthService");
const { ImgurClient } = require("imgur");
const client = new ImgurClient({ clientId: "5d88ec4ac8bda01" });
const fs = require("fs");

const { handleErrors, getRequestBody } = require("../utils/RequestUtils");

router.add("post", "/upload", async (req, res) => {
  const { fields, files } = await getFormDataFromRequest(req);

  // This is a readable stream of the file wewant to upload
  const fileStream = fs.createReadStream(files.fileToUpload[0].filepath);

  const response = await client.upload({
    image: fileStream,
  });

  if (response.success === false) {
    throw new Error(
      "Error uploading image to Imgur or the type of file is not supported"
    );
  }

  try {
    let id = authService.verifyAuthorization(req, res, "user");
    await userService.updateUser(id, { picture: response.data.link });
  } catch (err) {
    handleErrors(err, res);
  }

  res.end(JSON.stringify({ link: response.data.link }));
});

const getFormDataFromRequest = async (req) => {
  let formidable;
  try {
    formidable = await import("formidable");
  } catch (error) {
    // Handle the error if the module fails to import
    return;
  }
  return new Promise((resolve, reject) => {
    const formData = formidable.default({ multiples: true });

    formData.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });
};
