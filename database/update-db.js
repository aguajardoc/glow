import fetch from 'node-fetch';

// URL with every contest from a gym in Codeforces.
const contestAPI = 'https://codeforces.com/api/contest.list?gym=true';

// Function to process the contest data
function processContests(contestList) {
    for (const contest of contestList) {
        // Check if it is an official ICPC contest
        if (contest.type !== 'ICPC' || contest.kind !== 'Official ICPC Contest') {
            continue;
        }

        const contestStandings = `https://codeforces.com/api/contest.standings?contestId=${contest.id}&showUnofficial=true`;

        console.log(contestStandings);
    }
}

// Make a GET request
fetch(contestAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })

    .then(data => {
        const contestList = data.result;
        processContests(contestList);
    })

    .catch(error => {
        console.error('Error:', error);
    });