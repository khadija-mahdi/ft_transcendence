import { fetchRanking } from "/src/_api/user.js";
import { rankingItem } from "/src/components/Ranking/View/Ranking.js";
export default async function () {
  const ranking = document.getElementById("ranking-table-body");
  const data = await fetchRanking();
  data.results.forEach((item, index) => {
    const tr = rankingItem({index: index + 1, ...item});
    ranking.innerHTML += tr;
  });
}
