const html = String.raw;

export default function () {
  return html`
    <div class="container">
      <div class="main-section">
        <!-- Personnel Information -->
        <div class="section">
          <div class="section-header">
            <h6 class="section-title">Personal Info</h6>
            <p class="section-subtitle">
              Upload your photo and personal details here.
            </p>
          </div>

          <div class="form-container">
            <form class="form" id="personal-info-form">
              <div class="">
                <div id="imageLabel" class="image-upload-container">
                  <label class="image-label">
                    <div class="upload-icon">
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="1"
                          y="0.499512"
                          width="23"
                          height="23"
                          rx="3.5"
                          stroke="#575757"
                        />
                        <path
                          d="M12.5004 14.9469V19.9995M12.5004 14.9469L14.1004 16.6311M12.5004 14.9469L10.9004 16.6311"
                          stroke="#878787"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.5 12.7178C20.5 14.6909 19.3448 16.3835 17.7 17.1027M14.4048 8.23277C14.8947 8.05308 15.41 7.96169 15.9288 7.96246C16.452 7.96246 16.9552 8.05425 17.4248 8.22267M17.4248 8.22267C17.1696 5.84709 15.2328 3.99951 12.8808 3.99951C10.356 3.99951 8.3096 6.12835 8.3096 8.75488C8.30896 9.31905 8.40489 9.87873 8.5928 10.4071M17.4248 8.22267C18.1271 8.47604 18.7605 8.90518 19.2704 9.4732M8.5928 10.4071C8.37403 10.3623 8.15167 10.3398 7.9288 10.3397C6.0352 10.3406 4.5 11.9372 4.5 13.9069C4.5 15.5035 5.5088 16.8551 6.9 17.3098M8.5928 10.4071C9.03544 10.4976 9.4568 10.679 9.8328 10.941"
                          stroke="#878787"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <div class="upload-text">
                      <strong style="color: #FFFFFF !important;"
                        >Click to upload</strong
                      >
                      <span class="text-muted">or drag and drop</span>
                    </div>
                    <div class="text-muted">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                    <input
                      type="file"
                      id="imageInput"
                      class="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                <p id="imageInput-error-text" class="error-text"></p>
              </div>

              <div class="form-row">
                <!-- Input -->
                <div class="form-field">
                  <label for="first_name" class="input-label">First Name</label>
                  <input
                    class="input-field"
                    placeholder="first_name"
                    type="text"
                    name="first_name"
                    id="first_name"
                  />
                  <p id="first_name-error-text" class="error-text"></p>
                </div>

                <!-- Input  -->
                <div class="form-field">
                  <label for="last_name" class="input-label">Last Name</label>
                  <input
                    class="input-field"
                    placeholder="last_name"
                    type="text"
                    name="last_name"
                    id="last_name"
                  />
                  <p id="last_name-error-text" class="error-text"></p>
                </div>
              </div>

              <!-- Input -->
              <div class="form-field">
                <label for="username" class="input-label">Username</label>
                <input
                  class="input-field"
                  placeholder="@username"
                  type="text"
                  name="username"
                  id="username"
                />
                <p id="username-error-text" class="error-text"></p>
              </div>

              <div class="form-actions">
                <input type="button" value="Cancel" class="cancel-button" />
                <input
                  type="submit"
                  value="Save Changes"
                  class="submit-button primary-gradient"
                />
              </div>
            </form>
          </div>
        </div>

        <!-- Account Security -->
        <div class="section">
          <div class="section-header">
            <h6 class="section-title">Account security</h6>
            <p class="section-subtitle">
              Manage your account and customize settings
            </p>
          </div>
          <div class="form-container">
            <div class="form">
              <p id="security-error-message" class="error-text"></p>
              <form id="account-security-form" class="form-row">
                <!-- Input -->

                <div class="form-field">
                  <label for="email" class="input-label">Email</label>
                  <div class="change-email-inputs">
                    <input
                      class="input-field"
                      placeholder="jhon@email.com"
                      type="text"
                      name="email"
                      id="email"
                    />
                    <input
                      type="submit"
                      value="Change Email"
                      class="change-email-button"
                    />
                  </div>
                  <p id="email-error-text" class="error-text"></p>
                </div>
              </form>

              <!-- ToggleOption -->
              <div class="toggle-option">
                <div class="toggle-description">
                  <h6 class="toggle-title">2-Step verification</h6>
                  <p class="toggle-text">
                    Add an additional Layer of security to your account during
                    login
                  </p>
                </div>
                <label class="switch">
                  <input type="checkbox" id="enable-2fa" />
                  <span class="slider round"></span>
                </label>
              </div>

              <!-- Option Link -->
              <a href="/settings/block-list" class="option-link">
                <div class="option-description">
                  <h6 class="option-title">Blocklist</h6>
                  <p class="option-text">
                    List of all users that you have blocked
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                >
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m9 5.405 7 7-7 7"
                  />
                </svg>
              </a>

              <!-- Option Link -->
              <div id="logout-btn" class="option-link">
                <div class="option-description">
                  <h6 class="option-title logout">Log out</h6>
                  <p class="option-text logout">Log out of your account</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                >
                  <path
                    stroke="#9C2828"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m9 5.405 7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Change Password -->
        <div class="section">
          <div class="section-header">
            <h6 class="section-title">Password</h6>
            <p class="section-subtitle">
              Please enter your current password to change your password.
            </p>
          </div>
          <div class="form-container">
            <form class="form" id="change-password-form">
              <!-- Input -->
              <p id="error-message" class="error-text"></p>

              <div class="form-field">
                <label for="old_password" class="input-label"
                  >Current password</label
                >
                <input
                  class="input-field"
                  placeholder="********"
                  type="password"
                  name="old_password"
                  id="old_password"
                />
                <p class="error-text" id="old_password-error-text"></p>
              </div>

              <div class="form-group">
                <!-- Input -->
                <div class="form-field">
                  <label for="new_password" class="input-label"
                    >New password</label
                  >
                  <input
                    class="input-field"
                    placeholder="********"
                    type="password"
                    name="new_password"
                    id="new_password"
                  />
                  <p class="error-text" id="new_password-error-text"></p>
                </div>
              </div>

              <!-- Input -->
              <div class="form-field">
                <label for="confirmPassword" class="input-label"
                  >Confirm new password</label
                >
                <input
                  class="input-field"
                  placeholder="********"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                />
                <p class="error-text" id="confirmPassword-error-text"></p>
              </div>

              <div class="form-actions">
                <input type="button" value="Cancel" class="cancel-button" />
                <input
                  type="submit"
                  value="Update password"
                  class="submit-button primary-gradient"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}
