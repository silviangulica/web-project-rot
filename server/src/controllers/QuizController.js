const router = require("../routers/router");

const { generateRandomQuiz } = require("../services/QuizService");
const { getRequestBody } = require("../utils/RequestUtils");
const { verifyIfRequestCameFromUser } = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");

router.add("post", "/quiz", async (req, res) => {
  try {
    let id = req.params.id;
    verifyIfRequestCameFromUser(req, id);
    let quiz = await generateRandomQuiz(id);
    res.end(JSON.stringify(quiz));
  } catch (err) {
    handleErrors(err, res);
  }
});
