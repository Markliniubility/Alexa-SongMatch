const Alexa = require('ask-sdk');

const InProgressMatchIntent = {
  canHandle(handlerInput) {
    // handle numbers only during a game
    let isCurrentlyPlaying = false;
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (sessionAttributes.gameState &&
        sessionAttributes.gameState === 'STARTED') {
        isCurrentlyPlaying = true;
    }
    return isCurrentlyPlaying &&
        Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'InProgressMatchIntent';
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    const answer = Alexa.getSlotValue(handlerInput.requestEnvelope, 'answer').toLowerCase();
    
    if (sessionAttributes.questionNumber === 0) {
        // in case people directly saying question answers withou picking artist
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('WITHOUT_ARTIST_MESSAGE'))
            .reprompt(requestAttributes.t('WITHOUT_ARTIST_MESSAGE'))
            .getResponse();
    } else if (sessionAttributes.questionNumber === 1) {
        // question 1: answer the prompt and add to string
        sessionAttributes.answers = answer;
        sessionAttributes.questionNumber += 1;
        attributesManager.setPersistentAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('QUESTION_2'))
            .reprompt(requestAttributes.t('QUESTION_2'))
            .getResponse();
    } else if (sessionAttributes.questionNumber === 2) {
        // question 2: answer the prompt and add to string
        sessionAttributes.answers = sessionAttributes.answers + ' ' + answer;
        sessionAttributes.questionNumber += 1;
        attributesManager.setPersistentAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(requestAttributes.t('QUESTION_3'))
            .reprompt(requestAttributes.t('QUESTION_3'))
            .getResponse();
    }
    // the following the QUESTION_3; build a matching map for later matching first.
    const matchingMaps = {
        'carpenters': {
            'ice cream mac pepsi': 'Yesterday Once More',
            'custard mac pepsi': 'Close to You',
            'ice cream mac coke': 'Top of the World',
            'custard mac coke': 'Superstar',
            'ice cream windows pepsi': 'Jambalaya',
            'custard windows pepsi': 'Solitaire',
            'ice cream windows coke': 'Goodbye to Love',
            'custard windows coke': 'This Masquerade',
        },
        'bach': {
            'ice cream mac pepsi': 'Goldberg Variations',
            'custard mac pepsi': 'Brandenburg Concertos',
            'ice cream mac coke': 'Air on the G String',
            'custard mac coke': 'Organ Fantasia and Fugue In G Minor, BWV542',
            'icecream windows pepsi': 'Cello Suite No.1 In G Major, BWV 1007',
            'custard windows pepsi': 'The Well-tempered Clavier',
            'ice cream windows coke': 'Minuet in G major, BWV Anh. 114',
            'custard windows coke': 'Partita for Violin No. 2',
        },
        'beatles': {
            'ice cream mac pepsi': 'Hey Jude',
            'custard mac pepsi': 'Come Together',
            'ice cream mac coke': 'Ticket to Ride',
            'custard mac coke': 'Yesterday',
            'ice cream windows pepsi': 'Let It Be',
            'custard windows pepsi': 'While My Guitar Gently Weeps',
            'ice cream windows coke': 'Norwegian Wood',
            'custard windows coke': 'Help'
        },
        'queen': {
            'ice cream mac pepsi': 'Killer Queen',
            'custard mac pepsi': 'We Will Rock You',
            'ice cream mac coke': 'Bohemain Rhaposdy',
            'custard mac coke': 'We are the Champions',
            'ice cream windows pepsi': 'Another One Bites the Dust',
            'custard windows pepsi': 'Made in Heaven',
            'ice cream windows coke': 'Under Pressure',
            'custard windows coke': 'Crazy Little Thing Called Love',
        },
    };
    
    // this is the final stage of song match.
    const finalAnswer = sessionAttributes.answers + ' ' + answer;
    const pickedArtist = sessionAttributes.artist;
    
    // clear the data
    sessionAttributes.answers = '';
    sessionAttributes.questionNumber = 0;
    sessionAttributes.artist = '';
    sessionAttributes.gameState = 'ENDED';
    attributesManager.setPersistentAttributes(sessionAttributes);
    await attributesManager.savePersistentAttributes();
    
    if (typeof(matchingMaps[pickedArtist]) !== 'undefined' && typeof(matchingMaps[pickedArtist][finalAnswer]) !== 'undefined') {
        // if we found the answer
        const songMatched = matchingMaps[pickedArtist][finalAnswer];
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('FINAL_RESPONSE', pickedArtist, songMatched))
            .reprompt(requestAttributes.t('FINAL_RESPONSE', pickedArtist,songMatched))
            .getResponse();
    }
    // if we failed to match
    return handlerInput.responseBuilder
        .speak(requestAttributes.t('NO_MATCH'))
        .reprompt(requestAttributes.t('NO_MATCH'))
        .getResponse();
  },
};

module.exports = InProgressMatchIntent;