module.exports = (mongoose) => {
    var QuizOptionSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            option: { type: String },
            value: { type: String },
        },
        { timestamps: true }
    );

    QuizOptionSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.test_id = _id;
        return object;
    });

    const QuizOption = mongoose.model("quiz_options", QuizOptionSchema);
    return QuizOption;
};
