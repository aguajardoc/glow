// Searches through all Codeforces Gyms in search of three conditions:
// 1. The contest is of type "ICPC".
// 2. The contest is of kind "Official ICPC Contest".
// 3. It's in English.
// The Codeforces API holds information regarding the first two points, but the third one must be solved differently.
// In this sense, Franc's language detection capabilities. It's not perfect, but it's a good solution.

// This file is ran through a cron job once a week to maintain contest data up to date.

import { getArrayPossibleGymContests, getArrayPossibleNonGymContests, getLastCheckedGym, getLastCheckedNonGym } from './possible-contests.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

// Required to update contest information.
const contestsFilePath = path.join(__dirname, 'contests.json');

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

async function addICPCGyms() {
    // Array to return.
    let possibleContests = [];

    // Set URL for the list of gyms.
    const gymListURL = 'https://codeforces.com/api/contest.list?gym=true';

    // Get last checked gym in previous runs.
    const firstToCheck = getLastCheckedGym() + 1;

    try {
        const response = await fetch(gymListURL);
        if (!response.ok) {
            console.log('Failed to fetch gym data.');
            return possibleContests;
        }

        const data = await response.json();

        for (const contest of data.result) {
            // Speed-up to avoid rechecking contests.
            if (contest.id < firstToCheck) {
                continue;
            }

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

    return possibleContests;
}

async function addICPCNonGyms() {
    // Array to return.
    let possibleContests = [];

    // Set URL for the list of non-gyms.
    const nonGymListURL = 'https://codeforces.com/api/contest.list?gym=false';
    
    // Get last checked non-gym in previous runs.
    const firstToCheck = getLastCheckedNonGym() + 1;

    try {
        const response = await fetch(nonGymListURL);
        if (!response.ok) {
            console.log('Failed to fetch gym data.');
            return possibleContests;
        }

        const data = await response.json();

        for (const contest of data.result) {
            // Speed-up to avoid rechecking contests.
            if (contest.id < firstToCheck) {
                continue;
            }
            // Get the type of every contest, and verify that it is an Official ICPC Contest.
            const contestType = contest.type;
            const contestName = contest.name;
            const contestDuration = contest.durationSeconds;

            if (contestType === 'ICPC' && contestName.includes('ICPC') && contestDuration === 18000) {
                console.log(contest.id, true);
                possibleContests.push(contest.id);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }

    return possibleContests;
}

// Function to update possible contests with those that meet the three conditions.
async function updatePossibleContests() {
    let gymContests = getArrayPossibleGymContests();
    let nonGymContests = getArrayPossibleNonGymContests();

    // Add all new valid contest IDs.
    gymContests = gymContests.concat(await addICPCGyms());
    nonGymContests = nonGymContests.concat((await addICPCNonGyms()).sort()); // Sorted to keep increasing order for both arrays.

    // Structure for JSON.
    const updatedContests = {
        gymContests,
        nonGymContests
    };

    // Write the updated contests to JSON.
    try {
        fs.writeFileSync(contestsFilePath, JSON.stringify(updatedContests, null, 4));
        console.log('Contests successfully written to contests.json');
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
}

updatePossibleContests();