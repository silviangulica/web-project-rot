const router = require("../routers/router");

const { generateRandomQuiz } = require("../services/QuizService");
const { getRequestBody } = require("../utils/RequestUtils");
const { verifyIfRequestCameFromUser } = require("../services/AuthService");

router.add("post", "/quiz", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    let { id } = JSON.parse(body);
    verifyIfRequestCameFromUser(req, id);
    let quiz = await generateRandomQuiz();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(quiz));
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});
