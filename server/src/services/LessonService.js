const Lesson = require("../models/Lesson");
const LawLesson = require("../models/LawLesson");

const getLessons = async () => {
  const lessons = await Lesson.find();
  return lessons;
}

const getLessonById = async (id) => {
  const lesson = await Lesson.findOne({ id }, { _id: 0 });
  return lesson;
}

const getLawLessonById = async (id) => {
  const lesson = await LawLesson.findOne({ id }, { _id: 0 });
  return lesson;
}

const updateLessonType = async (id, type) => {
  const lesson = await Lesson.findOne({ id });
  lesson.type = type;
  await lesson.save();
  return lesson;
}

const getLessonsByType = async (type) => {
  const lessons = await Lesson.find({ type });
  return lessons;
}

const deleteLesson = async (id) => {
  const lesson = await Lesson.findByIdAndDelete(id);
  console.log(lesson);
  return lesson;
}

const createLesson = async (lesson) => {
  const newLesson = new Lesson(lesson);
  await newLesson.save();
  return newLesson;
}

module.exports = { 
  getLessons,
  getLessonById,
  updateLessonType,
  getLessonsByType,
  getLawLessonById,
  deleteLesson,
  createLesson
};