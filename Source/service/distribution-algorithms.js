var WINNERS_BY_FIFO_SELECTION_NAME = "FIFO";
var WINNERS_BY_POINTS_SELECTION_NAME = "SelectWinnersByPoints";
var WINNERS_BY_WEIGHTED_SHUFFLE_SELECTION_NAME = "SelectWinnersByWeightedShuffle";
var WINNERS_BY_RANDOM_COEFICIENT_SELECTION_NAME = "SelectWinnersByRandomCoeficient";

function getRandomInteger(from, to) {
    return Math.floor(Math.random() * to) + from;
}

function getRandomFloat(from, to) {
    return Math.random() * to + from;
}

function printParticipantsArray(participants) {
    for (var i = 0; i < participants.length; i++) {
        console.log(participants[i]);
    }
}

function getParticipantId(participant) {
    return participant.userId;
}

function getParticipantSignDate(participant) {
    return participant.signUpDate;
}

function getParticipantPoints(participant) {
    return participant.points;
}

function setParticipantPoints(participant, points) {
    return participant.points = points;
}

function getBestParticipants(participants, comparer, number) {
    participants.sort(comparer);
    bestParticipants = participants.slice(0, number);
    return bestParticipants;
}

function getWinnerIndex(participants, sum) {
    var currentSum = 0;
    for (var i = 0; i < participants.length; i++) {
        currentSum += participants[i].points;
        if (currentSum >= sum) {
            return i;
        }
    }
    return participants.length;
}

function sumPoints(participants) {
    var sum = 0;
    for(var i = 0; i < participants.length; i++) {
        sum += getParticipantPoints(participants[i]);
    }
    return sum;
}

function createResponse(participants) {
    var response = [];
    for (var i = 0; i < participants.length; i++) {
        response.push(getParticipantId(participants[i]));
    }
    return response;
}

function compareBySignDate(value, otherValue) {
    if (getParticipantSignDate(value) < getParticipantSignDate(otherValue))
        return -1;
    if (getParticipantSignDate(value) > getParticipantSignDate(otherValue))
        return 1;
    return 0;
}

function compareByPoints(value, otherValue) {
    if (getParticipantPoints(value) < getParticipantPoints(otherValue))
        return 1;
    if (getParticipantPoints(value) > getParticipantPoints(otherValue))
        return -1;
    return 0;
}

function selectWinnersByFirstInFirstOut(participants, number) {
    var bestParticipants = getBestParticipants(participants, compareBySignDate, number);
    var response = createResponse(bestParticipants);
    return response;
}

function selectWinnersByPoints(participants, number) {
    var bestParticipants = getBestParticipants(participants, compareByPoints, number);
    var response = createResponse(bestParticipants);
    return response;
}

function selectWinnersByWeightedShuffle(participants, number) {
    var winners = [];
    var pointsSum = sumPoints(participants);
    var addedWinners = 0;
    while(participants.length != 0 && addedWinners < number) {
        var points = getRandomInteger(0, pointsSum);

        var currentWinnerIndex = getWinnerIndex(participants, points);
        winners.push(participants[currentWinnerIndex]);
        addedWinners++;

        pointsSum -= getParticipantPoints(participants[currentWinnerIndex]);
        participants.splice(currentWinnerIndex, 1);
    }
    var response = createResponse(winners);
    return response;
}

function selectWinnersByRandomCoeficient(participants, number) {
    for (var i = 0; i < participants.length; i++) {
        setParticipantPoints(participants[i],
            participants[i].points *= getRandomFloat(0, 1));
    }
    var bestParticipants = getBestParticipants(participants, compareByPoints, number);
    var response = createResponse(bestParticipants);
    return response;
}

function selectWinners(participants, number, selectionMethodName) {
    if (participants.length <= number) {
        var response = createResponse(participants);
        return response;
    }
    switch(selectionMethodName)
    {
        case WINNERS_BY_FIFO_SELECTION_NAME:
            return selectWinnersByFirstInFirstOut(participants, number);
        case WINNERS_BY_POINTS_SELECTION_NAME:
            return selectWinnersByPoints(participants, number);
        case WINNERS_BY_WEIGHTED_SHUFFLE_SELECTION_NAME:
            return selectWinnersByWeightedShuffle(participants, number);
        case WINNERS_BY_RANDOM_COEFICIENT_SELECTION_NAME:
            return selectWinnersByRandomCoeficient(participants, number);
    }
    return undefined;
}

exports.selectWinners = selectWinners;