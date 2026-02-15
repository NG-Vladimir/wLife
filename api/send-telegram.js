/**
 * Vercel serverless: отправка сообщений в Telegram через бота.
 * Токен бота задаётся в Environment Variables (BOT_TOKEN).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'BOT_TOKEN not configured' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  const results = [];
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  for (const { chatId, text } of messages) {
    if (!chatId || !text) continue;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.startsWith('@') ? chatId : '@' + chatId,
          text: String(text).slice(0, 4096),
          disable_web_page_preview: true
        })
      });
      const data = await r.json();
      results.push({ chatId, ok: !!data.ok, error: data.description });
    } catch (e) {
      results.push({ chatId, ok: false, error: String(e.message) });
    }
  }

  const failed = results.filter(x => !x.ok);
  if (failed.length > 0) {
    return res.status(207).json({ ok: false, results });
  }
  return res.status(200).json({ ok: true, results });
}
