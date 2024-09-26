const RoundList = (list, size, round_number) => {
  if (!list) list = [];
  for (let i = list.length; i < size; i++) {
    list.push({
      player: {},
      round_number: round_number || -1,
    });
  }
  return list;
};

const get_max_round = (max_player) => {
  let count = 0;
  let result = max_player;
  while (true) {
    result = result / 2;
    count++;
    if (result <= 1) return count;
  }
};

export const processBracketData = (data, max_players, finished, rp) => {
  const len = rp;
  max_players = finished && len < max_players ? len : max_players;

  data = RoundList(data, max_players, 1);
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const index = (data[i]?.round_number || 1) - 1;
    if (!result[index]) result[index] = [];
    result.at(index)?.push(data[i]);
  }
  for (let i = 1; i < get_max_round(max_players); i++)
    result[i] = RoundList(result[i], max_players / Math.pow(2, i));

  let first_half = result.map((data) => {
    return data.slice(0, data.length / 2);
  });
  let second_half = result.map((data) => data.slice(data.length / 2));
  return [first_half, second_half];
};
