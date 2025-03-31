const bcrypt = require('bcryptjs')
const httpStatus = require('http-status-codes')
const logger = require('../logger/logger')
require('dotenv').config()

const { getPersonalityQuestions, getQuestionsData, get50PersonalityQuestions, insertPersonalityTestResults,
    updatePersonalityAnswers, saveAllPersonalityAnswers } = require('./personality-db-helper')
const { INTERNAL_SERVER_ERROR } = require('../../common/common-constants')
const { PERSONALITY_SUCCESS_MSGS } = require('./personality-constants')

async function getQuestions(input) {
    try {
        logger.debug.debug('in personality-helper getQuestions')
        const results = await getPersonalityQuestions();
        let questionData = [];
        results.rows.forEach((element, index) => {
            if ((process.env.DEMO == 'true' || input.isDemoUser == '1') && index > 4) {
                return
            }
            questionData.push({
                qId: element.q_id,
                question: element.question,
                stronglyDisagree: element.strongly_disagree,
                littleDisagree: element.little_disagree,
                neitherAgreeNorDisagree: element.neither_agree_nor_disagree,
                littleAgree: element.little_agree,
                stronglyAgree: element.strongly_agree
            });

        });

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: PERSONALITY_SUCCESS_MSGS.QUESTION_RETRIEVED, questionData: questionData }
        }
        return result

    } catch (error) {
        logger.debug.debug('in personality-helper getQuestions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function get50Questions(input) {
    try {
        logger.debug.debug('in personality-helper get50Questions')
        const results = await get50PersonalityQuestions();
        let questionData = [];
        results.rows.forEach((element, index) => {
            if ((process.env.DEMO == 'true' || input.isDemoUser == '1') && index > 4) {
                return
            }
            questionData.push({
                qId: element.q_id,
                question: element.question,
                category: element.q_category,
            });
        });

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: PERSONALITY_SUCCESS_MSGS.QUESTION_RETRIEVED, questionData: questionData }
        }
        return result

    } catch (error) {
        logger.debug.debug('in personality-helper get50Questions server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}


async function generatePersonalityTestResults(input) {
    try {
        let answers = input.answers; // Example {'qId1': 'answer1','qId2': 'answer2','qId3': 'answer3',}
        if (process.env.DEMO == 'true' || input.isDemoUser == '1') {
            answers = {
                "1": 5, "2": 5, "3": 5, "4": 5, "5": 5, "6": 5, "7": 5, "8": 5, "9": 5, "10": 5,
                "11": 5, "12": 4, "13": 2, "14": 2, "15": 2, "16": 2, "17": 2, "18": 4, "19": 2, "20": 2,
                "21": 4, "22": 2, "23": 4, "24": 4, "25": 2, "26": 2, "27": 4, "28": 2, "29": 2, "30": 2,
                "31": 4, "32": 2, "33": 2, "34": 4, "35": 4, "36": 2, "37": 4, "38": 2, "39": 2, "40": 2,
                "41": 4, "42": 2, "43": 4, "44": 2
            }
        }
        const results = await getQuestionsData();

        let scoreByQuestionType = {};
        let scoreByCategoryType = {};
        let qType, qId, facetCcorrelatedTraitAdjective;
        for (let i = 0; i < results.rowCount; i++) {
            qId = results.rows[i].q_id;
            qType = results.rows[i].q_type;
            facetCcorrelatedTraitAdjective = results.rows[i].facet_and_correlated_trait_adjective
            if (scoreByQuestionType[qType] == null) {
                scoreByQuestionType[qType] = 0;
            }
            scoreByQuestionType[qType] += parseInt(answers[qId]);

            if (scoreByCategoryType[qType] == null) {
                scoreByCategoryType[qType] = {};
            }

            if (scoreByCategoryType[qType][facetCcorrelatedTraitAdjective] == null) {
                scoreByCategoryType[qType][facetCcorrelatedTraitAdjective] = 0;
            }
            scoreByCategoryType[qType][facetCcorrelatedTraitAdjective] += parseInt(answers[qId]);
        }

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: PERSONALITY_SUCCESS_MSGS.RESULT_GENERATED, scoreByQuestionType: scoreByQuestionType, scoreByCategoryType: scoreByCategoryType }
        }
        return result
    } catch (error) {
        logger.debug.debug('in personality-helper generatePersonalityTestResults server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function generate50PersonalityTestResults(input) {
    try {
        let answers = input.answers; // Example {'qId1': 'answer1','qId2': 'answer2','qId3': 'answer3',}
        if (process.env.DEMO == 'true' || input.isDemoUser == '1') {
            answers = {
                "1": 5, "2": 5, "3": 5, "4": 5, "5": 5, "6": 5, "7": 5, "8": 5, "9": 5, "10": 5,
                "11": 5, "12": 4, "13": 2, "14": 2, "15": 2, "16": 2, "17": 2, "18": 4, "19": 2, "20": 2,
                "21": 4, "22": 2, "23": 4, "24": 4, "25": 2, "26": 2, "27": 4, "28": 2, "29": 2, "30": 2,
                "31": 4, "32": 2, "33": 2, "34": 4, "35": 4, "36": 2, "37": 4, "38": 2, "39": 2, "40": 2,
                "41": 4, "42": 2, "43": 4, "44": 2, "45": 2, "46": 2, "47": 4, "48": 2, "49": 4, "50": 2
            }
        }

        const scoreE = 20 + parseInt(answers[1]) - parseInt(answers[6]) + parseInt(answers[11]) - parseInt(answers[16]) + parseInt(answers[21]) - parseInt(answers[26]) + parseInt(answers[31]) - parseInt(answers[36]) + parseInt(answers[41]) - parseInt(answers[46])
        const scoreA = 14 - parseInt(answers[2]) + parseInt(answers[7]) - parseInt(answers[12]) + parseInt(answers[17]) - parseInt(answers[22]) + parseInt(answers[27]) - parseInt(answers[32]) + parseInt(answers[37]) + parseInt(answers[42]) + parseInt(answers[47])
        const scoreC = 14 + parseInt(answers[3]) - parseInt(answers[8]) + parseInt(answers[13]) - parseInt(answers[18]) + parseInt(answers[23]) - parseInt(answers[28]) + parseInt(answers[33]) - parseInt(answers[38]) + parseInt(answers[43]) + parseInt(answers[48])
        const scoreN = 38 - parseInt(answers[4]) + parseInt(answers[9]) - parseInt(answers[14]) + parseInt(answers[19]) - parseInt(answers[24]) - parseInt(answers[29]) - parseInt(answers[34]) - parseInt(answers[39]) - parseInt(answers[44]) - parseInt(answers[49])
        const scoreO = 8 + parseInt(answers[5]) - parseInt(answers[10]) + parseInt(answers[15]) - parseInt(answers[20]) + parseInt(answers[25]) - parseInt(answers[30]) + parseInt(answers[35]) + parseInt(answers[40]) + parseInt(answers[45]) + parseInt(answers[50])

        let ePersonality = {}, aPersonality = {}, cPersonality = {}, nPersonality = {}, oPersonality = {}
        ePersonality['score'] = scoreE
        aPersonality['score'] = scoreA
        cPersonality['score'] = scoreC
        nPersonality['score'] = scoreN
        oPersonality['score'] = scoreO

        ePersonality['type'] = 'Extroversion'
        aPersonality['type'] = 'Agreeableness'
        cPersonality['type'] = 'Conscientiousness'
        nPersonality['type'] = 'Neuroticism'
        oPersonality['type'] = 'Openness'
        if (scoreE >= 27 && scoreE <= 40) {
            ePersonality['strength'] = 'Extrovert'
            ePersonality['description'] = [
                'Sociable: You\'re really good at making friends and enjoy spending time with others, whether it\'s at parties, school, or social events.',
                'Outgoing: You\'re confident and comfortable in social situations, and you\'re often the life of the party or the center of attention.',
                'Energetic: You have lots of energy and enthusiasm, and you\'re always up for trying new activities and meeting new people.',
                'Charismatic: You have a magnetic personality and can easily charm others with your friendly and approachable demeanor.',
                'Assertive: You\'re not afraid to speak up and take charge in group settings, and you\'re often seen as a leader among your peers.'
            ]
        }
        else if (scoreE >= 14 && scoreE <= 26) {
            ePersonality['strength'] = 'Ambivert'
            ePersonality['description'] = [
                'Friendly: You\'re approachable and enjoy spending time with both friends and alone, striking a balance between socializing and time for yourself.',
                'Versatile: You can adapt to different social situations, sometimes enjoying being the center of attention and other times preferring quieter moments with close friends.',
                'Cooperative: You work well with others and enjoy collaborating on group projects or activities, but you also appreciate having time for individual pursuits.',
                'Balanced: You find a good middle ground between being outgoing and reserved, knowing when to speak up and when to listen, depending on the situation.',
                'Considerate: You\'re mindful of others\' feelings and preferences, making an effort to include everyone and create a comfortable atmosphere in social settings.'
            ]
        }
        else if (scoreE >= 0 && scoreE <= 13) {
            ePersonality['strength'] = 'Introvert'
            ePersonality['description'] = [
                'Thoughtful: You\'re good at reflecting on your thoughts and feelings, and you enjoy spending time alone to recharge and think deeply.',
                'Independent: You\'re comfortable doing things on your own and don\'t always need to be around others to feel happy or fulfilled.',
                'Observant: You have a keen eye for detail and enjoy watching and learning from your surroundings, even if you\'re not actively participating in social interactions.',
                'Reflective: You take time to ponder things before making decisions, and you value introspection and self-discovery.',
                'Calm: You have a serene and peaceful demeanor, and you\'re able to maintain your composure even in hectic or busy environments.'
            ]
        }

        if (scoreA >= 27 && scoreA <= 40) {
            aPersonality['strength'] = 'Compassionate'
            aPersonality['description'] = [
                'Kindness: You\'re really good at being compassionate and considerate towards others, always ready to lend a helping hand or offer support.',
                'Friendliness: You\'re friendly and approachable, making it easy for others to feel comfortable around you and to strike up conversations.',
                'Cooperation: You work well with others and enjoy being part of a team, contributing your ideas and supporting your peers\' efforts.',
                'Empathy: You\'re good at understanding how others feel and showing empathy towards their emotions, which helps you build strong and meaningful relationships.',
                'Patience: You\'re patient and understanding, willing to listen to others and give them the time and space they need to express themselves.',]
        }
        else if (scoreA >= 14 && scoreA <= 26) {
            aPersonality['strength'] = 'Adaptable'
            aPersonality['description'] = [
                'Balanced: You\'re able to stand up for yourself when needed, but you also know when it\'s important to compromise and get along with others.',
                'Considerate: You care about others\' feelings and opinions, but you also prioritize your own needs and boundaries.',
                'Fairness: You believe in treating others with respect and fairness, and you try to find solutions that work for everyone involved.',
                'Diplomacy: You\'re good at resolving conflicts and finding common ground, even in situations where there are different viewpoints.',
                'Independence: You\'re able to make decisions for yourself and stand by your beliefs, even if they differ from those of others.',
            ]
        }
        else if (scoreA >= 0 && scoreA <= 13) {
            aPersonality['strength'] = 'Independent'
            aPersonality['description'] = [
                'Independence: You\'re confident in your own beliefs and decisions, and You\'re not easily swayed by others\' opinions or expectations.',
                'Assertiveness: You\'re able to speak up for yourself and advocate for your needs and preferences without being overly concerned about pleasing others.',
                'Critical Thinking: You\'re good at analyzing situations and making decisions based on logic and reasoning, rather than being influenced by others\' emotions.',
                'Self-Reliance: You\'re capable of taking care of yourself and handling challenges on your own, without relying too much on help from others.',
                'Individuality: You embrace your uniqueness and value being true to yourself, even if it means standing out from the crowd.',
            ]
        }

        if (scoreC >= 27 && scoreC <= 40) {
            cPersonality['strength'] = 'Dependable'
            cPersonality['description'] = [
                'Responsibility: You\'re very good at taking care of your tasks and getting things done on time without needing reminders.',
                'Organized: You keep your things neat and tidy, and you have a system for staying on top of your schoolwork and activities.',
                'Reliability: People can always count on you to do what you say you\'ll do, and You\'re seen as someone who keeps their word.',
                'Persistence: You don\'t give up easily, even when faced with challenges or setbacks, and you keep working hard to achieve your goals.',
                'Self-discipline: You\'re able to control your impulses and stay focused on what you need to do, even when there are distractions around.',
            ]
        }
        else if (scoreC >= 14 && scoreC <= 26) {
            cPersonality['strength'] = 'Balanced'
            cPersonality['description'] = [
                'Balanced: You have a good mix of being organized and spontaneous, which helps you adapt to different situations.',
                'Flexible: You\'re able to go with the flow when plans change, but you also know when it\'s important to stick to a schedule.',
                'Resourceful: You\'re creative in finding solutions to problems, even if you don\'t always follow a strict routine.',
                'Adaptive: You can adjust your approach depending on the task at hand, whether it requires careful planning or quick thinking.',
                'Resilient: You bounce back from setbacks and keep moving forward, even if you don\'t always stick to a rigid plan.',
            ]
        }
        else if (scoreC >= 0 && scoreC <= 13) {
            cPersonality['strength'] = 'Free-spirited'
            cPersonality['description'] = [
                'Spontaneity: You\'re good at going with the flow and embracing new experiences without worrying too much about plans or schedules.',
                'Creativity: You have a vivid imagination and enjoy expressing yourself through art, music, or other creative outlets.',
                'Flexibility: You\'re adaptable and can easily adjust to changes in your environment or routine without feeling stressed.',
                'Laid-back: You\'re relaxed and easygoing, preferring to take things as they come rather than stressing over details or deadlines.',
                'Optimism: You have a positive outlook on life and believe that things will work out in the end, even if you don\'t always follow a strict plan.',
            ]
        }

        if (scoreN >= 27 && scoreN <= 40) {
            nPersonality['strength'] = 'Sensitive'
            nPersonality['description'] = [

                'Sensitivity: You\'re very in tune with your emotions and the emotions of others, which allows you to empathize and connect deeply with people.',
                'Awareness: You\'re keenly aware of potential threats or dangers in your environment, helping you stay cautious and alert.',
                'Resilience: Despite experiencing strong emotions, you have the ability to bounce back and recover from setbacks or challenges.',
                'Creativity: Your heightened emotional experiences can fuel your creativity, leading to unique insights and expressions in art, music, or writing.',
                'Empathy: Your own struggles make you more understanding and compassionate towards the struggles of others, allowing you to offer support and comfort.',]
        }
        else if (scoreN >= 14 && scoreN <= 26) {
            nPersonality['strength'] = 'Self-aware'
            nPersonality['description'] = [
                'Balance: You\'re able to manage your emotions well, experiencing ups and downs without feeling overwhelmed.',
                'Adaptability: You\'re flexible and resilient, able to cope with stress and change without letting it affect you too much.',
                'Perspective: You have a realistic view of challenges and setbacks, understanding that they\'re a normal part of life and not letting them consume you.',
                'Empathy: You\'re sensitive to others\' emotions and can offer support and understanding, even when You\'re dealing with your own struggles.',
                'Self-awareness: You\'re aware of your emotions and thoughts, which helps you recognize when you need to take care of yourself and seek help if necessary.',]
        }
        else if (scoreN >= 0 && scoreN <= 13) {
            nPersonality['strength'] = 'Calm'
            nPersonality['description'] = [
                'Calmness: You stay cool and collected even in challenging situations, handling stress with ease.',
                'Confidence: You believe in yourself and your abilities, which helps you face difficulties with a positive attitude.',
                'Stability: You have a steady and consistent mood, rarely experiencing intense fluctuations in emotions.',
                'Resilience: You bounce back quickly from setbacks or disappointments, showing strength and determination.',
                'Optimism: You have a hopeful outlook on life, seeing challenges as opportunities for growth rather than obstacles.',]
        }

        if (scoreO >= 27 && scoreO <= 40) {
            oPersonality['strength'] = 'Ideator/Innovator'
            oPersonality['description'] = [
                'Creativity: You\'re really good at coming up with new and original ideas, whether it\'s in art, writing, or problem-solving.',
                'Curiosity: You\'re always eager to learn new things and explore different subjects, even if they\'re outside your usual interests.',
                'Open-Mindedness: You\'re very accepting of different perspectives and ideas, and You\'re willing to consider viewpoints that might be different from your own.',
                'Imagination: Your imagination knows no bounds! You can easily envision new possibilities and dream up fantastical worlds.',
                'Appreciation of Beauty: You have a keen eye for beauty in the world around you, whether it\'s in nature, art, or even everyday moments.',]
        }
        else if (scoreO >= 14 && scoreO <= 26) {
            oPersonality['strength'] = 'Flexible'
            oPersonality['description'] = [
                'Curiosity: You\'re interested in trying new things and learning about different ideas and experiences.',
                'Flexibility: You\'re able to adapt to changes and consider different perspectives without feeling overwhelmed.',
                'Imagination: You have a creative mind and enjoy thinking about possibilities and exploring your imagination.',
                'Tolerance: You\'re accepting of others\' viewpoints and differences, and You\'re open to understanding diverse perspectives.',
                'Appreciation of Beauty: You have an eye for noticing and appreciating the beauty in art, nature, and the world around you.',]
        }
        else if (scoreO >= 0 && scoreO <= 13) {
            oPersonality['strength'] = 'Traditional'
            oPersonality['description'] = [
                'Dependability: You\'re very reliable and consistent, and people can count on you to follow through on your commitments.',
                'Practicality: You\'re good at focusing on what needs to be done in the present moment, without getting distracted by too many new ideas or possibilities.',
                'Realism: You have a grounded perspective and tend to see things as they are, without getting lost in imagination or daydreaming.',
                'Attention to Detail: You\'re great at noticing the small things and making sure everything is organized and in order.',
                'Loyalty: You\'re fiercely loyal to your friends and family, and you value stability and familiarity in your relationships.',]
        }
        const personalityData = {
            ePersonality, aPersonality, cPersonality, nPersonality, oPersonality
        }
        logger.debug.debug('in personality-helper generate50PersonalityTestResults saving  personality test results for user Id' + input.userId)

        const dateCreated = new Date(Date.now()).toISOString()

        await insertPersonalityTestResults({ userId: input.userId, personalityData: JSON.stringify(personalityData), dateCreated: dateCreated })
        const result = {
            statusCode: httpStatus.OK,
            data: {
                success: true, message: PERSONALITY_SUCCESS_MSGS.RESULT_GENERATED, personalityData
            }
        }
        return result
    } catch (error) {
        logger.debug.debug('in personality-helper generatePersonalityTestResults server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}

async function savePersonalityAnswers(input) {
    try {
        logger.debug.debug('in personality-helper savePersonalityAnswers saving answer for userID =' + input.userId)
        let answers = JSON.stringify(input.answers)
        const updatedDate = new Date(Date.now()).toISOString()
        const updateResult = await updatePersonalityAnswers({ answers: answers, userId: input.userId, updatedDate: updatedDate });

        if (updateResult.rowCount != 1) {
            const saveResult = await saveAllPersonalityAnswers({ answers: answers, userId: input.userId, updatedDate: updatedDate });
        }

        const result = {
            statusCode: httpStatus.OK,
            data: { success: true, message: PERSONALITY_SUCCESS_MSGS.ANSWERS_SAVED }
        }
        return result
    } catch (error) {
        logger.debug.debug('in personality-helper savePersonalityAnswers server error =' + error.stack)
        const result = { statusCode: httpStatus.INTERNAL_SERVER_ERROR, data: { success: false, message: INTERNAL_SERVER_ERROR } }
        return result
    }

}


module.exports = { getQuestions, generatePersonalityTestResults, get50Questions, generate50PersonalityTestResults, savePersonalityAnswers }