const router = require('../routers/router');
const lessonService = require('../services/LessonService');

router.add('get', /^\/lessons\/(\d+)$/, async (req, res) => {
  const lessonId = req.params[0];
  const lesson = await lessonService.getLessonById(lessonId);
  res.end(JSON.stringify(lesson));
});

router.add('get', '/lessons', async (req, res) => {
  const lessons = await lessonService.getLessons();
  res.end(JSON.stringify(lessons));
});