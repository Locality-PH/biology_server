module.exports = (mongoose) => {
  var StudentSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      student_name: { type: String, required: true },

      students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
      },
    },
    { timestamps: true }
  );
  StudentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.teacher_id = _id;
    return object;
  });
  const Enrolled = mongoose.model("student_enrolled", StudentSchema);
  return Enrolled;
};
