const Alexa = require('ask-sdk');

const answerChecker = function answerChecker(answer, questionNumber){
  if (questionNumber === 1) {
      return answer !== 'ice cream' && answer !== 'custard';
  } else if (questionNumber === 2) {
      return answer !== 'mac' && answer !== 'windows';
  }
  return answer !== 'pepsi' && answer !== 'coke';
};

module.exports = answerChecker;