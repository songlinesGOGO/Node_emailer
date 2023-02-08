const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const app = express();

// set view engine
app.engine('handlebars', exphbs({
  extname: "handlebars",
  defaultLayout: false,
  layoutsDir: "views/"
}));
app.set('view engine', 'handlebars');

// set static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>New Message from Contact Form</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // transporter object using SMTP transport
  let transporter = nodemailer.createTransport(smtpTransport({
    // service: 'yahoo.co.jp',
    host: 'smtp.mail.yahoo.co.jp',
    port: 465,
    secure: true, // true for 465, false for other ports
    greetingTimeout : 1000 *10,
    auth: {
        user: 'qilijeni@yahoo.co.jp',
        pass: '###'
    },
    tls:{
      rejectUnauthorized:true
    }
  }));

  // setup email data
  let mailOptions = {
      from: '"Nodemailer Contact" <qilijeni@yahoo.co.jp>', 
      to: 'qilijeni@yahoo.co.jp', 
      subject: 'Node Contact Request', 
      text: 'Hello world?', 
      html: output
  };

  // send mail with transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));