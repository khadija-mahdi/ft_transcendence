import sign_in from "./View/sing_in.js";
import sign_in_verify from "./View/totp.js";
import sign_up  from "./View/sign_up.js";
import email from "./View/email_ver.js";
import info from "./View/use_info.js";

import controller_sign_in from "./Controller/sing_in.js";
import controller_2fa from "./Controller/totp.js";
import controller_sign_up  from "./Controller/sign_up.js";
import controller_email from "./Controller/email_ver.js";
import controller_info from "./Controller/use_info.js";



export default {sign_in, sign_in_verify ,sign_up ,email ,info ,controller_sign_in, controller_2fa ,controller_sign_up ,controller_email ,controller_info}