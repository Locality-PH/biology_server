module.exports = (mongoose) => {
    var LessonSchema = mongoose.Schema(
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: {type: String},
        files: {
          file: { type: Buffer, required: true },
          filename: { type: String, required: true }
        },
        classwork_code: {type: String}
      },
      { timestamps: true }
    );
  
    const Lesson = mongoose.model("lessons", LessonSchema);
    return Lesson;
  };
  