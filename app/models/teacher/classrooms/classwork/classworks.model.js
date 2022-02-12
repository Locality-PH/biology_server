module.exports = (mongoose) => {
    var ClassworkSchema = mongoose.Schema(
        {
            _id: { type: mongoose.Schema.Types.ObjectId },
            name: { type: String },
            description: { type: String },
            question: {
                type: [{
                    // { question_id: { type: mongoose.Schema.Types.ObjectId} },
                    string: { type: String },
                    score: { type: Number },
                    type: { type: String },
                    answer: { type: Array },
                    option: { type: Array },
                    img: {
                        file: { type: Buffer },
                        filename: { type: String },
                    },
                }]
            },
            classwork_link: {
                type: String,
                minlength: 6,
                maxlength: 10,
                unique: true,
            },
        },

        { timestamps: true }
    );

    ClassworkSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.classwork_id = _id;
        return object;
    });

    ClassworkSchema.pre("save", async function (next) {
        const randomInteger = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.classwork_link = Math.random()
            .toString(36)
            .substr(2, randomInteger(6, 10));
        next();
    });

    const Classwork = mongoose.model("classworks", ClassworkSchema);
    return Classwork;
};
