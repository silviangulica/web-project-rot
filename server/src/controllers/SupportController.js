const router = require('../routers/router');
const sendMail = require('../services/MailService');
const { getRequestBody } = require('../utils/RequestUtils');

router.add('post', '/support', async (req, res) => {
  const mailObj = {
    from: 'webrot7@gmail.com',
    to: '',
    subject: '',
    text: ''
  };

  const body = await getRequestBody(req);
  const { email, subject, message } = JSON.parse(body);
  mailObj.to = email;
  mailObj.subject = subject;
  mailObj.text = message;

  sendMail(mailObj);
  res.end();

  console.log("[Information]: A new email was sent to: " + email);
});