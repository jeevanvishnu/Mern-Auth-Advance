import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient , sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email , verificationToken) =>{
    console.log(email , verificationToken);

    const recipient = [{email}]

    try {

        const response = await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        })
        .then(console.log,console.error)
        console.log("Email Send sucessfully" , response);
        
        
    } catch (error) {
        console.log(error.message);
        
        throw new Error("Sending verification code error")
    }
}

