const html = String.raw;

export function achievementItem({ name, description, icon }) {
  return html`
    <li class="top-achievement-container">
      <div class="top-achievement-content">
        <h6 class="top-achievement-title">${name}</h6>
        <p class="top-achievement-description">${description}</p>
      </div>
      <div class="top-achievement-icon">
        <img
          src="${icon}"
          onerror="this.src='/public/assets/icons/empty.svg';"
          alt="Icon"
          class="top-achievement-image"
        />
      </div>
    </li>
  `;
}
