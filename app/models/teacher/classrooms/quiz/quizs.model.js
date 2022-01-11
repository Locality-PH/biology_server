module.exports = (mongoose) => {
    var QuizSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            quiz_name: { type: String },
            quiz_question: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quiz_questions",
            }],
        },
        { timestamps: true }
    );

    QuizSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.quiz_id = _id;
        return object;
    });

    const Quiz = mongoose.model("quizs", QuizSchema);
    return Quiz;
};