module.exports = (mongoose) => {
    var questionSchema = mongoose.Schema({
        // { question_id: { type: mongoose.Schema.Types.ObjectId} },
        string: {type: String },
        type: {type: String },
        answer: {type: [String] },
        option: {type: [String] },
    })

    var QuizSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            description: { type: String },
            question: {type: [{
                // { question_id: { type: mongoose.Schema.Types.ObjectId} },
                string: {type: String },
                type: {type: String },
                answer: {type: [String] },
                option: {type: Array}

                // {type: [{
                //     value: {type: String},
                //     isAnswer: {type: Boolean},
                // }], required: false },
            }]},
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

// {
//     _id: { type: mongoose.Schema.Types.ObjectId },
//     quiz_name: { type: String },
//     quiz_question: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "quiz_questions",
//     }],
// },