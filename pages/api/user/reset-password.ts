import { resetPassword, resetPasswordMail } from "backend/controller/user.controller";

export default async function handler(req, res) {
  const { mail, token, pwd } = req.body;
  let resp = null;

  try {
    if (token && pwd) {
      resp = await resetPassword({ token, pwd });
    } else if (mail) {
      resp = await resetPasswordMail({ mail });
    }
    res.status(200).json(resp);
  } catch (e) {
    res.status(500).json(resp);
  }
 
}
