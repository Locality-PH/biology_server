module.exports = (mongoose) => {
    var MyModuleSchema = mongoose.Schema(
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: {type: String},
        files: {
          name : {type: String},
          file: { type: Buffer, required: true },
          filename: { type: String, required: true }
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
  
    const MyModule = mongoose.model("mymodules", MyModuleSchema);
    return MyModule;
  };
  