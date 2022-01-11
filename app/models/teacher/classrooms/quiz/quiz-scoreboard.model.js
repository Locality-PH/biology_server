module.exports = (mongoose) => {
    var QuizScoreboardSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            quiz: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quizs",
            }],
            quiz_question: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quiz_questions",
            }],
            quiz_option: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quiz_options",
            }],
        },
        { timestamps: true }
    );

    QuizScoreboardSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.quiz_scoreboard_id = _id;
        return object;
    });

    const QuizOption = mongoose.model("quiz_questions", QuizScoreboardSchema);
    return QuizOption;
};