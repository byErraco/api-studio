const {Schema, model} = require('mongoose');

const ApplicationsSchema = new Schema({
    id_jobs: {type: String, required: true},
    id_applicant: {type: String, required: true},
    name_applicant: {type: String, required: true},
    email_applicant: {type: String, required: true},
    phone_applicant: {type: String, required: true},
    message: {type: String, required: true}
    },
    {
        timestamps: true
    }
    );

module.exports = model('Applicantions', ApplicationsSchema);