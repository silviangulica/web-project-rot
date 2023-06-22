const router = require("../routers/router");
const lessonService = require("../services/LessonService");

router.add("post", "/lessons/", async (req, res) => {
  let lessonType = req.params.type;
  let idStart = parseInt(req.params.id_start);
  let idEnd = parseInt(req.params.id_end);
  console.log(lessonType, idStart, idEnd);
  for (let i = idStart; i <= idEnd; i++) {
    let result = await lessonService.updateLessonType(i, lessonType);
  }
  console.log("[POST]: \"" + req.url+ "\" responded with = {" + res.statusCode + "}");
  res.end();
});

// GET: /lessons/type/?type=avetizare
router.add("get", "/lessons", async (req, res) => {
  const lessonType = req.params.type;
  const lessons = await lessonService.getLessonsByType(lessonType);
  console.log(lessons, lessonType);
  console.log("[GET]: \"" + req.url+ "\" responded with = {" + lessons + "}");
  res.end(JSON.stringify(lessons));
});

// GET: /law-lessons/?id=1
router.add('get', "/law-lessons/", async (req, res) => {
  const lessonId = req.params.id;
  const lesson = await lessonService.getLawLessonById(lessonId);
  console.log("[GET]: \"" + req.url+ "\" responded with = {" + lesson + "}");
  res.end(JSON.stringify(lesson));
});