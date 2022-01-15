module.exports = (mongoose) => {
    var QuizQuestionSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            question_string: { type: String },
            question_type: { type: String },
            quiz_option: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quiz_options",
            }],
            quiz_answer: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "quiz_options",
            }],
        },
        { timestamps: true }
    );

    QuizQuestionSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.quiz_question_id = _id;
        return object;
    });

    const QuizOption = mongoose.model("quiz_questions", QuizQuestionSchema);
    return QuizOption;
};