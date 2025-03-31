const { pool } = require('../../db-config')
require('dotenv').config()


async function getCareerChoices(userId) {
    const query = 'select careers from career_choices where user_id=$1'
    const results = await pool.query(query, [userId])
    return results
}

async function getAllCareerSteps(input) {
    const query = 'select step_0,step_1,step_2,step_3,step_4,step_5,step_6,step_7,step_8,status from all_career_steps where career_title=$1 and qualification=$2'
    const results = await pool.query(query, [input.careerTitle.trim(), input.qualification.trim()])
    return results
}

async function getCareerQuestions(user) {
    const query = 'select q_id, question, riasec_type from career_test'
    const results = await pool.query(query)
    return results
}

async function insertCareerTestResults(input) {
    let query = 'delete from user_career_test_results where user_id=$1'
    let results = await pool.query(query, [input.userId])

    query = 'insert into user_career_test_results (user_id,career_test_results,creation_date) values ($1,$2,$3)'
    results = await pool.query(query, [input.userId, input.careerInterestData, input.dateCreated])
    return results
}

async function readCareerTestResults(userId) {
    const query = 'select career_test_results from user_career_test_results where user_id=$1'
    const results = await pool.query(query, [userId])
    return results
}

async function readPersonalityTestResults(userId) {

    query = 'select personality_test_results from user_personality_test_results where user_id=$1'
    results = await pool.query(query, [userId])
    return results
}

async function getGeneratedCareers(input) {
    const query = 'select careers from generated_careers where qualification=$1 and personality_trait1=$2 and personality_trait2=$3 and career_interest1=$4 and career_interest2=$5 and user_id=$6'
    const results = await pool.query(query, [input.qualification, input.personalityTrait1, input.personalityTrait2, input.careerInterest1, input.careerInterest2, input.userId])
    return results
}

async function insertCareer(input) {
    let query = 'delete from career_choices where user_id=$1'
    let results = await pool.query(query, [input.userId])

    query = 'insert into career_choices (user_id, careers) values ($1,$2)'
    results = await pool.query(query, [input.userId, input.careers])
    return results
}

async function insertAllSteps(input) {
    let query = 'delete from all_career_steps where career_title=$1 and qualification=$2'
    let results = await pool.query(query, [input.careerTitle.trim(), input.qualification.trim()])

    query = 'insert into all_career_steps (career_title, qualification, step_0, step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8, start_time, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)'
    results = await pool.query(query, [input.careerTitle.trim(), input.qualification.trim(), input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.generatingText, input.startTime, input.status])
    return results
}

async function updateCareerAnswers(input) {
    const query = 'update user_test_answers set career_answers=$1, career_answer_date=$2 where user_id=$3'
    const results = await pool.query(query, [input.answers, input.updatedDate, input.userId])
    return results
}

async function saveAllCareerAnswers(input) {
    const query = 'insert into user_test_answers (career_answers, career_answer_date, user_id) values ($1,$2,$3)'
    const results = await pool.query(query, [input.answers, input.updatedDate, input.userId])
    return results
}

async function getStudentData(input) {
    const query = 'select user_id from users where user_id=$1 and school_id=$2'
    const results = await pool.query(query, [input.studentId, input.schoolId])
    return results
}

async function getQualification(input) {
    const query = 'select qualification from generated_careers where user_id=$1'
    const results = await pool.query(query, [input.userId])
    return results
}

async function saveCareer(input) {
    let query = 'delete from preferred_careers where user_id=$1'
    let results = await pool.query(query, [input.userId])

    query = 'insert into preferred_careers (user_id,school_id, preferred_career, course) values ($1,$2,$3,$4)'
    results = await pool.query(query, [input.userId, input.schoolId, input.careerTitle, input.course])
    return results
}

async function getPreferredCareer(userId) {
    const query = 'select preferred_career from preferred_careers where user_id=$1'
    const results = await pool.query(query, [userId])
    return results
}

async function getCareerPreferences(input) {
    let query, results

    if (input.course) {
        query = 'select preferred_career, count(preferred_career) from preferred_careers where school_id=$1 and course=$2 group by preferred_career '
        results = await pool.query(query, [input.schoolId, input.course])
    }
    else {
        query = 'select preferred_career, count(preferred_career) from preferred_careers where school_id=$1 group by preferred_career '
        results = await pool.query(query, [input.schoolId])
    }
    return results
}

async function fetchCourses(schoolId, registrationToken) {
    const query = 'select course from courses where school_id=(select school_id from schools where school_id=$1 and student_token=$2) order by course'
    const results = await pool.query(query, [schoolId, registrationToken])
    return results
}

async function fetchReportCourses(input) {
    const query = 'select distinct(course) from preferred_careers where school_id=$1 order by course'
    const results = await pool.query(query, [input.schoolId])
    return results
}

module.exports = {
    getCareerChoices, getAllCareerSteps, getCareerQuestions, insertCareerTestResults,
    readCareerTestResults, readPersonalityTestResults, getGeneratedCareers, insertCareer, insertAllSteps,
    saveAllCareerAnswers, updateCareerAnswers, getStudentData, getQualification, saveCareer, getPreferredCareer, getCareerPreferences,
    fetchCourses, fetchReportCourses
}
