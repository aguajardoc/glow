// Suggests a random gym as a virtual contest, yet does not actually track info.
// Give priority to
// 1. Most recent gyms
// 2. Gyms where the user has no solves

const { fetchContest } = require("../../command_helpers/problem-fetcher");

// Fetch the possible contest IDs.
const possibleGyms = getArrayPossibleGymContests();
const possibleNonGyms = getArrayPossibleNonGymContests();
const totalLength = possibleGyms.length() + possibleNonGyms.length();

// Reverse the arrays to get them in reverse chronological order.
possibleGyms.reverse();
possibleNonGyms.reverse();

// Declare index variables to iterate over the contests.
let indexGyms = 0;
let indexNonGyms = 0;

// A factor to "move" the indices in a proportional manner over both lists.
const conversionFactor = possibleGyms.length() / possibleNonGyms.length();

// Iterate the lists
for (const i = 0; i < totalLength; i++) {
    let contest;
    if (round(possibleNonGyms * conversionFactor) < i) {
        contest = possibleNonGyms[indexNonGyms];
        indexNonGyms++;
    }
    else {
        contest = possibleGyms[indexGyms];
        indexGyms++;
    }

    const contestURL = `https://codeforces.com/api/contest.status?contestId=${contest}&handle=${codeforcesHandle}&count=1`
    // Check contest, to see if user has made ANY submissions to it.

    // If not, edit the response to include it.

    // Else, continue iterating
}
// Allow the user to keep interacting with the response for the next 5 minutes, so that they choose their contest.