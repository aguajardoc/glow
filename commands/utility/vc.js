// Suggests a random gym as a virtual contest, yet does not actually track info.
// Give priority to
// 1. Most recent gyms
// 2. Gyms where the user has no solves

const { fetchContest } = require("../../command_helpers/problem-fetcher");