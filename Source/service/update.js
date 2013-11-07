var settings = { 
  apiKey: 'YjdWxWf3pNLR82t7', 
  masterKey: '5hAzvSkpL0BoDTd8qvQlvicHp6zkwzec'
};

var createOptions = function(typeName) {
  return {
    host: 'api.everlive.com',
    path: '/v1/' + settings.apiKey + '/' + typeName + '/',
    headers: { 'Authorization': 'masterkey ' + settings.masterKey }
  };
};

var getData = function(typeName, fields, filter, readyCallback) {
  var http = require('http');

  var callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      readyCallback(null, JSON.parse(str));
    });
  }
  
  var options = createOptions(typeName);
  
  if (filter) {
    options.headers['X-Everlive-Filter'] = JSON.stringify(filter);
  }
  
  if (fields) {
    options.headers['X-Everlive-Fields'] = JSON.stringify(fields);
  }

  http.request(options, callback).end();
}

var getExpiredOffers = function(readyCallback) {
  var typeName = 'Item';
  var fields = { 'Id': 1, 'Quantity': 1, 'AlgorithmName': 1 };
  var filter = { 
    "$and": [ 
      { 'IsCompleted': false }, 
      { 'EndTime': { '$lt': new Date() } }
    ]};

  getData(typeName, fields, filter, function(error, data) {
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

  getData(typeName, fields, filter, function(error, data) {
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

  getData(typeName, fields, filter, function(error, data) {
    var results = data.Result;
    if (!error && results.length > 0) {
      readyCallback(error, results[0].Points);
    } else {
      readyCallback(error || "No items", null);
    }
  });
};

var getParticipantsForOffer = function(offerData, readyCallback) {
  var mutex = 0;
  var result = [];
  getParticipants(offerData.Id, function(error, parts) {
    for (var j = 0; j < parts.length; j++) {
      var part = parts[j];
      
      mutex = mutex + 1;
      getUserPoints(part.UserId, function(error, userPoints) {
        result.push({
          'points': userPoints,
          'userId': part.UserId,
          'signUpDate': part.CreatedAt
        });
        
        mutex = mutex - 1;
        if (mutex == 0) {
          readyCallback(error, result);
        }
      });
    }
  });
};

getExpiredOffers(function(error, data) { 
  for (var i = 0; i < data.length; i++) {
    getParticipantsForOffer(data[i], function(error, partsData) {
      console.log(partsData);
    });
  }
});