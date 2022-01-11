module.exports = (mongoose) => {
  var StudentSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },

      account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts_infos" },
      fullname: { type: String },
      classroom: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "classrooms",
        },
      ],
    },
    { timestamps: true }
  );
  
  StudentSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.student_id = _id;
    return object;
  });
  const Students = mongoose.model("students", StudentSchema);
  return Students;
};
