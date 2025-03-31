const { pool } = require('../../db-config')
require('dotenv').config()

async function readUser(user) {
    // read user password
    const query = 'select user_id, user_pwd, name from users where username=$1'
    const results = await pool.query(query, [user.username])
    return results
}

async function readUserById(userId) {
    const query = 'select username from users where user_id=$1'
    const results = await pool.query(query, [userId])
    return results
}

async function readUserOTP(user) {
    // read user otp
    const query = 'select user_id, otp, name, is_counsellor, school_id, is_demo_user, course from users where username=$1'
    const results = await pool.query(query, [user.username])
    return results
}

async function updateUserOTP(input) {
    // read user
    const query = 'update users set otp=$1 where username=$2'
    const results = await pool.query(query, [input.otp, input.username])
    return results
}

async function readUserByUsername(username) {
    // read user by username
    const query = 'select user_id from users where username = $1'
    const results = await pool.query(query, [username])
    return results
}

async function createUser(user) {
    // create new user
    const query = 'insert into users (username, name, mobile, creation_date, school_id, is_counsellor, course, is_demo_user) values ($1,$2,$3,$4,$5,$6,$7,$8) returning user_id'
    const results = await pool.query(query, [user.email, user.name, user.mobile, user.creationDate, user.schoolId, user.isCounsellor, user.branch, user.isDemoUser])
    return results
}

async function getTestAnswers(userId) {
    const query = 'select personality_answers, career_answers from user_test_answers where user_id = $1'
    const results = await pool.query(query, [userId])
    return results
}

async function getSchoolIdForCounsellorToken(schoolId, token) {
    const query = 'select school_id, student_limit from schools where counsellor_token = $1 and school_id=$2'
    const results = await pool.query(query, [token, schoolId])
    return results
}

async function getSchoolIdForStudentToken(schoolId, token) {
    const query = 'select school_id, student_limit, is_demo_school from schools where student_token = $1 and school_id=$2'
    const results = await pool.query(query, [token, schoolId])
    return results
}

async function getSchoolStudents(input) {
    const query = "SELECT u.user_Id, u.name, u.username, u.mobile, u.course, CASE WHEN cc.user_id IS NOT NULL THEN 'Yes' ELSE 'No' END AS is_report_available FROM users u LEFT JOIN career_choices cc ON u.user_id = cc.user_id where school_id=$1 and u.is_counsellor='0'";
    const results = await pool.query(query, [input.schoolId])
    return results
}

async function getStudentChatByStudentId(input) {
    const query = 'select question1, answer1, question1_date, question2, answer2, question2_date, question3, answer3, question3_date from counsellor_chats where counsellor_id=$1 and student_id=$2'
    const results = await pool.query(query, [input.counsellorId, input.studentId])
    return results
}

async function saveStudentChatAnswer(input) {
    let query
    if (input.questionNumber == 1) {
        query = 'insert into counsellor_chats (question1, answer1, counsellor_id, student_id, question1_date) values ($1, $2, $3, $4, $5)'
    } else {
        query = 'update counsellor_chats set question' + input.questionNumber + '=$1, answer' + input.questionNumber + '=$2, question' + input.questionNumber + '_date=$5 where counsellor_id=$3 and student_id=$4'
    }
    const results = await pool.query(query, [input.question, input.answer, input.counsellorId, input.studentId, input.dateCreated])
    return results
}

async function getTotalStudentsForSchool(schoolId) {
    const query = "select count(*) from users where school_id=$1 and is_counsellor='0'";
    const results = await pool.query(query, [schoolId])
    return results
}

async function getChat(input) {
    const query = 'select chats, total_token_used from user_chats where user_id=$1'
    const results = await pool.query(query, [input.userId])
    return results
}

async function saveUserChat(input) {
    let query = 'select chats from user_chats where user_id=$1'
    let results = await pool.query(query, [input.userId])
    if (results.rows.length == 1) {
        query = `
    UPDATE user_chats 
    SET chats = jsonb_set(
        chats::jsonb, 
        '{chatHistory}', 
        (chats::jsonb->'chatHistory') || jsonb_build_array(
            jsonb_build_object(
                'question', $1::text, 
                'answer', $2::text, 
                'chatTime', $3::timestamp
            )
        )
    )
    WHERE user_id = $4::integer `;
        results = await pool.query(query, [input.question, input.answer, input.chatTime, input.userId])
    } else {
        query = "insert into user_chats (chats, user_id)  VALUES ($1, $2)"
        results = await pool.query(query, [input.newChat, input.userId])
    }
    return results
}


module.exports = {
    readUser, readUserOTP, updateUserOTP, readUserByUsername, createUser, getTestAnswers, getSchoolIdForCounsellorToken,
    getSchoolIdForStudentToken, getSchoolStudents, getStudentChatByStudentId, saveStudentChatAnswer, readUserById, getTotalStudentsForSchool,
    getChat, saveUserChat
}