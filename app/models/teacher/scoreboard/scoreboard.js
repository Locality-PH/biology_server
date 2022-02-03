module.exports = (mongoose) => {
  var ScoreboardScheme = mongoose.Schema(
    {
      _id: { type: mongoose.Schema.Types.ObjectId },
      score: { type: Number },
      max_score: { type: Number },
      score_list: [Boolean],
      answer_list: { type: Object },
      module:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "modules",
      },
      quiz:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quizs",
      },
      student:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
      },
    },
    { timestamps: true }
  );

  ScoreboardScheme.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.scoreboard_id = _id;
    return object;
  });

  const Scoreboard = mongoose.model("scoreboards", ScoreboardScheme);
  return Scoreboard;
};
