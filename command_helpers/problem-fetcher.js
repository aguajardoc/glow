// Fetches a problem that matches a given difficulty through Codeforces's API.
const { getArrayPossibleGymContests, getArrayPossibleNonGymContests } = require('./possible-contests.js');

const MAX_API_CALLS = 3;

// Function that gets a problem's difficulty rating based on percentage of users who have solved it.
function getDifficulty(ratio) {
	/* Expected behavior:
	
	Percent solved | Difficulty
	---------------------------
		50 - 100   | 	 1
		40 - 50    | 	 2
		30 - 40    | 	 3
		25 - 30    | 	 4
		20 - 25    |     5
		15 - 20    | 	 6
		10 - 15    | 	 7
		 5 - 10    | 	 8
		 2 - 5     | 	 9
		 0 - 2     | 	 10
	*/
	const ratingArray = new Array(0.50, 0.40, 0.30, 0.25, 0.20, 0.15, 0.10, 0.05, 0.02, 0);
	const difficulty = ratingArray.findIndex(threshold => ratio > threshold) + 1;

	return difficulty;
}

// Function that finds a problem based on inputted difficulty range.
function findProblem(contestProblemData, userMinDifficulty, userMaxDifficulty) {
	// Create an array to stored the number of times a problem was solved.
	let solved = new Array();
	
	let participantCount = 0;

	// Iterate over every contestant in the contest.
	for (const contestant of contestProblemData.result.rows) {
		let problemIndex = 0;

		// Speed-up: only check for participants with at least one problem solved.
		if (contestant.points >= 1) {
			participantCount++; // Counting participants with no solves deflates solve rate for that contest.
		
			// Iterate over every problem they solved.
			for (const problem of contestant.problemResults) {
				if (solved.length === problemIndex) {
					solved.push(0);
				}

				// If they solved the problem, add one to the corresponding counter.
				if (problem.points === 1) {
					solved[problemIndex]++;
				}

				problemIndex++;
			}
		}
		else {
			// The API holds the contestants' information in the same order as the scoreboard.
			// The scoreboard shows participants in Practice Mode last.
			// This means that, if someone in Practice Mode with 0 points is found, there's no need to check further.
			if (contestant.party.participantType === "PRACTICE") {
				break;
			}
		}
	}

	// Get difficulty for each problem, while storing problems in the appropriate range.
	const problemCount = solved.length;
	let rateSolved = new Array(problemCount);
	let difficultyRatings = new Array(problemCount);
	let difficultyMatches = new Array();

	for (let i = 0; i < problemCount; i++) {
		rateSolved[i] = solved[i] / participantCount;
		difficultyRatings[i] = getDifficulty(rateSolved[i]);
		
		if (difficultyRatings[i] >= userMinDifficulty && difficultyRatings[i] <= userMaxDifficulty) {
			difficultyMatches.push({index : i, difficulty : difficultyRatings[i]});
		}
		console.log(i, rateSolved[i], difficultyRatings[i]);
	}

	// Choose a suitable problem randomly. If none, return -1 as indicative of such a scenario.
	if (difficultyMatches.length === 0){
		return -1;
	}

	const randomIndex = Math.floor(Math.random() * difficultyMatches.length);
	const chosenProblemIndex = difficultyMatches[randomIndex].index;
	const chosenProblemData = contestProblemData.result.problems[chosenProblemIndex];

	// Relevant data needed for the display on a Discord Embed
	const chosenProblemLetter = chosenProblemData.index;
	const chosenProblemName = chosenProblemData.name;
	const chosenProblemDifficulty = difficultyMatches[randomIndex].difficulty;
	

	return {chosenProblemLetter, chosenProblemName, chosenProblemDifficulty};
}

async function fetchContest(minimumDifficulty, maximumDifficulty) {
    const fetch = (await import('node-fetch')).default;

    // Fetch the possible contest IDs.
    const possibleContests = getArrayPossibleGymContests().concat(getArrayPossibleNonGymContests());

    // Loop while we have not found a suitable problem.
    let validProblemFound = false;
    let problemData;
    let contestId;
    let contestURL;
	let arrayIdx;

	// Break out if it fails a number of consecutive calls.
	let communicationAttempts = 0;

    while (!validProblemFound) {
		arrayIdx = Math.floor(Math.random() * possibleContests.length);
        contestId = possibleContests[arrayIdx];
        contestURL = `https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=true`;

        try {
            const response = await fetch(contestURL);
            if (!response.ok) {
                console.log(`Failed to fetch contest data for ID: ${contestId}`);
				communicationAttempts++;
            }

            const data = await response.json();
			
			// If a match is found, problemData will have five attributes:
				// chosenProblemLetter: The letter the problem represents in the contest it's in.
				// chosenProblemName: The problem's name.
				// chosenProblemDifficulty: The problem's assigned difficulty rating.
				// contestId: The problem's contest's Codeforces ID.
				// contestName: The problem's contest's Codeforces name.
            problemData = findProblem(data, minimumDifficulty, maximumDifficulty);
			
			// If it's -1, a matching problem was not found
            if (problemData !== -1) {
                problemData.contestId = contestId;
                problemData.contestName = data.result.contest.name;
                validProblemFound = true;
				console.log('Match found in', contestId, '!');
            }
			else {
				console.log('Matching problem not found in', contestId, ':(');
			}
        } 
        catch (error) {
            console.error('Error:', error);
			communicationAttempts++;
        }

		// Return -1 as an indicator for API failure if too many failed communication attempts have occurred.
		if (communicationAttempts >= MAX_API_CALLS) {
			return -1;
		}
		continue;
    }

    return problemData;
}

module.exports = { fetchContest };