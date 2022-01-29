// StandAlone Module Preset with checkbox to pick what module to present
module.exports = (mongoose) => {
  var ModuleSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      type: { type: String},
      module_id: { type: mongoose.Schema.Types.ObjectId },
      finished: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student_enrolled",
        },
      ]
    },
    { timestamps: true }
  );
  ModuleSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.teacher_id = _id;
    return object;
  });
  const Modules = mongoose.model("modules", ModuleSchema);
  return Modules;
};
