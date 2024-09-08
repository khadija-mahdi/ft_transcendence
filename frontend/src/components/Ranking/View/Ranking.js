import html from "/src/lib/html-template.js";

export default function () {
  return html`
    <div class="container">
      <div class="ranking-box">
        <div class="header">
          <h6>Ranking</h6>
        </div>
        <div class="ranking-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player FullName</th>
                <th>Tournament played</th>
                <th>Experience Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><p>1</p></td>
                <td><p>fullName</p></td>
                <td><p>60 Tournaments</p></td>
                <td><p>100 XP</p></td>
              </tr>
              <tr>
                <td><p>1</p></td>
                <td><p>fullName</p></td>
                <td><p>60 Tournaments</p></td>
                <td><p>100 XP</p></td>
              </tr>
              <tr>
                <td><p>1</p></td>
                <td><p>fullName</p></td>
                <td><p>60 Tournaments</p></td>
                <td><p>100 XP</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
	`;
};
