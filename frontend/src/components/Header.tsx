import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-2xl font-bold">
          {t("app_title")}
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/events" className="hover:text-indigo-200">
            {t("events")}
          </Link>
          <Link to="/chat" className="hover:text-indigo-200">
            {t("chat")}
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/bookings" className="hover:text-indigo-200">
                {t("bookings")}
              </Link>
              {user?.roles.includes("admin") && (
                <Link to="/admin" className="hover:text-indigo-200">
                  {t("dashboard")}
                </Link>
              )}
            </>
          )}

          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-3 py-1 rounded bg-indigo-500 text-white border-0"
          >
            <option value="en">{t("english")}</option>
            <option value="hi">{t("hindi")}</option>
            <option value="fr">{t("french")}</option>
          </select>

          {isLoggedIn ? (
            <>
              <span className="text-sm">{user?.name}</span>
              <button onClick={handleLogout} className="btn-secondary px-3 py-1 text-sm">
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-3 py-1 text-sm">
                {t("login")}
              </Link>
              <Link to="/register" className="btn-primary px-3 py-1 text-sm">
                {t("register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
