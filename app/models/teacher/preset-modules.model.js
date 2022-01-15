// StandAlone Module Preset with checkbox to pick what module to present
module.exports = (mongoose) => {
  var PresetSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      module_file: {
        file: { type: Buffer, required: true },
        filename: { type: String, required: true },
        mimetype: { type: String, required: true },
      },
      module_name: { type: String, required: true },
      module_path_uri: { type: String, required: true },
    },
    { timestamps: true }
  );
  PresetSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.teacher_id = _id;
    return object;
  });
  const PresetsModule = mongoose.model("presetmodules", PresetSchema);
  return PresetsModule;
};
