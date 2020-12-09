const Alexa = require('ask-sdk');

const NoIntent = {
    canHandle(handlerInput) {
        // only treat no as an exit when outside a game
        let isCurrentlyPlaying = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.gameState &&
            sessionAttributes.gameState === 'STARTED') {
            isCurrentlyPlaying = true;
        }

        return !isCurrentlyPlaying &&
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        // End the game when receiving NoIntent
        sessionAttributes.endedSessionCount += 1;
        sessionAttributes.gameState = 'ENDED';
        sessionAttributes.answers = '';
        sessionAttributes.artist = '';
        sessionAttributes.questionNumber = 0;
        attributesManager.setPersistentAttributes(sessionAttributes);

        await attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('EXIT_MESSAGE'))
            .getResponse();

    },
};

module.exports = NoIntent;