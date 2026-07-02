import resend
from core.config import settings
from core.logger import logger

resend.api_key = settings.RESEND_API_KEY


def send_renewal_reminder(to_email: str, sub_name: str, platform: str, cost: float,
                          billing_cycle: str, renewal_date, days_before: int) -> bool:
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set; skipping email to %s", to_email)
        return False

    when = "today" if days_before == 0 else f"in {days_before} day{'s' if days_before != 1 else ''}"
    subject = f"{platform} renews {when} — {sub_name}"
    renewal_str = renewal_date.strftime("%B %d, %Y")

    html = f"""
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:0 auto;color:#111">
      <h2 style="margin-bottom:4px">Upcoming renewal</h2>
      <p style="color:#555;margin-top:0">Your subscription is renewing {when}.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0;color:#888">Subscription</td><td style="padding:6px 0;text-align:right;font-weight:600">{sub_name}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Platform</td><td style="padding:6px 0;text-align:right">{platform}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Cost</td><td style="padding:6px 0;text-align:right">${cost:.2f}/{billing_cycle}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Renewal date</td><td style="padding:6px 0;text-align:right">{renewal_str}</td></tr>
      </table>
      <p style="color:#999;font-size:12px">Sent by Subscription Manager.</p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": to_email,
            "subject": subject,
            "html": html,
        })
        logger.info("Sent renewal reminder to %s for %s", to_email, sub_name)
        return True
    except Exception as exc:
        logger.error("Failed to send reminder to %s: %s", to_email, exc)
        return False
