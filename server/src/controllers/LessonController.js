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
  res.end();
});

// GET: /lessons/type/?type=avetizare
router.add("get", "/lessons", async (req, res) => {
  const lessonType = req.params.type;
  const lessons = await lessonService.getLessonsByType(lessonType);
  console.log(lessons, lessonType);
  res.end(JSON.stringify(lessons));
});
