const Alexa = require('ask-sdk');

const StopIntent = {
   canHandle(handlerInput) {
    // handle numbers only during a game
    let isCurrentlyPlaying = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
      sessionAttributes.gameState === 'STARTED') {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying 
      && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StopIntent';
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();
    
    
    sessionAttributes.gamesPlayed += 1;
    sessionAttributes.gameState = 'ENDED';
    sessionAttributes.answers = '';
    sessionAttributes.artist = '';
    sessionAttributes.questionNumber = 0;
    attributesManager.setPersistentAttributes(sessionAttributes);
    await attributesManager.savePersistentAttributes();
    return handlerInput.responseBuilder
        .speak(requestAttributes.t('EXIT_MESSAGE'))
        .getResponse();
    
  }
}

module.exports = StopIntent;