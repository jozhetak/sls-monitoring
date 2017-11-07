/**
 * Created by Mac on 10/28/17.
 */
const Model = require('./model');

module.exports = class Invocation extends Model {
    constructor(opts) {
        super(opts);
    }

    static get TABLE () {
        return process.env.INVOCATIONS_TABLE;
    }
}
