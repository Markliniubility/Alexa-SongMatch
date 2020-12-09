const Alexa = require('ask-sdk');

const ArtistIntent = {
    canHandle(handlerInput) {
        // handle numbers only during a game
        let isCurrentlyPlaying = false;
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();

        if (sessionAttributes.gameState &&
            sessionAttributes.questionNumber === 0 &&
            sessionAttributes.gameState === 'STARTED') {
            isCurrentlyPlaying = true;
        }
        return isCurrentlyPlaying &&
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ArtistIntent';
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const artist = Alexa.getSlotValue(handlerInput.requestEnvelope, 'musician').toLowerCase();
        
        if (!(artist.includes("carpenters") || artist.includes("beatles") || artist.includes("bach") || artist.includes("queen"))) {
            // The people they mentioned is out of range. Let them re-say it.
            return handlerInput.responseBuilder
                .speak(requestAttributes.t('OUT_OF_RANGE'))
                .reprompt(requestAttributes.t('OUT_OF_RANGE_REPROMPT'))
                .getResponse();
        }
        
        // update the questionNumbers and artist. Going to matching intents.
        sessionAttributes.questionNumber += 1;
        sessionAttributes.artist = artist;
        attributesManager.setPersistentAttributes(sessionAttributes);
        await attributesManager.savePersistentAttributes();
        
        // This includes the first question as well.
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('QUESTION_1', artist))
            .reprompt(requestAttributes.t('QUESTION_1_REPROMPT'))
            .getResponse();
    },
};

module.exports = ArtistIntent;