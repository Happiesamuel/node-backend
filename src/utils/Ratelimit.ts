import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const byEmail = (req: any) =>
  String(req.body?.email ?? "unknown")
    .trim()
    .toLowerCase();

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again later." },
});

export const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: byEmail,
  message: { message: "Too many requests. Try again later." },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again later." },
});

export const loginAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${ipKeyGenerator(req.ip ?? "")}:${String(req.body?.email ?? "")
      .trim()
      .toLowerCase()}`,
  message: {
    message: "Too many failed login attempts. Try again in 15 minutes.",
  },
});

// 2. One IP trying many emails: 30 failures / 15 min
export const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many failed login attempts. Try again later." },
});

// 3. Many IPs targeting one email (distributed guessing): 20 failures / hour
export const loginEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) =>
    String(req.body?.email ?? "unknown")
      .trim()
      .toLowerCase(),
  message: {
    message:
      "Too many failed login attempts for this account. Try again later.",
  },
});
