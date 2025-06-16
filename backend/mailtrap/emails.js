import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE} from "./emailTemplate.js";
import { mailtrapClient , sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email , verificationToken) =>{
    console.log(email , verificationToken);

    const recipient = [{email}]

    try {

         await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        })
        .then(console.log,console.error)
        console.log("Email Send sucessfully" );
        
        
    } catch (error) {
        console.log(error.message);
        
        throw new Error("Sending verification code error")
    }
}


export const sendWelcomeEmail = async (email , name) => {
    const recipient = [{email}]
    try {

          await mailtrapClient.send({
            from:sender,
            to:recipient,
            template_uuid: "a7d0b648-3ffb-4a12-b399-04f7235d2db9",
            template_variables: {
                "company_info_name": "Mern Auth",
                "name": name,
                }
            })
            .then(console.log,console.error)
            console.log("Email Send sucessfully" );
    } catch (error) {
        console.log(error.message);
        throw new Error("Sending verification code error")
    }
}


export  const  sendPasswordResetEmail  = async (email , resetURL) =>{
    const recipient = [{email}]
    try {
        
          await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"password Reset"
            })
            .then(console.log,console.error)
            console.log("Email Send sucessfully" );


    } catch (error) {
        console.log(error.message);
        throw new Error("Error sending password reset email ",error.message)
        
    }
}