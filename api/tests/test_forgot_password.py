from datetime import datetime, timedelta, timezone
from unittest.mock import ANY, AsyncMock, patch

import pytest

from app.models.user import User
from app.services.auth import OTP_TTL_MINUTES, issue_otp, send_otp_email, verify_otp


@pytest.mark.asyncio
async def test_issue_otp_stores_hashed_code_and_expiry():
    user = User(id=1, email="test@example.com", hashed_password="x")
    db = AsyncMock()

    code = await issue_otp(db, user)

    assert len(code) == 6
    assert code.isdigit()
    assert user.otp_code is not None
    assert verify_otp(code, user.otp_code)
    assert user.otp_expires_at is not None
    assert user.otp_expires_at > datetime.now(timezone.utc)
    assert user.otp_expires_at <= datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES + 1)
    db.commit.assert_awaited_once()


def test_send_otp_email_prints(capsys):
    send_otp_email("user@example.com", "123456")
    out = capsys.readouterr().out
    assert "user@example.com" in out
    assert "123456" in out


def test_forgot_password_endpoint_always_200_for_unknown_email():
    from fastapi.testclient import TestClient

    from app.main import app

    with patch("app.routers.auth.get_user_by_email", new_callable=AsyncMock, return_value=None):
        with patch("app.routers.auth.get_db"):
            client = TestClient(app)
            response = client.post("/api/v1/auth/forgot-password", json={"email": "ghost@example.com"})

    assert response.status_code == 200
    assert "message" in response.json()


def test_forgot_password_endpoint_issues_otp_for_known_email():
    from fastapi.testclient import TestClient

    from app.main import app

    mock_user = User(id=1, email="real@example.com", hashed_password="x")

    with (
        patch("app.routers.auth.get_user_by_email", new_callable=AsyncMock, return_value=mock_user),
        patch("app.routers.auth.issue_otp", new_callable=AsyncMock, return_value="654321") as mock_issue,
        patch("app.routers.auth.send_otp_email") as mock_send,
        patch("app.routers.auth.get_db"),
    ):
        client = TestClient(app)
        response = client.post("/api/v1/auth/forgot-password", json={"email": "real@example.com"})

    assert response.status_code == 200
    mock_issue.assert_awaited_once_with(ANY, mock_user)
    mock_send.assert_called_once_with("real@example.com", "654321")
