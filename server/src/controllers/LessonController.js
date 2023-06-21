const router = require('../routers/router');
const lessonService = require('../services/LessonService');

router.add('post', '/lessons/', async (req, res) => {
  let lessonType = req.params.type;
  let idStart = parseInt(req.params.id_start);
  let idEnd = parseInt(req.params.id_end);
  console.log(lessonType, idStart, idEnd);
  for (let i = idStart; i <= idEnd; i++) {
    console.log(i);
    let result = await lessonService.updateLessonType(i, lessonType);
    console.log(result);
  }
  res.end();
});

// GET: /lessons/type/?type=avetizare
router.add('get', "/lessons/type/", async (req, res) => {
  const lessonType = req.params.type;
  const lessons = await lessonService.getLessonsByType(lessonType);
  console.log(lessons, lessonType);
  res.end(JSON.stringify(lessons));
});


router.add('get', "/lessons/", async (req, res) => {
  const lessonId = req.params.id;
  const lesson = await lessonService.getLessonById(lessonId);
  res.end(JSON.stringify(lesson));
});

router.add('get', '/lessons', async (req, res) => {
  const lessons = await lessonService.getLessons();
  res.end(JSON.stringify(lessons));
});