import html from "../../../lib/html-template.js";

export default function () {
    return html`
    <div class="container">
        <div class="main-section">
            <!-- Personnel Information -->
            <div class="section">
                <div class="section-header">
                    <h6 class="section-title">Personal Info</h6>
                    <p class="section-subtitle">Upload your photo and personal details here.</p>
                </div>
                <div class="form-container">
                    <form class="form">
                        <div class="form-group">
                            <label class="file-upload">
                                <!-- Selected Image -->
                                <div class="image-preview">
                                    <img src="" alt="uploaded-image" class="image" />
                                    <div class="close-icon">
                                        <img src="/assets/icons/light_close.png" alt="close-icon" />
                                    </div>
                                </div>
                                <!-- Upload Icon -->
                                <div class="upload-icon">
                                    <img src="/assets/icons/upload.png" alt="upload-icon" />
                                </div>
                                <p class="upload-text">
                                    <span class="upload-text-bold"> Click to upload </span>
                                    or drag and drop
                                    <br />
                                    SVG, PNG, JPG or GIF (max. 800x400px)
                                </p>
                                <input type="file" name="image_file" class="file-input" />
                            </label>
                            <p class="error-text">error text</p>
                        </div>

                        <div class="form-row">
                            <!-- Input -->
                            <div class="form-field">
                                <label for="firstname" class="input-label">First Name</label>
                                <input class="input-field" placeholder="user.user.first_name" type="text" name="firstname" id="firstname" />
                                <p class="error-text"></p>
                            </div>

                            <!-- Input  -->
                            <div class="form-field">
                                <label for="lastname" class="input-label">Last Name</label>
                                <input class="input-field" placeholder="user.user.last_name" type="text" name="lastname" id="lastname" />
                                <p class="error-text"></p>
                            </div>
                        </div>

                        <!-- Input -->
                        <div class="form-field">
                            <label for="username" class="input-label">Username</label>
                            <input class="input-field" placeholder="@user.user.username" type="text" name="username" id="username" />
                            <p class="error-text"></p>
                        </div>

                        <div class="form-actions">
                            <input type="button" value="Cancel" class="cancel-button" />
                            <input type="submit" value="Save Changes" class="submit-button primary-gradient" />
                        </div>
                    </form>
                </div>
            </div>

            <!-- Account Security -->
            <div class="section">
                <div class="section-header">
                    <h6 class="section-title">Account security</h6>
                    <p class="section-subtitle">Manage your account and customize settings</p>
                </div>
                <div class="form-container">
                    <div class="form">
                        <form class="form-row">
                            <!-- Input -->
                            <div class="form-field">
                                <label for="email" class="input-label">Email</label>
                                <input class="input-field" placeholder="@user.user.email" type="text" name="email" id="email" />
                                <p class="error-text"></p>
                            </div>

                            <div class="change-email-container">
                                <input type="submit" value="Change Email" class="change-email-button" />
                            </div>
                        </form>

                        <!-- ToggleOption -->
                        <div class="toggle-option">
                            <div class="toggle-description">
                                <h6 class="toggle-title">2-Step verification</h6>
                                <p class="toggle-text">Add an additional Layer of security to your account during login</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" />
                                <span class="slider"></span>
                            </label>
                        </div>

                        <!-- Option Link -->
                        <a href="/settings/block-list" class="option-link">
                            <div class="option-description">
                                <h6 class="option-title">Blocklist</h6>
                                <p class="option-text">List of all users that you have blocked</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5.405 7 7-7 7" />
                            </svg>
                        </a>

                        <!-- Option Link -->
                        <a href="/" class="option-link">
                            <div class="option-description">
                                <h6 class="option-title logout">Log out</h6>
                                <p class="option-text logout">Log out of your account</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                                <path stroke="#9C2828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 5.405 7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Change Password -->
            <div class="section">
                <div class="section-header">
                    <h6 class="section-title">Password</h6>
                    <p class="section-subtitle">Please enter your current password to change your password.</p>
                </div>
                <div class="form-container">
                    <form class="form" onSubmit="{handleSubmit(OnSubmit)}">
                        <!-- Input -->
                        <div class="form-field">
                            <label for="old_password" class="input-label">Current password</label>
                            <input class="input-field" placeholder="********" type="password" name="old_password" id="old_password" />
                            <p class="error-text"></p>
                        </div>

                        <div class="form-group">
                            <!-- Input -->
                            <div class="form-field">
                                <label for="new_password" class="input-label">New password</label>
                                <input class="input-field" placeholder="********" type="password" name="new_password" id="new_password" />
                                <p class="error-text"></p>
                            </div>
                        </div>

                        <!-- Input -->
                        <div class="form-field">
                            <label for="confirmPassword" class="input-label">Confirm new password</label>
                            <input class="input-field" placeholder="********" type="password" name="confirmPassword" id="confirmPassword" />
                            <p class="error-text"></p>
                        </div>

                        <div class="form-actions">
                            <input type="button" value="Cancel" class="cancel-button" />
                            <input type="submit" value="Update password" class="submit-button primary-gradient" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`
}