// Searches through all Codeforces Gyms in search of three conditions:
// 1. The contest is of type "ICPC".
// 2. The contest is of kind "Official ICPC Contest".
// 3. It's in English.
// The Codeforces API holds information regarding the first two points, but the third one is somewhat solved through
// Franc's language detection capabilities. It's not perfect, but it's a good solution.

const fs = require('node:fs');
const path = require('node:path');

// Function to validate the language of the contest problems using the Franc library.
async function validateLanguage(contestId) {
    // Dynamically import 'node-fetch' and franc as they are ES modules.
    const fetch = (await import('node-fetch')).default;
	const { franc } = await import('franc-min');
    // Fetch the problem names from the API.
    const contestURL = `https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=true`;

    try {
        const response = await fetch(contestURL);
        if (!response.ok) {
            console.log(`Failed to fetch contest data for ID: ${contestId}`);
            return false;
        }

        const data = await response.json();

        // Append all problem names to a string.
        let problemNames = '';
        for (const problem of data.result.problems) {
            problemNames = [problemNames, problem.name].join(' ');
        }

        // Use Franc to detect the language of the problem names contained within the string.
        const contestLanguage = franc(problemNames);

        // If the detected language is in the banned languages list (manually filtered), return false.
        const bannedLanguages = ['ukr', 'und', 'rus', 'cmn', 'bul', 'srp'];
        let validLanguage = true;

        for (const language of bannedLanguages) {
            if (contestLanguage === language) {
                validLanguage = false;
                break;
            }
        }

        return validLanguage;

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// Function to get possible contests that meet the three conditions.
async function getPossibleContests() {
    // Dynamically import 'node-fetch' for use in the function.
    const fetch = (await import('node-fetch')).default;
    // Set URL for the list of gyms.
    const gymListURL = 'https://codeforces.com/api/contest.list?gym=true';
    // Array to return, with all valid contest IDs.
    let possibleContests = [];

    try {
        const response = await fetch(gymListURL);
        if (!response.ok) {
            console.log('Failed to fetch gym data.');
            return possibleContests;
        }

        const data = await response.json();

        for (const contest of data.result) {
            // Get the type and kind of every contest, and verify that it is an Official ICPC Contest.
            const contestType = contest.type;
            const contestKind = contest.kind;

            // Additional check: make sure the contest is in English to avoid issues with users not
            // being able to understand the problem they've been given. 
            if (contestType === 'ICPC' && contestKind === 'Official ICPC Contest') {
                const isValidLanguage = await validateLanguage(contest.id);
                console.log(contest.id, isValidLanguage);
                if (isValidLanguage) {
                    possibleContests.push(contest.id);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Convert the array to a string through JSON before writing to file.
    const content = JSON.stringify(possibleContests);
    const filePath = path.resolve(process.env.HOME || process.env.USERPROFILE, 'Documents/Projects/glow-bot/glow/array.txt');

    // Write the file.
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });

    return possibleContests;
}

getPossibleContests();
