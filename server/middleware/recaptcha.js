const axios = require('axios');

const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;
 
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA token is required' });
    }

    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        }
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ message: 'Invalid reCAPTCHA' });
    }

    next();
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    res.status(500).json({ message: 'reCAPTCHA verification failed' });
  }
};

module.exports = verifyRecaptcha;