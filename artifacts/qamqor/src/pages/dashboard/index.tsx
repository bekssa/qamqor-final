import { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  BarChart2,
  Headphones,
  ChevronRight,
  Eye,
  Globe,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@features/auth/model/context";
import { useLanguage } from "@features/language/model/context";
import { useAccessibility } from "@features/accessibility/model/context";
import AuthGuard from "@app/guards/auth-guard";

import imgHousehold from "@/assets/services/household.png";
import imgMedical from "@/assets/services/medical.png";
import imgEscort from "@/assets/services/escort.png";
import imgHomeWork from "@/assets/services/homework.png";
import imgShopping from "@/assets/services/shopping.png";

const GREEN = "#2C9C42";
const BLUE = "#3B82F6";

type NavKey = "dashboard" | "messages" | "requests" | "statistics" | "support";
type TabKey = "create" | "search" | "notifications" | "settings";

interface ServiceRequest {
  id: number;
  serviceKey: string;
  serviceLabel: string;
  description: string;
  price: string;
  dateCreated: string;
  dateExecution: string;
  address: string;
  helper: string;
}

const STORAGE_KEY = (userId: number) => `qamqor-requests-${userId}`;

const SEED_REQUESTS: ServiceRequest[] = [
  {
    id: 1,
    serviceKey: "escort",
    serviceLabel: "Сопровождение",
    description: "Сходить в аптеку за лекарствами",
    price: "4000",
    dateCreated: "18.06.2026",
    dateExecution: "20.06.2026",
    address: "ул. Абая 50",
    helper: "Умбеталиев Али",
  },
  {
    id: 2,
    serviceKey: "escort",
    serviceLabel: "Сопровождение",
    description: "Сходить в аптеку за лекарствами",
    price: "4000",
    dateCreated: "18.06.2026",
    dateExecution: "20.06.2026",
    address: "ул. Абая 50",
    helper: "",
  },
  {
    id: 3,
    serviceKey: "homework",
    serviceLabel: "Домашние работы",
    description: "Починить стул",
    price: "5000",
    dateCreated: "18.06.2026",
    dateExecution: "20.06.2026",
    address: "ул. Абая 50",
    helper: "Умбеталиев Али",
  },
];

function getTodayStr() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function loadRequests(userId: number): ServiceRequest[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY(userId));
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(SEED_REQUESTS));
  return SEED_REQUESTS;
}

function saveRequests(userId: number, reqs: ServiceRequest[]) {
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(reqs));
}

function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
}

function isValidDate(value: string): boolean {
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(value)) return false;
  const [dd, mm] = value.split(".").map(Number);
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  return true;
}

const SERVICE_IMG: Record<string, string> = {
  household: imgHousehold,
  medical: imgMedical,
  escort: imgEscort,
  homework: imgHomeWork,
  shopping: imgShopping,
};

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const locales = ["RU", "KZ", "EN"] as const;
  const localeMap: Record<string, "ru" | "kz" | "en"> = { RU: "ru", KZ: "kz", EN: "en" };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-3.5 h-3.5 text-gray-400" />
        {locale.toUpperCase()}
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[72px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(localeMap[l]); setOpen(false); }}
              className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
              style={locale === localeMap[l] ? { color: BLUE, fontWeight: 600 } : { color: "#374151" }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AccessibilityToggle() {
  const { isHighContrast, toggleHighContrast } = useAccessibility();
  const { t } = useLanguage();
  return (
    <button
      onClick={toggleHighContrast}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors"
      style={isHighContrast
        ? { borderColor: GREEN, background: "#f0faf2", color: GREEN }
        : { borderColor: "#e5e7eb", background: "white", color: "#374151" }}
    >
      <Eye className="w-3.5 h-3.5" />
      {isHighContrast ? t("dashboard.accessibilityOff") : t("dashboard.accessibilityOn")}
    </button>
  );
}

function UserCard({ user }: {
  user: { firstName: string; lastName: string; email: string; phone: string; role: string };
}) {
  const { t } = useLanguage();
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  const roleLabel = user.role === "seek-help" ? t("dashboard.roleSeekHelp") : t("dashboard.roleOfferHelp");

  return (
    <div className="px-3 pt-4 pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ background: "linear-gradient(135deg, #5bb8f5 0%, #3b82f6 100%)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">
              {user.lastName} {user.firstName}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 mx-3" />

        <div className="px-3 py-2.5 space-y-1.5">
          {[
            { label: t("dashboard.userRole"), value: roleLabel },
            { label: t("dashboard.userEmail"), value: user.email },
            { label: t("dashboard.userPhone"), value: user.phone },
            { label: t("dashboard.userDob"), value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-2">
              <span className="text-[10px] text-gray-400 shrink-0 leading-tight">{label}</span>
              <span className="text-[10px] text-gray-800 font-medium text-right break-all leading-tight">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  activeNav,
  setActiveNav,
  user,
}: {
  activeNav: NavKey;
  setActiveNav: (k: NavKey) => void;
  user: { firstName: string; lastName: string; email: string; phone: string; role: string };
}) {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const navItems: { key: NavKey; Icon: React.ElementType; label: string }[] = [
    { key: "dashboard", Icon: LayoutDashboard, label: t("dashboard.navDashboard") },
    { key: "messages",  Icon: MessageSquare,  label: t("dashboard.navMessages") },
    { key: "requests",  Icon: ClipboardList,  label: t("dashboard.navMyRequests") },
    { key: "statistics",Icon: BarChart2,      label: t("dashboard.navStatistics") },
    { key: "support",   Icon: Headphones,     label: t("dashboard.navSupport") },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <aside className="w-56 min-h-screen bg-gray-50 flex flex-col shrink-0 border-r border-gray-100">
      <UserCard user={user} />

      <nav className="flex-1 px-3 py-1 flex flex-col gap-1">
        {navItems.map(({ key, Icon, label }) => {
          const isActive = activeNav === key;
          return (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border"
              style={isActive
                ? { background: BLUE, color: "white", borderColor: BLUE }
                : { background: "white", color: "#374151", borderColor: "#e5e7eb" }}
            >
              <Icon
                className="w-3.5 h-3.5 shrink-0"
                style={isActive ? { color: "white" } : { color: "#9ca3af" }}
              />
              <span className="flex-1 leading-tight">{label}</span>
              <ChevronRight
                className="w-3 h-3 shrink-0"
                style={isActive ? { color: "rgba(255,255,255,0.65)" } : { color: "#d1d5db" }}
              />
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border border-transparent hover:bg-red-50"
          style={{ color: "#EF4444" }}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" style={{ color: "#EF4444" }} />
          <span className="flex-1 leading-tight">{t("dashboard.navLogout")}</span>
        </button>
      </nav>
    </aside>
  );
}

function ServiceCard({
  img,
  title,
  desc,
  selected,
  onSelect,
  selectLabel,
}: {
  serviceKey: string;
  img: string;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
  selectLabel: string;
}) {
  return (
    <div
      className="flex flex-col items-center p-4 bg-white rounded-2xl cursor-pointer transition-all flex-1 min-w-[160px]"
      style={selected
        ? { outline: "2.5px solid #2563EB", boxShadow: "0 0 0 4px rgba(37,99,235,0.12)" }
        : { border: "1.5px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
      onClick={onSelect}
    >
      <div className="w-full h-28 flex items-center justify-center mb-3">
        <img src={img} alt={title} className="max-h-full max-w-full object-contain" />
      </div>
      <p className="text-xs font-bold text-gray-800 text-center leading-tight mb-1">{title}</p>
      <p className="text-[10px] text-gray-400 text-center leading-tight flex-1 mb-3">{desc}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        className="px-5 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 mt-auto"
        style={{ background: GREEN }}
      >
        {selectLabel}
      </button>
    </div>
  );
}

function CreateRequestTab({ userId }: { userId: number }) {
  const { t } = useLanguage();

  const [selectedService, setSelectedService] = useState<string>("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requests, setRequests] = useState<ServiceRequest[]>(() => loadRequests(userId));

  const services = [
    { key: "household", img: imgHousehold, title: t("dashboard.serviceHousehold"), desc: t("dashboard.serviceHouseholdDesc") },
    { key: "medical",   img: imgMedical,   title: t("dashboard.serviceMedical"),   desc: t("dashboard.serviceMedicalDesc") },
    { key: "escort",    img: imgEscort,    title: t("dashboard.serviceEscort"),     desc: t("dashboard.serviceEscortDesc") },
    { key: "homework",  img: imgHomeWork,  title: t("dashboard.serviceHomeWork"),   desc: t("dashboard.serviceHomeWorkDesc") },
    { key: "shopping",  img: imgShopping,  title: t("dashboard.serviceShopping"),   desc: t("dashboard.serviceShoppingDesc") },
  ];

  const selectedServiceObj = services.find((s) => s.key === selectedService);

  const handlePriceChange = (val: string) => {
    setPrice(val.replace(/\D/g, ""));
    if (errors.price) setErrors((e) => ({ ...e, price: "" }));
  };

  const handleDateChange = (val: string) => {
    setDate(formatDate(val));
    if (errors.date) setErrors((e) => ({ ...e, date: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedService) errs.service = t("dashboard.selectService");
    if (!description.trim()) errs.description = t("dashboard.required");
    if (!price) errs.price = t("dashboard.required");
    if (!date) errs.date = t("dashboard.required");
    else if (!isValidDate(date)) errs.date = t("dashboard.dateInvalid");
    if (!address.trim()) errs.address = t("dashboard.required");
    return errs;
  };

  const handleCreate = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newReq: ServiceRequest = {
      id: Date.now(),
      serviceKey: selectedService,
      serviceLabel: selectedServiceObj?.title ?? selectedService,
      description,
      price,
      dateCreated: getTodayStr(),
      dateExecution: date,
      address,
      helper: "",
    };

    const updated = [newReq, ...requests];
    setRequests(updated);
    saveRequests(userId, updated);
    setSelectedService(""); setDescription(""); setPrice(""); setDate(""); setAddress(""); setErrors({});
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-800">{t("dashboard.createTitle")}</h2>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-3">
          {services.map((s) => (
            <ServiceCard
              key={s.key}
              serviceKey={s.key}
              img={s.img}
              title={s.title}
              desc={s.desc}
              selected={selectedService === s.key}
              onSelect={() => setSelectedService(s.key)}
              selectLabel={t("dashboard.selectBtn")}
            />
          ))}
        </div>
        {errors.service && <p className="text-[10px] text-red-500 mt-2">{errors.service}</p>}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">{t("dashboard.descLabel")}</label>
          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((er) => ({ ...er, description: "" })); }}
            placeholder={t("dashboard.descPlaceholder")}
            rows={3}
            className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none resize-none transition-all ${
              errors.description ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"
            }`}
          />
          {errors.description && <p className="text-[10px] text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">{t("dashboard.priceLabel")}</label>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder={t("dashboard.pricePlaceholder")}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                errors.price ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.price && <p className="text-[10px] text-red-500">{errors.price}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">{t("dashboard.dateLabel")}</label>
            <input
              type="text"
              inputMode="numeric"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder={t("dashboard.datePlaceholder")}
              maxLength={10}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                errors.date ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.date && <p className="text-[10px] text-red-500">{errors.date}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">{t("dashboard.addressLabel")}</label>
          <input
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors((er) => ({ ...er, address: "" })); }}
            placeholder={t("dashboard.addressPlaceholder")}
            className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${
              errors.address ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"
            }`}
          />
          {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2 text-white text-xs font-semibold rounded-xl transition-opacity hover:opacity-90 shadow-sm flex items-center gap-1.5"
          style={{ background: GREEN }}
        >
          + {t("dashboard.createBtn")}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">{t("dashboard.activeRequests")}</h3>
          <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: BLUE }}>
            {t("dashboard.showAll")} <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 font-semibold" style={{ background: "#EFF6FF" }}>
                <th className="px-3 py-2.5 text-left">{t("dashboard.colName")}</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">{t("dashboard.colDateReg")}</th>
                <th className="px-3 py-2.5 text-left whitespace-nowrap">{t("dashboard.colDateExec")}</th>
                <th className="px-3 py-2.5 text-left">{t("dashboard.colPrice")}</th>
                <th className="px-3 py-2.5 text-left">{t("dashboard.colHelper")}</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <img
                          src={SERVICE_IMG[req.serviceKey] ?? imgHousehold}
                          alt={req.serviceLabel}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 leading-tight">{req.serviceLabel}</p>
                        <p className="text-gray-400 leading-tight truncate max-w-[120px]">{req.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{req.dateCreated}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{req.dateExecution}</td>
                  <td className="px-3 py-2.5 text-gray-700 font-semibold">{req.price}</td>
                  <td className="px-3 py-2.5">
                    {req.helper
                      ? <span className="text-gray-700">{req.helper}</span>
                      : <span className="text-gray-400 italic">{t("dashboard.helperSearching")}</span>
                    }
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      className="px-3 py-1.5 text-white font-semibold rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                      style={{ background: BLUE }}
                    >
                      {t("dashboard.editBtn")}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComingSoon() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">{t("dashboard.comingSoon")}</p>
    </div>
  );
}

function DashboardContent({ activeNav, userId }: { activeNav: NavKey; userId: number }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "create",        label: t("dashboard.tabCreate") },
    { key: "search",        label: t("dashboard.tabSearch") },
    { key: "notifications", label: t("dashboard.tabNotifications") },
    { key: "settings",      label: t("dashboard.tabSettings") },
  ];

  if (activeNav !== "dashboard") return <ComingSoon />;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-3 text-xs font-semibold transition-colors whitespace-nowrap border-b-2"
              style={activeTab === tab.key
                ? { color: BLUE, borderColor: BLUE, background: "white" }
                : { color: "#6b7280", borderColor: "transparent" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "create" ? <CreateRequestTab userId={userId} /> : <ComingSoon />}
    </div>
  );
}

function DashboardPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} user={currentUser} />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0 rounded-tl-2xl shadow-sm">
          <p className="text-sm font-bold" style={{ color: BLUE }}>{t("dashboard.title")}</p>
          <div className="flex items-center gap-2">
            <AccessibilityToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 p-5 overflow-y-auto">
          <DashboardContent activeNav={activeNav} userId={currentUser.id} />
        </main>
      </div>
    </div>
  );
}

export default function DashboardPageWithGuard() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
