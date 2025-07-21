const { Resend } = require("resend");
const resend = new Resend("re_iGWGKo5e_zccDZAbNY2DvTTu9AdGXxvUQ"); // your API key

resend.emails.send({
  from: "Cosmos Realty <onboarding@resend.dev>",
  to: "julapallivijay66@gmail.com",
  subject: "🔧 Simple Test Email",
  html: "<p>Hello from Resend test!</p>",
}).then(console.log).catch(console.error);
