// @desc  Handles the logic if the user has already voted.
const handleExistingVote = async (existingVote, vote, userId, answer, res) => {
  if (existingVote.vote === vote) {
    await retractVote(vote, userId, answer);
  } else {
    await switchVote(vote, userId, answer);
  }
  return res.status(200).json(answer);
};

// @desc  Retracts a users vote.
const retractVote = async (vote, userId, answer) => {
  answer.totalVoteScore -= vote === "upvote" ? 1 : -1;
  answer.userVotes = answer.userVotes.filter(
    (v) => v.userId.toString() !== userId.toString()
  );
  await answer.save();
};

// @desc  Switches the users vote from one to another.
const switchVote = async (vote, userId, answer) => {
  answer.totalVoteScore += vote === "upvote" ? 2 : -2;
  answer.userVotes = answer.userVotes.map((v) =>
    v.userId.toString() === userId.toString() ? { ...v, vote: vote } : v
  );
  await answer.save();
};

// @desc  Adds a new vote if the user hasn't voted before.
const handleNewVote = async (vote, userId, answer, res) => {
  answer.totalVoteScore += vote === "upvote" ? 1 : -1;
  answer.userVotes.push({ userId, vote });
  await answer.save();
  return res.status(200).json(answer);
};

module.exports = { handleNewVote, handleExistingVote };
