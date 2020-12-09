const Alexa = require('ask-sdk');

const RepeatIntent = {
    canHandle(handlerInput) {
        // handle numbers only during a game
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        if (!sessionAttributes.gameState) {
            // when the game has not started
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('CONTINUE_MESSAGE'))
                .reprompt(requestAttributes.t('CONTINUE_MESSAGE'))
                .getResponse();
        } else if (sessionAttributes.questionNumber === 0) {
            // when the game has started but they have not picked their artists.
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('YES_MESSAGE_REPROMPT'))
                .reprompt(requestAttributes.t('YES_MESSAGE_REPROMPT'))
                .getResponse();
        } else if (sessionAttributes.questionNumber === 1) {
            // question 1: the followings are in the similar pattern.
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('QUESTION_1_REPROMPT'))
                .reprompt(requestAttributes.t('QUESTION_1_REPROMPT'))
                .getResponse();
        } else if (sessionAttributes.questionNumber === 2) {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('QUESTION_2_REPROMPT'))
                .reprompt(requestAttributes.t('QUESTION_2_REPROMPT'))
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('QUESTION_3_REPROMPT'))
                .reprompt(requestAttributes.t('QUESTION_3_REPROMPT'))
                .getResponse();
        }
    }
};

module.exports = RepeatIntent;