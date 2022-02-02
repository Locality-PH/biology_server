module.exports = (mongoose) => {
    var ModuleLessonSchema = mongoose.Schema(
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        lesson_id: { type: mongoose.Schema.Types.ObjectId },
        finished: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student_enrolled",
          },
        ]
      },
      { timestamps: true }
    );
  
    const ModuleLesson = mongoose.model("modulelessons", ModuleLessonSchema);
    return ModuleLesson;
  };
  