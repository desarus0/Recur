from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

from core.logger import logger
from services.db.subscriptions import (
    get_notifiable_subscriptions,
    get_active_subscriptions,
    mark_notified,
    set_renewal_date,
)
from services.db.users import get_user_by_clerk_id
from services.db.notifications import log_notification
from services.email.sender import send_renewal_reminder


def _advance(renewal: date, billing_cycle: str) -> date:
    step = relativedelta(years=1) if billing_cycle == "yearly" else relativedelta(months=1)
    while renewal < date.today():
        renewal = renewal + step
    return renewal


async def roll_forward_renewals() -> None:
    today = date.today()
    subs = await get_active_subscriptions()
    rolled = 0

    for sub in subs:
        if sub.renewal_date >= today:
            continue
        new_renewal = _advance(sub.renewal_date, sub.billing_cycle)
        if new_renewal != sub.renewal_date:
            await set_renewal_date(sub.id, new_renewal)
            rolled += 1

    if rolled:
        logger.info("Rolled forward %d subscription renewal date(s)", rolled)


async def send_reminder_for(sub, user_email: str, kind: str = "reminder") -> bool:
    days_before = sub.notify_days_before if sub.notify_days_before is not None else 0
    sent = send_renewal_reminder(
        to_email=user_email,
        sub_name=sub.name,
        platform=sub.platform,
        cost=sub.cost,
        billing_cycle=sub.billing_cycle,
        renewal_date=sub.renewal_date,
        days_before=days_before,
    )

    if sent:
        await log_notification(
            user_id=sub.user_id,
            subscription_id=sub.id,
            subscription_name=sub.name,
            platform=sub.platform,
            to_email=user_email,
            kind=kind,
            days_before=days_before,
            renewal_date=sub.renewal_date,
        )

    return sent


async def run_renewal_notifications() -> None:
    today = date.today()
    subs = await get_notifiable_subscriptions()
    logger.info("Renewal notification job: checking %d subscription(s)", len(subs))

    for sub in subs:
        renewal = sub.renewal_date
        notify_on = renewal - timedelta(days=sub.notify_days_before)

        if notify_on != today:
            continue
        if sub.last_notified_renewal == renewal:
            continue

        user = await get_user_by_clerk_id(sub.user_id)
        if not user or not user.get("email"):
            logger.warning("No email for user %s; skipping sub %s", sub.user_id, sub.id)
            continue

        if await send_reminder_for(sub, user["email"]):
            await mark_notified(sub.id, renewal)


async def run_daily_tasks() -> None:
    await roll_forward_renewals()
    await run_renewal_notifications()
