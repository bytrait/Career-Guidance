const { pool } = require('../../db-config')
require('dotenv').config()

async function getPersonalityQuestions(user) {
    const query = 'select q_id, question, strongly_disagree, little_disagree, neither_agree_nor_disagree, little_agree, strongly_agree from personality_test'
    const results = await pool.query(query)
    return results
}

async function getQuestionsData(user) {
    const query = 'select q_id, q_reference, question, q_type, strongly_disagree, little_disagree, neither_agree_nor_disagree, little_agree, strongly_agree, facet_and_correlated_trait_adjective from personality_test'
    const results = await pool.query(query)
    return results
}

async function get50PersonalityQuestions(user) {
    const query = 'select q_id, question, q_category from personality_test_50'
    const results = await pool.query(query)
    return results
}

async function insertPersonalityTestResults(input) {

    let query = 'delete from user_personality_test_results where user_id=$1'
    let results = await pool.query(query, [input.userId])

    query = 'delete from user_career_test_results where user_id=$1'
    results = await pool.query(query, [input.userId])

    query = 'delete from career_choices where user_id=$1'
    results = await pool.query(query, [input.userId])

    query = 'insert into user_personality_test_results (user_id,personality_test_results,creation_date) values ($1,$2,$3)'
    results = await pool.query(query, [input.userId, input.personalityData, input.dateCreated])
    return results
}

async function updatePersonalityAnswers(input) {
    const query = 'update user_test_answers set personality_answers=$1, personality_answer_date=$2 where user_id=$3'
    const results = await pool.query(query, [input.answers, input.updatedDate, input.userId])
    return results
}

async function saveAllPersonalityAnswers(input) {
    const query = 'insert into user_test_answers (personality_answers, personality_answer_date, user_id) values ($1,$2,$3)'
    const results = await pool.query(query, [input.answers, input.updatedDate, input.userId])
    return results
}

module.exports = {
    getPersonalityQuestions, getQuestionsData, get50PersonalityQuestions, insertPersonalityTestResults,
    updatePersonalityAnswers, saveAllPersonalityAnswers
}
