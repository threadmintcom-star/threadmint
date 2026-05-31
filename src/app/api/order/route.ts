import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const { type, design, customDesc, name, email, size, qty, notes } = data;

  if (!email || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const orderEmail = process.env.ORDER_EMAIL ?? "threadmint.com@gmail.com";
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Mailer not configured" }, { status: 500 });
  }

  const subject = `New ThreadMint order from ${name}`;
  const html = `
    <h2>New Order</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:6px 12px;color:#555">Type</td><td style="padding:6px 12px;font-weight:600">${type === "premade" ? "Pre-made" : "Custom"}</td></tr>
      <tr><td style="padding:6px 12px;color:#555">Design</td><td style="padding:6px 12px;font-weight:600">${design || customDesc}</td></tr>
      <tr><td style="padding:6px 12px;color:#555">Size</td><td style="padding:6px 12px;font-weight:600">${size}</td></tr>
      <tr><td style="padding:6px 12px;color:#555">Qty</td><td style="padding:6px 12px;font-weight:600">${qty}</td></tr>
      <tr><td style="padding:6px 12px;color:#555">Customer</td><td style="padding:6px 12px;font-weight:600">${name}</td></tr>
      <tr><td style="padding:6px 12px;color:#555">Email</td><td style="padding:6px 12px;font-weight:600">${email}</td></tr>
      ${notes ? `<tr><td style="padding:6px 12px;color:#555">Notes</td><td style="padding:6px 12px">${notes}</td></tr>` : ""}
    </table>
    <p style="font-family:sans-serif;font-size:13px;color:#888;margin-top:16px">Reply to this email to send the customer a payment link.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ThreadMint Orders <onboarding@resend.dev>",
      to: [orderEmail],
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
