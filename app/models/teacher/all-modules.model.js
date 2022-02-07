module.exports = (mongoose) => {
    var AllModulesSchema = mongoose.Schema(
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: {type: String},
        topic_name : {type: String},
        type: { type: String},
        files: {
          file: { type: Buffer },
          filename: { type: String }
        },
        lesson: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "lessons",
          }
        ],
        whole_content: {
          file: { type: Buffer, required: true },
          filename: { type: String, required: true }
        },
        classwork_code : { type: String}
      },
      { timestamps: true }
    );
  
    const AllModules = mongoose.model("allmodules", AllModulesSchema);
    return AllModules;
  };
  