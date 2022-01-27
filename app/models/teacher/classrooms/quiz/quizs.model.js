module.exports = (mongoose) => {
    var questionSchema = mongoose.Schema({
        // { question_id: { type: mongoose.Schema.Types.ObjectId} },
        string: { type: String },
        type: { type: String },
        answer: { type: [String] },
        option: { type: [String] },
    })

    var QuizSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            description: { type: String },
            question: {
                type: [{
                    // { question_id: { type: mongoose.Schema.Types.ObjectId} },
                    string: { type: String },
                    type: { type: String },
                    answer: { type: Array },
                    option: { type: Array }
                }]
            },
            quiz_link: {
                type: String,
                minlength: 6,
                maxlength: 10,
                unique: true,
            },
        },

        { timestamps: true }
    );

    QuizSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.quiz_id = _id;
        return object;
    });

    QuizSchema.pre("save", async function (next) {
        const randomInteger = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.quiz_link = Math.random()
            .toString(36)
            .substr(2, randomInteger(6, 10));
        next();
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