
exports.useTimestamps = (schema, options) => {
    schema.add({
        ts: Date,
        tu: Date,
    });

    schema.pre('save', function (next) {
        if (!this.ts) {
            this.ts = this.tu = new Date;
        } else {
            this.tu = new Date;
        }

        next();
    });
};
