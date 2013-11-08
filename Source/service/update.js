var everlivePrimitives = require('./everlivePrimitives.js');

var getExpiredOffers = function(readyCallback) {
  var typeName = 'Item';
  //var fields = { 'Id': 1, 'Quantity': 1, 'AlgorithmName': 1 };
  var fields = null;
  var filter = { 
      "$and": [ 
        { 'IsCompleted': false }, 
        { 'EndTime': { '$lt': new Date() } }
      ]};

  everlivePrimitives.getData(typeName, fields, filter, function(error, data) {
    if (!error && data) {
      readyCallback(error, data.Result);
    } else {
      readyCallback(error || "No data", null);
    }
  });
};

var getParticipants = function(itemId, readyCallback) {
  var typeName = 'Participant';
  var fields = { 'UserId': 1, 'CreatedAt': 1 };
  var filter = { 'ItemId': itemId };

  everlivePrimitives.getData(typeName, fields, filter, function(error, data) {
    if (!error && data) {
      readyCallback(error, data.Result);
    } else {
      readyCallback(error || "No data", null);
    }
  });
};

var getUserPoints = function(userId, readyCallback) {
  var typeName = 'Users';
  var fields = { 'Points': 1 };
  var filter = { 'Id': userId };

  everlivePrimitives.getData(typeName, fields, filter, function(error, data) {
    var results = data.Result;
    if (!error && results.length > 0) {
      readyCallback(error, results[0].Points);
    } else {
      readyCallback(error || "No items", null);
    }
  });
};

var loadPartData = function(part, readyCallback) {
      getUserPoints(part.UserId, function(error, userPoints) {
      var result = {
          'points': userPoints,
          'userId': part.UserId,
          'signUpDate': part.CreatedAt
        };
        readyCallback(error, result);
      });
}

var getParticipantsForOffer = function(offerData, readyCallback) {
  var mutex = 0;
  var result = [];
  getParticipants(offerData.Id, function(error, parts) {
    for (var j = 0; j < parts.length; j++) {
      
      mutex = mutex + 1;
      loadPartData(parts[j], function(error, partData) {
        result.push(partData);
              
        mutex = mutex - 1;
        if (mutex == 0) {
          readyCallback(error, result);
        }
      });
    }
  });
};

var selectWinnersForOffer = function(offer, readyCallback) {
  getParticipantsForOffer(offer, function(error, partsData) {

    var algorithm = 'SelectWinnersByWeightedShuffle';
    var winners = selectWinners(partsData, offer.Quantity, algorithm);
    readyCallback(error, { 'winners': winners, 'offer': offer });
  });
};

var completeOffer = function(offer, winners) {
  console.log('TODO: Mark the offer as completed');
  console.log('TODO: Post in owner points');
  console.log('TODO: Update owner points');
  console.log('TODO: Send notification to owner');
  console.log(offer);
  console.log(winners);
};

var grantOfferToUser = function(offer, winner) {
  console.log('TODO: Post in winner points');
  console.log('TODO: Update winner points');
  console.log('TODO: Send notificiation to winner');
  console.log(offer);
  console.log(winner);
};

var selectWinners = require('./distribution-algorithms.js').selectWinners;

getExpiredOffers(function(error, data) {    
  for (var i = 0; i < data.length; i++) {
    var offer = data[i];
    
    selectWinnersForOffer(offer, function(error, result) {
      completeOffer(result.offer, result.winners);
      var winners = result.winners;
      for (var j = 0; j < winners.length; j++) {
        grantOfferToUser(result.offer, winners[j]);
      }
    });
  }
});