module.exports = (mongoose) => {
  var ClassroomSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String },
      teacher_name: { type: String},
      description: { type: String },
      response: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "responses",
        },
      ],
      module: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "modules",
        },
      ],
      quiz: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "quizs",
        },
      ],
      student: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student_enrolled",
        },
      ],
      class_code: {
        type: String,
        minlength: 6,
        maxlength: 10,
        unique: true,
      },
      section_name: { type: String },
      access_token: { type: String },
    },
    { timestamps: true }
  );
  
  ClassroomSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.teacher_id = _id;
    return object;
  });

  ClassroomSchema.pre("save", async function (next) {
    const randomInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    this.class_code = Math.random()
      .toString(36)
      .substr(2, randomInteger(6, 10));
    next();
  });
  const ClassRooms = mongoose.model("classrooms", ClassroomSchema);
  return ClassRooms;
};
