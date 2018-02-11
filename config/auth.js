/*
 * Authorization for Facebook Authentication
 */

module.exports = {
    'facebookAuth' : {
        'clientID'      : '238591543282201', // your App ID
        'clientSecret'  : 'f800a2820894a9a84eacc394c87446bd', // your App Secret
        // 'callbackURL'   : 'http://www.loop-trading.com/login/facebook/return',
        'callbackURL'   : 'http://localhost:3000/login/facebook/return',
        'enableProof': true
    }
};
