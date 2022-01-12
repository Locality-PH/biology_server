module.exports = (mongoose) => {
  var accountSchema = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      email: { type: String },
      uuid: { type: String },
      role: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      midle_name: { type: String },
      full_name: { type: String },
      refresh_token: { type: String },
      access_token: { type: String },
      teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" },
      student: { type: mongoose.Schema.Types.ObjectId, ref: "students" },

      // members: [
      //   [
      //     {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "barangay_members",
      //     },
      //   ],
      // ],
      // barangays: [
      //   [
      //     {
      //       type: mongoose.Schema.Types.ObjectId,
      //       ref: "barangay_members",
      //     },
      //   ],
      // ],
    },
    { timestamps: true }
  );
  accountSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.auth_id = _id;
    return object;
  });
  const Accounts = mongoose.model("accounts_infos", accountSchema);
  return Accounts;
};
