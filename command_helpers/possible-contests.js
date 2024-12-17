// This script contains some helper functions regarding contest fetching from a json file. 
// Contest data remains up to date, through the add-possible-contests script.

// Get contests from json
const contests = require('./contests.json');

const { nonGymContests, gymContests } = contests;

// Function that returns all ICPC contests in Codeforces gyms in an array
function getArrayPossibleGymContests() {
	return gymContests;
}

// Function that returns all ICPC contests in Codeforces non-gyms in an array
function getArrayPossibleNonGymContests() {
	return nonGymContests;
}

// Function that returns the last checked contest that is not a gym.
// This allows for a speed-up when automating the addition of new contests.
function getLastCheckedNonGym() {
	return Number(nonGymContests.slice(-1));
}

// Function that returns the last checked contest that is a gym.
// This allows for a speed-up when automating the addition of new contests.
function getLastCheckedGym() {
	return Number(gymContests.slice(-1));
}

module.exports = { getArrayPossibleGymContests, getArrayPossibleNonGymContests, getLastCheckedNonGym, getLastCheckedGym };