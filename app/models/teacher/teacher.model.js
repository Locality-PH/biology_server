module.exports = (mongoose) => {
  var TeacherSChema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      full_name: { type: String },
      classroom: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "classrooms",
        },
      ],
      module: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "allmodules",
        },
      ],
      classwork: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "classworks",
        },
      ],
    },
    { timestamps: true }
  );
  TeacherSChema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.teacher_id = _id;
    return object;
  });
  const Teachers = mongoose.model("teachers", TeacherSChema);
  return Teachers;
};
