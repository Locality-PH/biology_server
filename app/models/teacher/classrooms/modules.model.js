// StandAlone Module Preset with checkbox to pick what module to present
module.exports = (mongoose) => {
  var ModuleSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      module_file: {
        file: { type: Buffer, required: true },
        filename: { type: String, required: true },
        mimetype: { type: String, required: true },
      },
      module_name: { type: String, required: true },
      quiz_link : { type: String, required: true },
      finished: {type: Number, default: 0}
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
