# glow - The Discord Bot for ICPC Training

## Motivation
For years, the main ways to practice for the ICPC have been through simulations of past contests or through the use of online judges like Codeforces, uVA, or even Leetcode. Although the first option seems ideal, not everyone can afford to practice for four to five consecutive hours, especially considering the commitment needed by all three members of a typical ICPC team. On the other side, Codeforces' problems not necessarily reflect what ICPC puzzles bring to the table, Leetcode's aren't focused enough on Competitive Programming, and uVA's inputs are just painful to deal with. Considering TLE's success as a Discord Bot for Codeforces practice, I wanted to bring this idea to the ICPC environment, aiming for an option to practice in short bursts, while staying close to the ICPC problem-solving experience.

## Introduction
This Discord Bot is designed to make ICPC training more directed towards the unpredictable environment in which ICPC contests take place. Problems are essentially random in these competitions, so it might be useful for one's training to be too. Of course, fetching a random problem from every contest ever created is not viable, as people might get problems way outside their skill level which, while true to the ICPC, this does not promote one's competitive programming skills. As such, a rating system is in place to combat this, allowing players to practice with problems in their comfort zone, encouraging them to try *slightly* harder problems once in a while.

## How it Works
As of now, one of the biggest hubs for past ICPC problemsets is Codeforces, by way of their Gym tab. Fortunately, the Codeforces API allows us to filter through ICPC contests, meaning that we can fetch any problem from any ICPC contest, as long as it's available on Codeforces.

## Rating System
Currently, problems are classified in one of ten levels, based on the following ratio:

$$ \frac{\text{Number of users who solved the problem}}{\text{Number of users who participated in the contest}} $$

And categorized according to the following table:

| Percent Solved | Difficulty |
|----------------|------------|
| 60 - 100       | 1          |
| 45 - 60        | 2          |
| 33 - 45        | 3          |
| 25 - 33        | 4          |
| 20 - 25        | 5          |
| 15 - 20        | 6          |
| 10 - 15        | 7          |
| 5 - 10         | 8          |
| 2 - 5          | 9          |
| 0 - 2          | 10         |

The numbers used for the calculation are based on the **total and updated** counts, not just the solved and participation counts of the original ICPC contest. This is done for two reasons:
1. Some contest managers do not upload ghost data, making the calculation of a rating impossible.
2. The number of solves within a contest does not reflect the true difficulty of a problem.

Note that this distribution is subject to any changes, based on the community's perception of the ranges.

Finally, it is important to note that not all problems within a difficulty bracket are created equally. A 2 in an ICPC World Finals contest *will* be way harder than a 2 at a sub-regional contest

## Current State of Development
This project is a work in progress. The main functionality is finished, but many, many things are still missing for this to be considered a complete package.

Currently, the following features are in consideration:
### 1. A "gitgud" functionality.
Like gimme, but with a connection to the database to track:
a. If the user has an ongoing problem to solve
b. 2. What problems the user has solved, with their respective point counts
The user MUST solve this problem (or mark it as nogud) to ask for a new one.

### 2. A server-wide leaderboard for gitgud users

### 3. Ladder mode
A different mode of training: allows a user to train progressively harder problems starting from a set difficulty. For example, a user can start at difficulty 3, solve the problem, and go up to 4,and so on until they feel like stopping or they fail to complete a problem within a time limit. Keep statistics like time taken, problems solved, and reached difficulty for self-comparison and leaderboards.

### 4. Region filters
Make practice more focused in what your region has offerred in the past!
