const router = require('../routers/router');
const lessonService = require('../services/LessonService');

router.add('post', '/lessons/', async (req, res) => {
  let lessonType = req.params.type;
  
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