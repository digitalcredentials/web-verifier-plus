import nodemailer from 'nodemailer'
import axios from 'axios'

const serviceURL = process.env.HEALTH_CHECK_SERVICE_URL
const serviceName = process.env.HEALTH_CHECK_SERVICE_NAME
const shouldPostToWebHook = process.env.HEALTH_CHECK_WEB_HOOK
const shouldSendEmail =
  process.env.HEALTH_CHECK_SMTP_HOST &&
  process.env.HEALTH_CHECK_SMTP_USER &&
  process.env.HEALTH_CHECK_SMTP_PASS &&
  process.env.HEALTH_CHECK_EMAIL_FROM &&
  process.env.HEALTH_CHECK_EMAIL_RECIPIENT

  /*
  This is intended to be called from the Docker HEALTHCHECK.
  */
async function callHealthz() {
  try {
    const response = await axios.get(serviceURL)
    const body = response.data
    //console.log(body)
    if (body?.healthy === true) {
      process.exit(0)
    }
    await notify(`${serviceName} is unhealthy and will restart after 3 tries. Returned messages: \n ${body.error}`)
    process.exit(1)

  } catch (e) {
    await notify(`${serviceName} is unhealthy and will restart after 3 tries. Messages: \n ${e.response.data.error}`)
    process.exit(1)
  }
}

async function notify(message) {
  if (shouldSendEmail) await sendMail(message)
  if (shouldPostToWebHook) await postToWebHook(message)
}

async function postToWebHook(text) {
  await axios
    .post(process.env.HEALTH_CHECK_WEB_HOOK, { text })
    .catch((error) => {
      console.error(error)
    })
}

async function sendMail(message) {
  const messageParams = {
    from: process.env.HEALTH_CHECK_EMAIL_FROM,
    to: process.env.HEALTH_CHECK_EMAIL_RECIPIENT,
    subject: process.env.HEALTH_CHECK_EMAIL_SUBJECT,
    text: message
  }

  const mailTransport = {
    host: process.env.HEALTH_CHECK_SMTP_HOST,
    auth: {
      user: process.env.HEALTH_CHECK_SMTP_USER,
      pass: process.env.HEALTH_CHECK_SMTP_PASS
    },
    ...(process.env.HEALTH_CHECK_SMTP_PORT && {
      port: process.env.HEALTH_CHECK_SMTP_PORT
    })
  }

  const transporter = nodemailer.createTransport(mailTransport)
  await transporter.sendMail(messageParams)

}

callHealthz()