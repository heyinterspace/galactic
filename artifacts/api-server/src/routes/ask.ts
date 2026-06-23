import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { TranslateAskBody } from "@workspace/api-zod";
import { translateQuestion } from "../lib/ask";

// The translator hits a paid LLM on every call, so it gets its own tighter
// per-IP budget on top of the global 120 req/min REST limiter (app.ts), plus a
// hard cap on question length — so one visitor or bot can't run up cost or abuse
// the model. Tune all three knobs here (kept in code, like the presence guards).
const ASK_WINDOW_MS = 60_000; // rolling per-IP window
const ASK_MAX_PER_WINDOW = 8; // translate calls allowed per IP per window
const MAX_QUESTION_CHARS = 500; // reject longer questions before the LLM call

const askLimiter = rateLimit({
  windowMs: ASK_WINDOW_MS,
  max: ASK_MAX_PER_WINDOW,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many questions — please slow down and try again shortly." },
});

const router: IRouter = Router();

// Translate a plain-English question into a structured query spec. The model
// only fills query slots; the browser computes the actual answer locally over
// its baked data, so no paper data leaves the visitor's browser.
router.post("/ask/translate", askLimiter, async (req, res) => {
  const parsed = TranslateAskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "A question is required." });
    return;
  }
  // Cap length server-side before paying for an LLM call.
  if (parsed.data.question.length > MAX_QUESTION_CHARS) {
    res
      .status(400)
      .json({ error: `Your question is too long (max ${MAX_QUESTION_CHARS} characters).` });
    return;
  }
  try {
    const query = await translateQuestion(parsed.data, req.log);
    res.json(query);
  } catch (err) {
    req.log.error({ err }, "failed to translate question");
    res.status(502).json({ error: "The question translator is unavailable right now." });
  }
});

export default router;
