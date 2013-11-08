var everlivePrimitives = require('./everlivePrimitives.js');

var constants = {
  offerName: 'Item',
  participantName: 'Participant',
  userName: 'Users',
  userPointName: 'UserPoint'
};

var getExpiredOffers = function(readyCallback) {
  //var fields = { 'Id': 1, 'Quantity': 1, 'AlgorithmName': 1 };
  var fields = null;
  var filter = { 
      "$and": [ 
        { 'IsCompleted': false }, 
        { 'EndTime': { '$lt': new Date() } }
      ]};

  everlivePrimitives.getData(constants.offerName, fields, filter, function(error, data) {
    if (!error && data) {
      readyCallback(error, data.Result);
    } else {
      readyCallback(error || "No data", null);
    }
  });
};

var getParticipants = function(offerId, readyCallback) {
  var fields = { 'UserId': 1, 'CreatedAt': 1 };
  var filter = { 'ItemId': offerId };

  everlivePrimitives.getData(constants.participantName, fields, filter, function(error, data) {
    if (!error && data) {
      readyCallback(error, data.Result);
    } else {
      readyCallback(error || "No data", null);
    }
  });
};

var getUserPoints = function(userId, readyCallback) {
  var fields = { 'Points': 1 };
  var filter = { 'Id': userId };

  everlivePrimitives.getData(constants.userName, fields, filter, function(error, data) {
    var results = data.Result;
    if (!error && results.length > 0) {
      readyCallback(error, results[0].Points);
    } else {
      readyCallback(error || "No items", null);
    }
  });
};

var getUserData = function(userId, readyCallback) {
  var filter = { 'Id': userId };

  everlivePrimitives.getData(constants.userName, null, filter, function(error, data) {
    var results = data.Result;
    if (!error && results.length > 0) {
      readyCallback(error, results[0]);
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

var getParticipantsForOffer = function(offerId, readyCallback) {
  var mutex = 0;
  var result = [];
  getParticipants(offerId, function(error, parts) {    
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
  getParticipantsForOffer(offer.Id, function(error, partsData) {
    var algorithm = 'SelectWinnersByWeightedShuffle';
    var winners = selectWinners(partsData, offer.Quantity, algorithm);
    readyCallback(error, winners);
  });
};

var updateData = function(typeName, data) {
  everlivePrimitives.updateData(typeName, data, function(error) {
  if (error) {
      console.log(error);
    } else {
      //console.log(offer);
    }
  });
};

var markOfferAsCompleted = function(offer) {
  offer.IsCompleted = true;
  updateData(constants.offerName, offer);
};

var updateUserPoints = function(userId, points) {
  getUserData(userId, function(error, user) {
    user.Points = points || 0;
    updateData(constants.userName, user);    
  });
};

var addPointsRecord = function(userId, points, itemId, readyCallback) {

  var data = {
    'Points': points,
    'ItemId': itemId,
    'UserId': userId
  };
  everlivePrimitives.addData(constants.userPointName, data, function(error) {
    if (error) {
      readyCallback(error);
    } else {
      //console.log(offer);
      readyCallback(null);
    }
  });
};

var calculatePointsForUser = function(userId, readyCallback) {
  var fields = { 'Points': 1 };
  var filter = { 'UserId': userId };  

  everlivePrimitives.getData(constants.userPointName, fields, filter, function(error, data) {
    var results = data.Result;
    var points = 0;
    for (var i = 0; i < results.length; i++) {
      points = points + results[i].Points;      
    }
        
    readyCallback(points);
  });
};

var givePointsToUser = function(userId, offer, newPoints) {  
  addPointsRecord(userId, newPoints, offer.Id, function(error) {
    calculatePointsForUser(offer.Owner, function(points) {
      updateUserPoints(offer.Owner, points);      
    });
  });
};

var sendNotificationToOwner = function(offer, winners) {
  //console.log('TODO: Send push notification to ' + offer.Owner + ' that offer ' + offer.Description + ' was given to ' + winners);
};

var sendNotificationToWinner = function(offer, winner) {
  //console.log('TODO: Send push notification to ' + winner + ' that he took offer ' + offer.Description);
};

var completeOffer = function(offer, winners) {
  //markOfferAsCompleted(offer);
  givePointsToUser(offer.Owner, offer, 10);
  sendNotificationToOwner(offer, winners);
};

var grantOfferToUser = function(offer, winner) {
  givePointsToUser(winner, offer, 0);
  sendNotificationToWinner(offer, winner);
};

var selectWinners = require('./distribution-algorithms.js').selectWinners;

var updateExpiredOffer = function(offer) {  
  selectWinnersForOffer(offer, function(error, winners) {
    completeOffer(offer, winners);
    for (var j = 0; j < winners.length; j++) {
      grantOfferToUser(offer, winners[j]);
    }
  });  
};

getExpiredOffers(function(error, data) {  
  for (var i = 0; i < data.length; i++) {
    updateExpiredOffer(data[i]);
  }
});