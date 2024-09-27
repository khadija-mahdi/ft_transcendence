import html from "/src/lib/html-template.js";

export default function () {
  return html`
    <div id="notifications-panel" class="notifications-panel">
      <div class="notifications-title">NOTIFICATION</div>
      <div class="notifications-divider"></div>
      <div class="notifications-content">
        <div id="notifications-list" class="notifications-list">
          <div class="notifications-item">
            <a href="" class="notifications-link">
              <div class="notifications-image-container">
                <img
                  class="notifications-image"
                  onerror="this.src='/public/assets/images/defaultImageProfile.jpeg';"
                  alt="Profile Image"
                  width="35"
                  height="35"
                />
              </div>
              <div class="notifications-text-container">
                <div class="notifications-text"></div>
                <div class="notifications-time"></div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
