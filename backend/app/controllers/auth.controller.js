import * as AuthService from "../services/auth.service.js";

export async function postSignup(req, res) {
  console.log(req.body, "<======");
  const { name, email, password } = req.body;
  const result = await AuthService.signup({ name, email, password });
  res.status(201).json(result);
}

export async function postLogin(req, res) {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });
  res.json(result);
}

export async function getMe(req, res) {
  res.json({ user: req.user });
}
