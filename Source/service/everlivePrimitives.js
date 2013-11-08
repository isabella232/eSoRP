var http = require('http');

var settings = { 
  apiKey: 'YjdWxWf3pNLR82t7', 
  masterKey: '5hAzvSkpL0BoDTd8qvQlvicHp6zkwzec'
};

var createOptions = function(typeName, method) {
  return {
    host: 'api.everlive.com',
    method: method,
    path: '/v1/' + settings.apiKey + '/' + typeName + '/',
    headers: { 'Authorization': 'masterkey ' + settings.masterKey }
  };
};

var setFilter = function(options, filter) {
  if (filter) {
    options.headers['X-Everlive-Filter'] = JSON.stringify(filter);
  }  
}

var getData = function(typeName, fields, filter, readyCallback) {
  var callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      readyCallback(null, JSON.parse(str));
    });
  }
  
  var options = createOptions(typeName, 'GET');
  
  setFilter(options, filter);
  
  if (fields) {
    options.headers['X-Everlive-Fields'] = JSON.stringify(fields);
  }

  http.request(options, callback).end();
}

var updateData = function(typeName, item, readyCallback) {  
  if (!item || !item.Id) {
    readyCallback('Invalid Argument');
    return;
  }
  
  var callback = function(response) {
    response.on('data', function (chunk) {
      var result = JSON.parse(chunk);
      if (result.Result != 1) {
        readyCallback(result);
      }
    });
  };
  
  var data = JSON.stringify(item);
  
  var options = createOptions(typeName, 'PUT');
  options.headers['Content-Type'] = 'application/json';
  options.headers['Content-Length'] = data.length;
  setFilter(options, { 'Id': item.Id });

  var req = http.request(options, callback);
    
  req.write(data);
  
  req.end();
}

exports.updateData = updateData;
exports.getData = getData;