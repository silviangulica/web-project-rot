const router = require("../routers/router");
const lessonService = require("../services/LessonService");
const { handleErrors, getRequestBody } = require("../utils/RequestUtils");
const authService = require("../services/AuthService");
// GET: /lessons?type=avetizare
// Gets all lessons of a certain type
router.add("get", "/lessons", async (req, res) => {
  const lessonType = req.params.type;
  let lessons;
  if (lessonType) {
    lessons = await lessonService.getLessonsByType(lessonType);
  } else {
    try {
      let id = await authService.verifyAuthorization(req, res, "admin");
    } catch (err) {
      handleErrors(err, res);
    }
    lessons = await lessonService.getLessons();
  }
  res.end(JSON.stringify(lessons));
});

// GET: /law-lessons?id=1
// Gets a lesson by id
router.add("get", "/law-lessons", async (req, res) => {
  const lessonId = req.params.id;
  const lesson = await lessonService.getLawLessonById(lessonId);
  res.end(JSON.stringify(lesson));
});

// DELETE: /lessons?id=1
router.add("delete", "/lessons", async (req, res) => {
  try {
    let id = await authService.verifyAuthorization(req, res, "admin");
    let lessonId = req.params.id;
    let lesson = await lessonService.deleteLesson(lessonId);
    res.end(JSON.stringify(lesson));
  } catch (err) {
    handleErrors(err, res);
  }
});

// POST: /lessons
router.add("post", "/lessons", async (req, res) => {
  try {
    let id = await authService.verifyAuthorization(req, res, "admin");
    let body = await getRequestBody(req);
    let lesson = JSON.parse(body).lesson;
    lesson = await lessonService.createLesson(lesson);
    res.end(JSON.stringify(lesson));
  } catch (err) {
    handleErrors(err, res);
  }
});
