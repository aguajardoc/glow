import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
import { franc } from 'franc-min';

async function validateLanguage(contestId){
	// Fetch the problem names from the API.
    const contestURL = `https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=true`;

    try {
        const response = await fetch(contestURL);
        if (!response.ok) {
            console.log(`Failed to fetch contest data for ID: ${contestId}`);
        }

        const data = await response.json();

		// Append all problem names to a string.
        let problemNames;
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
			}
		}

        return validLanguage;
        
    } 
    catch (error) {
        console.error('Error:', error);
    }
}

async function getPossibleContests() {
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
				if (isValidLanguage === true) {
					possibleContests.push(contest.id);
				}
			}
		}
	} catch (error) {
		console.error('Error:', error);
	}

	// Convert the array to a string through JSON before writing to file.
	const content = JSON.stringify(possibleContests);
	const filePath = path.resolve(process.env.HOME || process.env.USERPROFILE, 'Documents/Projects/glow-bot/array.txt');

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
