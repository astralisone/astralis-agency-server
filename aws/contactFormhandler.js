const AWS = require("aws-sdk");

// Initialize the SES client
const ses = new AWS.SES({ region: process.env.AWS_REGION || "us-east-1" });

// Target email address
const TO_EMAIL = process.env.TO_EMAIL || "your-email@example.com";

exports.handler = async (event) => {
  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields (name, email, message) are required." }),
      };
    }

    // Compose the email
    const subject = `New Contact Form Submission from ${name}`;
    const emailBody = `
      You have received a new message from your contact form:

      Name: ${name}
      Email: ${email}
      Message:
      ${message}
    `;

    // SES email parameters
    const params = {
      Source: TO_EMAIL, // Verified SES email
      Destination: {
        ToAddresses: [TO_EMAIL],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: emailBody },
        },
      },
    };

    // Send the email
    await ses.sendEmail(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Your message has been sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send the message. Please try again later." }),
    };
  }
};
