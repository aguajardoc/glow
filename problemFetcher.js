//
const { getArrayPossibleContests } = require('./possibleContests.js');

function getRating(ratio) {
	/* Expected behavior:
	
	Percent solved | Difficulty
	---------------------------
		60 - 100   | 	 1
		45 - 60    | 	 2
		33 - 45    | 	 3
		25 - 33    | 	 4
		20 - 25    |     5
		15 - 20    | 	 6
		10 - 15    | 	 7
		 5 - 10    | 	 8
		 2 - 5     | 	 9
		 0 - 2     | 	 10
	*/
	const ratingArray = new Array(0.60, 0.45, 0.33, 0.25, 0.20, 0.15, 0.10, 0.05, 0.02, 0);
	const difficulty = ratingArray.findIndex(threshold => ratio > threshold) + 1;

	return difficulty;
}

function findProblem(contestProblemData, userDifficulty) {
	// Create an array to stored the number of times a problem was solved.
	let solved = new Array();
	
	let participantCount = 0;

	// Iterate over every contestant in the contest.
	for (const party of contestProblemData.result.rows) {
		let problemIndex = 0;

		// Iterate over every problem they solved.
		for (const problem of party.problemResults) {
			if (solved.length === problemIndex) {
				solved.push(0);
			}

			// If they solved the problem, add one to the corresponding counter.
			if (problem.points === 1) {
				solved[problemIndex]++;
			}

			problemIndex++;
		}
		participantCount++;
	}

	// Get difficulty for each problem, while storing problems of that difficulty.
	const problemCount = solved.length;

	let rateSolved = new Array(problemCount);
	let difficultyRatings = new Array(problemCount);
	let difficultyMatches = new Array();
	for (let i = 0; i < problemCount; i++) {
		rateSolved[i] = solved[i] / participantCount;
		difficultyRatings[i] = getRating(rateSolved[i]);
		
		if (getRating(rateSolved[i]) === userDifficulty) {
			difficultyMatches.push(i);
		}
	}

	// Choose a suitable problem randomly. If none, return -1 as indicative of such a scenario.
	if (difficultyMatches.length === 0){
		return -1;
	}

	const chosenProblemIndex = difficultyMatches[Math.floor(Math.random() * difficultyMatches.length)];
	const chosenProblemData = contestProblemData.result.problems[chosenProblemIndex];

	// Relevant data needed for the display on a Discord Embed
	const chosenProblemLetter = chosenProblemData.index;
	const chosenProblemName = chosenProblemData.name;
	

	return {chosenProblemLetter, chosenProblemName};
}

async function fetchContest(difficulty) {
    const fetch = (await import('node-fetch')).default;

    // Fetch the possible contest IDs.
    const possibleContests = getArrayPossibleContests();

    // Loop while we have not found a suitable problem.
    let validProblemFound = false;
    let problemData;
    let contestId;
    let contestURL;

    while (!validProblemFound) {
        contestId = possibleContests[Math.floor(Math.random() * possibleContests.length)];
        contestURL = `https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=true`;

        try {
            const response = await fetch(contestURL);
            if (!response.ok) {
                console.log(`Failed to fetch contest data for ID: ${contestId}`);
                continue;
            }

            const data = await response.json();

            problemData = findProblem(data, difficulty);

            if (problemData !== -1) {
                problemData.contestId = contestId;
                problemData.contestName = data.result.contest.name;
                validProblemFound = true;
            }
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }

    return problemData;
}

module.exports = { fetchContest };