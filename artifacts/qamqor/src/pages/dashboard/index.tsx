import { useState, useRef, useEffect } from "react";
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
  ArrowLeft,
  Send,
  CheckCheck,
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

import imgUserPhoto from "@assets/Ellipse_374_1776245458894.png";
import imgQamqor from "@assets/Rectangle_240662641_1776245382727.png";
import imgHelperAvatar from "@assets/image_1776248251802.png";

const GREEN = "#2C9C42";
const BLUE = "#3B82F6";

type NavKey = "dashboard" | "messages" | "requests" | "statistics" | "support";
type TabKey = "create" | "search" | "notifications" | "settings";

/* ─────────────── requests types ─────────────── */
type RequestStatus = "active" | "completed" | "cancelled";

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
  status?: RequestStatus;
}

const STORAGE_KEY = (userId: number) => `qamqor-requests-v2-${userId}`;

const SEED_REQUESTS: ServiceRequest[] = [
  { id: 1,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Сходить в аптеку за лекарствами", price: "4000", dateCreated: "18.06.2026", dateExecution: "20.06.2026", address: "ул. Абая 50", helper: "Умбеталиев Али", status: "active" },
  { id: 2,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Сходить в аптеку за лекарствами", price: "4000", dateCreated: "18.06.2026", dateExecution: "20.06.2026", address: "ул. Абая 50", helper: "",               status: "active" },
  { id: 3,  serviceKey: "household", serviceLabel: "Бытовые услуги",  description: "Уборка, приготовление еды",       price: "3500", dateCreated: "18.06.2026", dateExecution: "20.06.2026", address: "ул. Абая 50", helper: "Умбеталиев Али", status: "active" },
  { id: 4,  serviceKey: "homework",  serviceLabel: "Домашние работы", description: "Починить стул",                  price: "5000", dateCreated: "18.06.2026", dateExecution: "20.06.2026", address: "ул. Абая 50", helper: "Умбеталиев Али", status: "active" },
  { id: 5,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Сходить в аптеку за лекарствами", price: "4000", dateCreated: "10.05.2026", dateExecution: "12.05.2026", address: "ул. Ленина 10", helper: "Умбеталиев Али", status: "completed" },
  { id: 6,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Поход в больницу",               price: "4000", dateCreated: "10.05.2026", dateExecution: "12.05.2026", address: "ул. Ленина 10", helper: "",               status: "completed" },
  { id: 7,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Прогулка в парке",               price: "4000", dateCreated: "01.04.2026", dateExecution: "03.04.2026", address: "пр. Республики 5", helper: "Умбеталиев Али", status: "completed" },
  { id: 8,  serviceKey: "homework",  serviceLabel: "Домашние работы", description: "Починить стул",                  price: "5000", dateCreated: "01.04.2026", dateExecution: "03.04.2026", address: "пр. Республики 5", helper: "Умбеталиев Али", status: "completed" },
  { id: 9,  serviceKey: "escort",    serviceLabel: "Сопровождение",   description: "Сходить в аптеку за лекарствами", price: "4000", dateCreated: "15.03.2026", dateExecution: "16.03.2026", address: "ул. Абая 50", helper: "Умбеталиев Али", status: "cancelled" },
  { id: 10, serviceKey: "homework",  serviceLabel: "Домашние работы", description: "Починить стул",                  price: "5000", dateCreated: "15.03.2026", dateExecution: "16.03.2026", address: "ул. Абая 50", helper: "Умбеталиев Али", status: "cancelled" },
];

const SERVICE_IMG: Record<string, string> = {
  household: imgHousehold, medical: imgMedical, escort: imgEscort, homework: imgHomeWork, shopping: imgShopping,
};

function loadRequests(userId: number): ServiceRequest[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY(userId));
    if (s) {
      const parsed: ServiceRequest[] = JSON.parse(s);
      return parsed.map(r => ({ ...r, status: r.status ?? "active" }));
    }
  } catch { /**/ }
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(SEED_REQUESTS));
  return SEED_REQUESTS;
}
function saveRequests(userId: number, reqs: ServiceRequest[]) {
  localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(reqs));
}

function getTodayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}.${String(d.getMonth()+1).padStart(2,"0")}.${d.getFullYear()}`;
}
function formatDate(raw: string): string {
  const d = raw.replace(/\D/g,"").slice(0,8);
  if (d.length<=2) return d;
  if (d.length<=4) return `${d.slice(0,2)}.${d.slice(2)}`;
  return `${d.slice(0,2)}.${d.slice(2,4)}.${d.slice(4)}`;
}
function isValidDate(v: string) {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(v)) return false;
  const [dd,mm] = v.split(".").map(Number);
  return mm>=1 && mm<=12 && dd>=1 && dd<=31;
}

/* ─────────────── messages / chat types ─────────────── */
type AvatarType = "photo" | "qamqor" | string; // string = initials key

interface Conversation {
  id: number;
  name: string;
  avatar: AvatarType;
  avatarColor?: string;
  preview: string;
  time: string;
  unread?: boolean;
  read?: boolean;
  isSystem?: boolean;
}

interface ChatMessage {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, name: "Куаныш Дастан",         avatar: "photo",   preview: "Принимаю вашу заявку о покупке лекарств. Вскоре уточню детали и приступлю к выполнению", time: "12:45", unread: true },
  { id: 2, name: "Айбергенова Асылай",     avatar: "АА",      avatarColor: "#a78bfa", preview: "Отклонился на вашу заявку о помощи по дому.\nЗдравствуйте! Работаю в сфере бытовой помощи уже несколько лет, хорошо знаю все основные задачи по дому. Выполню всё аккуратно, быстро и с уважением к вашему пространству...", time: "11:05", unread: true },
  { id: 3, name: "Платеж успешно выполнен",avatar: "qamqor",  preview: "Заявка №1024", time: "11:05", isSystem: true },
  { id: 4, name: "Аймердинов Амир",        avatar: "photo",   preview: "Отклонил вашу заявку.\nЗдравствуйте! Извините за неудобства, по личным причинам не могу принять вашу заявку :(", time: "11:05" },
  { id: 5, name: "Платеж успешно выполнен",avatar: "qamqor",  preview: "Заявка №1023", time: "11:05", isSystem: true },
  { id: 6, name: "Бакыт Диас",             avatar: "photo",   preview: "Я уже купил всё необходимое.", time: "вс" },
  { id: 7, name: "Абдешев Сансызбай",      avatar: "АС",      avatarColor: "#f97316", preview: "Ваш родственник активировал SOS кнопку", time: "сб" },
  { id: 8, name: "Алимова Асем",           avatar: "АА",      avatarColor: "#ec4899", preview: "Дома очень чисто, спасибо вам огромное.\nЖелаю всего наилучшего!", time: "пт", read: true },
  { id: 9, name: "Ахмет Адиль",            avatar: "АА",      avatarColor: "#6366f1", preview: "Отклонил вашу заявку.\nЗдравствуйте! Извините за неудобства, по личным причинам не могу принять вашу заявку :(", time: "чт" },
  { id: 10,name: "Куаныш Дастан",          avatar: "КД",      avatarColor: "#14b8a6", preview: "Хорошо, спасибо вам большое!", time: "чт", read: true },
];

const CHAT_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, from: "me",    text: "Добрый день!\nМне нужна помощь по покупке лекарств, можете ли вы помочь?", time: "12:15" },
    { id: 2, from: "other", text: "Добрый день!", time: "12:14" },
    { id: 3, from: "other", text: "Принимаю вашу заявку о покупке лекарств. Вскоре уточню детали и приступлю к выполнению", time: "12:15" },
  ],
  2: [
    { id: 1, from: "me",    text: "Здравствуйте! Мне нужна помощь по дому.", time: "11:00" },
    { id: 2, from: "other", text: "Здравствуйте! Рада помочь! Работаю в сфере бытовой помощи уже несколько лет.", time: "11:05" },
  ],
  4: [
    { id: 1, from: "me",    text: "Здравствуйте! Могли бы вы помочь с моей заявкой?", time: "10:50" },
    { id: 2, from: "other", text: "Здравствуйте! Извините за неудобства, по личным причинам не могу принять вашу заявку :(", time: "11:05" },
  ],
  6: [
    { id: 1, from: "me",    text: "Добрый день! Вы купили всё из списка?", time: "вс" },
    { id: 2, from: "other", text: "Я уже купил всё необходимое.", time: "вс" },
  ],
  7: [
    { id: 1, from: "other", text: "Ваш родственник активировал SOS кнопку", time: "сб" },
  ],
  8: [
    { id: 1, from: "other", text: "Дома очень чисто, спасибо вам огромное.\nЖелаю всего наилучшего!", time: "пт" },
  ],
};

/* ─────────────── avatar helper ─────────────── */
function Avatar({ conv, size = 44 }: { conv: Conversation; size?: number }) {
  if (conv.avatar === "photo") {
    return (
      <img src={imgUserPhoto} alt={conv.name} className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }} />
    );
  }
  if (conv.avatar === "qamqor") {
    return (
      <img src={imgQamqor} alt="Qamqor" className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }} />
    );
  }
  return (
    <div className="rounded-full flex items-center justify-center shrink-0 font-bold text-white"
      style={{ width: size, height: size, background: conv.avatarColor ?? "#9ca3af", fontSize: size * 0.36 }}>
      {conv.avatar}
    </div>
  );
}

/* ─────────────── small ui bits ─────────────── */
function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const locales = ["RU","KZ","EN"] as const;
  const map: Record<string,"ru"|"kz"|"en"> = {RU:"ru",KZ:"kz",EN:"en"};
  return (
    <div className="relative">
      <button onClick={() => setOpen(v=>!v)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        <Globe className="w-3.5 h-3.5 text-gray-400"/>
        {locale.toUpperCase()}
        <ChevronDown className="w-3 h-3 text-gray-400"/>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[72px]">
          {locales.map(l=>(
            <button key={l} onClick={()=>{setLocale(map[l]);setOpen(false);}}
              className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
              style={locale===map[l]?{color:BLUE,fontWeight:600}:{color:"#374151"}}>{l}</button>
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
    <button onClick={toggleHighContrast}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors"
      style={isHighContrast?{borderColor:GREEN,background:"#f0faf2",color:GREEN}:{borderColor:"#e5e7eb",background:"white",color:"#374151"}}>
      <Eye className="w-3.5 h-3.5"/>
      {isHighContrast ? t("dashboard.accessibilityOff") : t("dashboard.accessibilityOn")}
    </button>
  );
}

/* ─────────────── user card ─────────────── */
function UserCard({ user }: { user: { firstName:string;lastName:string;email:string;phone:string;role:string;birthDate?:string;city?:string } }) {
  const { t } = useLanguage();
  const initials = `${user.firstName[0]??""}${user.lastName[0]??""}`.toUpperCase();
  const roleLabel = user.role==="seek-help" ? t("dashboard.roleSeekHelp") : t("dashboard.roleOfferHelp");
  const rows = [
    {label:t("dashboard.userRole"),  value:roleLabel},
    {label:t("dashboard.userEmail"), value:user.email},
    {label:t("dashboard.userPhone"), value:user.phone},
    {label:t("dashboard.userDob"),   value:user.birthDate ?? "—"},
    {label:t("dashboard.userCity"),  value:user.city ?? "—"},
  ];
  return (
    <div className="px-3 pt-4 pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{background:"linear-gradient(135deg,#5bb8f5 0%,#3b82f6 100%)"}}>
            {initials}
          </div>
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">{user.lastName} {user.firstName}</p>
        </div>
        <div className="border-t border-gray-100 mx-3"/>
        <div className="px-3 py-2.5 space-y-1.5">
          {rows.map(({label,value})=>(
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

/* ─────────────── sidebar ─────────────── */
function Sidebar({ activeNav, setActiveNav, user }: {
  activeNav: NavKey;
  setActiveNav: (k:NavKey) => void;
  user: { firstName:string;lastName:string;email:string;phone:string;role:string;birthDate?:string;city?:string };
}) {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const navItems: {key:NavKey;Icon:React.ElementType;label:string}[] = [
    {key:"dashboard", Icon:LayoutDashboard, label:t("dashboard.navDashboard")},
    {key:"messages",  Icon:MessageSquare,   label:t("dashboard.navMessages")},
    {key:"requests",  Icon:ClipboardList,   label:t("dashboard.navMyRequests")},
    {key:"statistics",Icon:BarChart2,       label:t("dashboard.navStatistics")},
    {key:"support",   Icon:Headphones,      label:t("dashboard.navSupport")},
  ];

  return (
    <aside className="w-56 min-h-screen bg-gray-50 flex flex-col shrink-0 border-r border-gray-100">
      <UserCard user={user}/>
      <nav className="flex-1 px-3 py-1 flex flex-col gap-1">
        {navItems.map(({key,Icon,label})=>{
          const isActive = activeNav===key;
          return (
            <button key={key} onClick={()=>setActiveNav(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border"
              style={isActive?{background:BLUE,color:"white",borderColor:BLUE}:{background:"white",color:"#374151",borderColor:"#e5e7eb"}}>
              <Icon className="w-3.5 h-3.5 shrink-0" style={isActive?{color:"white"}:{color:"#9ca3af"}}/>
              <span className="flex-1 leading-tight">{label}</span>
              <ChevronRight className="w-3 h-3 shrink-0" style={isActive?{color:"rgba(255,255,255,0.65)"}:{color:"#d1d5db"}}/>
            </button>
          );
        })}
        <button onClick={()=>{logout();navigate("/");}}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border border-transparent hover:bg-red-50"
          style={{color:"#EF4444"}}>
          <LogOut className="w-3.5 h-3.5 shrink-0" style={{color:"#EF4444"}}/>
          <span className="flex-1 leading-tight">{t("dashboard.navLogout")}</span>
        </button>
      </nav>
    </aside>
  );
}

/* ─────────────── service card ─────────────── */
function ServiceCard({ img,title,desc,selected,onSelect,selectLabel,serviceKey: _ }:{
  serviceKey:string;img:string;title:string;desc:string;selected:boolean;onSelect:()=>void;selectLabel:string;
}) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl cursor-pointer transition-all flex-1 min-w-[160px]"
      style={selected?{outline:"2.5px solid #2563EB",boxShadow:"0 0 0 4px rgba(37,99,235,0.12)"}:{border:"1.5px solid #f0f0f0",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}
      onClick={onSelect}>
      <div className="w-full h-28 flex items-center justify-center mb-3">
        <img src={img} alt={title} className="max-h-full max-w-full object-contain"/>
      </div>
      <p className="text-xs font-bold text-gray-800 text-center leading-tight mb-1">{title}</p>
      <p className="text-[10px] text-gray-400 text-center leading-tight flex-1 mb-3">{desc}</p>
      <button onClick={e=>{e.stopPropagation();onSelect();}}
        className="px-5 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 mt-auto"
        style={{background:GREEN}}>
        {selectLabel}
      </button>
    </div>
  );
}

/* ─────────────── create-request tab ─────────────── */
function CreateRequestTab({ userId }: { userId:number }) {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [requests, setRequests] = useState<ServiceRequest[]>(()=>loadRequests(userId));
  const [editingReq, setEditingReq] = useState<ServiceRequest | null>(null);

  const services = [
    {key:"household",img:imgHousehold,title:t("dashboard.serviceHousehold"),desc:t("dashboard.serviceHouseholdDesc")},
    {key:"medical",  img:imgMedical,  title:t("dashboard.serviceMedical"),  desc:t("dashboard.serviceMedicalDesc")},
    {key:"escort",   img:imgEscort,   title:t("dashboard.serviceEscort"),   desc:t("dashboard.serviceEscortDesc")},
    {key:"homework", img:imgHomeWork, title:t("dashboard.serviceHomeWork"), desc:t("dashboard.serviceHomeWorkDesc")},
    {key:"shopping", img:imgShopping, title:t("dashboard.serviceShopping"), desc:t("dashboard.serviceShoppingDesc")},
  ];

  const sel = services.find(s=>s.key===selectedService);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!selectedService) e.service=t("dashboard.selectService");
    if (!description.trim()) e.description=t("dashboard.required");
    if (!price) e.price=t("dashboard.required");
    if (!date) e.date=t("dashboard.required");
    else if (!isValidDate(date)) e.date=t("dashboard.dateInvalid");
    if (!address.trim()) e.address=t("dashboard.required");
    return e;
  };

  const handleCreate = () => {
    const errs = validate(); setErrors(errs);
    if (Object.keys(errs).length) return;
    const newReq: ServiceRequest = {id:Date.now(),serviceKey:selectedService,serviceLabel:sel?.title??selectedService,description,price,dateCreated:getTodayStr(),dateExecution:date,address,helper:"",status:"active"};
    const updated=[newReq,...requests]; setRequests(updated); saveRequests(userId,updated);
    setSelectedService(""); setDescription(""); setPrice(""); setDate(""); setAddress(""); setErrors({});
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold text-gray-800">{t("dashboard.createTitle")}</h2>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-3">
          {services.map(s=>(
            <ServiceCard key={s.key} serviceKey={s.key} img={s.img} title={s.title} desc={s.desc}
              selected={selectedService===s.key} onSelect={()=>setSelectedService(s.key)} selectLabel={t("dashboard.selectBtn")}/>
          ))}
        </div>
        {errors.service && <p className="text-[10px] text-red-500 mt-2">{errors.service}</p>}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">{t("dashboard.descLabel")}</label>
          <textarea value={description} onChange={e=>{setDescription(e.target.value);if(errors.description)setErrors(er=>({...er,description:""}));}}
            placeholder={t("dashboard.descPlaceholder")} rows={3}
            className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none resize-none transition-all ${errors.description?"border-red-400 bg-red-50":"border-gray-200 focus:border-blue-400"}`}/>
          {errors.description && <p className="text-[10px] text-red-500">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">{t("dashboard.priceLabel")}</label>
            <input type="text" inputMode="numeric" value={price}
              onChange={e=>{setPrice(e.target.value.replace(/\D/g,""));if(errors.price)setErrors(er=>({...er,price:""}));}}
              placeholder={t("dashboard.pricePlaceholder")}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${errors.price?"border-red-400 bg-red-50":"border-gray-200 focus:border-blue-400"}`}/>
            {errors.price && <p className="text-[10px] text-red-500">{errors.price}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">{t("dashboard.dateLabel")}</label>
            <input type="text" inputMode="numeric" value={date}
              onChange={e=>{setDate(formatDate(e.target.value));if(errors.date)setErrors(er=>({...er,date:""}));}}
              placeholder={t("dashboard.datePlaceholder")} maxLength={10}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${errors.date?"border-red-400 bg-red-50":"border-gray-200 focus:border-blue-400"}`}/>
            {errors.date && <p className="text-[10px] text-red-500">{errors.date}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">{t("dashboard.addressLabel")}</label>
          <input type="text" value={address}
            onChange={e=>{setAddress(e.target.value);if(errors.address)setErrors(er=>({...er,address:""}));}}
            placeholder={t("dashboard.addressPlaceholder")}
            className={`w-full px-3 py-2.5 rounded-xl border text-xs outline-none transition-all ${errors.address?"border-red-400 bg-red-50":"border-gray-200 focus:border-blue-400"}`}/>
          {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
        </div>
        <button onClick={handleCreate}
          className="w-9 h-9 text-white text-lg font-bold rounded-xl transition-opacity hover:opacity-90 shadow-sm flex items-center justify-center"
          style={{background:GREEN}}>
          +
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm">{t("dashboard.activeRequests")}</h3>
          <button className="text-xs font-medium flex items-center gap-0.5" style={{color:BLUE}}>
            {t("dashboard.showAll")} <ChevronRight className="w-3 h-3"/>
          </button>
        </div>
        <div className="overflow-x-auto px-4 pt-3 pb-1">
          <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
            <thead>
              <tr>
                {[t("dashboard.colName"), t("dashboard.colDateReg"), t("dashboard.colDateExec"), t("dashboard.colPrice"), t("dashboard.colHelper")].map((h, i) => {
                  const isFirst = i === 0;
                  return (
                    <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap text-left"
                      style={{
                        color: BLUE,
                        background: "white",
                        borderTop: "1px solid #BFDBFE",
                        borderBottom: "1px solid #BFDBFE",
                        borderLeft: isFirst ? "1px solid #BFDBFE" : "none",
                        borderRight: "none",
                        borderRadius: isFirst ? "10px 0 0 10px" : "0",
                      }}
                    >{h}</th>
                  );
                })}
                <th style={{ background:"white", borderTop:"1px solid #BFDBFE", borderBottom:"1px solid #BFDBFE", borderRight:"1px solid #BFDBFE", borderLeft:"none", borderRadius:"0 10px 10px 0", width:"100px" }}/>
              </tr>
            </thead>
            <tbody>
              {requests.filter(r=>(r.status??"active")==="active").map(req=>(
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <img src={SERVICE_IMG[req.serviceKey]??imgHousehold} alt={req.serviceLabel} className="w-full h-full object-contain p-1"/>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 leading-tight">{req.serviceLabel}</p>
                        <p className="text-gray-400 leading-tight truncate max-w-[120px]">{req.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateCreated}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateExecution}</td>
                  <td className="px-3 py-2.5 text-gray-700 font-semibold border-b border-gray-100">{req.price}</td>
                  <td className="px-3 py-2.5 border-b border-gray-100">
                    {req.helper ? <span className="text-gray-700">{req.helper}</span>
                      : <span className="text-gray-400 italic">{t("dashboard.helperSearching")}</span>}
                  </td>
                  <td className="px-3 py-2.5 border-b border-gray-100 text-right">
                    <button
                      onClick={() => setEditingReq(req)}
                      className="px-3 py-1.5 text-white text-xs font-semibold rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                      style={{background:BLUE}}>
                      {t("dashboard.editBtn")}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.filter(r=>(r.status??"active")==="active").length===0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">—</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingReq && (
        <EditRequestModal
          req={editingReq}
          services={services}
          onClose={() => setEditingReq(null)}
          onSave={(updated) => {
            const next = requests.map(r => r.id === updated.id ? updated : r);
            setRequests(next);
            saveRequests(userId, next);
            setEditingReq(null);
          }}
        />
      )}
    </div>
  );
}

/* ─────────────── edit request modal ─────────────── */
function EditRequestModal({
  req, services, onClose, onSave,
}: {
  req: ServiceRequest;
  services: {key:string;img:string;title:string}[];
  onClose: () => void;
  onSave: (updated: ServiceRequest) => void;
}) {
  const { t } = useLanguage();
  const [serviceKey, setServiceKey] = useState(req.serviceKey);
  const [description, setDescription] = useState(req.description);
  const [price, setPrice] = useState(req.price);
  const [date, setDate] = useState(req.dateExecution);
  const [address, setAddress] = useState(req.address);
  const [open, setOpen] = useState(false);

  const selectedSvc = services.find(s=>s.key===serviceKey);

  const handleSave = () => {
    onSave({ ...req, serviceKey, serviceLabel: selectedSvc?.title ?? req.serviceLabel, description, price, dateExecution: date, address });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-lg font-light">✕</button>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{t("dashboard.serviceNameLabel")}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(v=>!v)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left flex items-center justify-between outline-none focus:border-blue-400"
              >
                <span className={selectedSvc ? "text-gray-800" : "text-gray-400"}>
                  {selectedSvc?.title ?? t("dashboard.selectService")}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400"/>
              </button>
              {open && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {services.map(s => (
                    <button key={s.key} type="button"
                      onClick={() => { setServiceKey(s.key); setOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                      style={serviceKey===s.key ? {color:BLUE,fontWeight:600} : {color:"#374151"}}>
                      {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{t("dashboard.descLabel")}</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none focus:border-blue-400"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">{t("dashboard.priceLabel")}</label>
              <div className="relative">
                <input type="text" inputMode="numeric" value={price}
                  onChange={e=>setPrice(e.target.value.replace(/\D/g,""))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 pr-8"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₸</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">{t("dashboard.dateLabel")}</label>
              <div className="relative">
                <input type="text" value={date} placeholder="дд.мм.гггг" maxLength={10}
                  onChange={e=>{ const d=e.target.value.replace(/\D/g,"").slice(0,8); let f=d; if(d.length>2)f=`${d.slice(0,2)}.${d.slice(2)}`; if(d.length>4)f=`${d.slice(0,2)}.${d.slice(2,4)}.${d.slice(4)}`; setDate(f); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 pr-8"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/><line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/><line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/></svg>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{t("dashboard.addressLabel")}</label>
            <input type="text" value={address} onChange={e=>setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"/>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave}
              className="px-8 py-3 text-white text-sm font-semibold rounded-xl transition-opacity hover:opacity-90"
              style={{background:GREEN}}>
              {t("dashboard.saveBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── completion modal ─────────────── */
function CompletionModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const { t } = useLanguage();
  const [agreedPrice, setAgreedPrice] = useState<"yes"|"no">("yes");
  const [finalPrice, setFinalPrice] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-lg font-light">✕</button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">{t("dashboard.completionTitle")}</h2>
        <p className="text-sm text-gray-600 mb-6">{t("dashboard.completionQuestion")}</p>

        <div className="flex flex-col items-start gap-3 mb-6 px-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="price-agreement" checked={agreedPrice==="yes"} onChange={()=>setAgreedPrice("yes")}
              className="w-4 h-4 accent-green-600"/>
            <span className="text-sm text-gray-700">{t("dashboard.completionYes")}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="price-agreement" checked={agreedPrice==="no"} onChange={()=>setAgreedPrice("no")}
              className="w-4 h-4 accent-green-600"/>
            <span className="text-sm text-gray-700">{t("dashboard.completionNo")}</span>
          </label>
        </div>

        {agreedPrice==="no" && (
          <div className="relative mb-6 mx-4">
            <input type="text" inputMode="numeric" value={finalPrice}
              onChange={e=>setFinalPrice(e.target.value.replace(/\D/g,""))}
              placeholder={t("dashboard.completionPricePlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400 text-center pr-8"/>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₸</span>
          </div>
        )}

        <button onClick={onSubmit}
          className="px-10 py-3 text-white text-sm font-bold rounded-xl uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{background:GREEN}}>
          {t("dashboard.completionSubmit")}
        </button>
      </div>
    </div>
  );
}

/* ─────────────── helper dashboard (offer-help role) ─────────────── */
interface HelperRequest {
  id: number;
  name: string;
  serviceLabel: string;
  description: string;
  price: string;
  dateCreated: string;
  dateExecution: string;
  address: string;
}

const HELPER_ACTIVE: HelperRequest[] = [
  { id: 1, name: "Лидия Абдешева", serviceLabel: "Сопровождение", description: "Необходимо съездить со мной в больницу к врачу, помочь с оформлением документов", price: "4000", dateCreated: "18 июня 2026 года", dateExecution: "20 июня 2026 года", address: "Сыганак 41" },
];

const AVAILABLE_REQS: HelperRequest[] = [
  { id: 11, name: "Лидия Абдешева", serviceLabel: "Сопровождение", description: "Необходимо съездить со мной в больницу к врачу, помочь с оформлением документов", price: "4000", dateCreated: "18 июня 2026 года", dateExecution: "20 июня 2026 года", address: "Сыганак 41" },
  { id: 12, name: "Лидия Абдешева", serviceLabel: "Сопровождение", description: "Необходимо съездить со мной в больницу к врачу, помочь с оформлением документов", price: "4000", dateCreated: "18 июня 2026 года", dateExecution: "20 июня 2026 года", address: "Сыганак 41" },
  { id: 13, name: "Лидия Абдешева", serviceLabel: "Сопровождение", description: "Необходимо съездить со мной в больницу к врачу, помочь с оформлением документов", price: "4000", dateCreated: "18 июня 2026 года", dateExecution: "20 июня 2026 года", address: "Сыганак 41" },
  { id: 14, name: "Лидия Абдешева", serviceLabel: "Сопровождение", description: "Необходимо съездить со мной в больницу к врачу, помочь с оформлением документов", price: "4000", dateCreated: "18 июня 2026 года", dateExecution: "20 июня 2026 года", address: "Сыганак 41" },
];

function HelperReqTable({ reqs, onComplete }: {
  reqs: HelperRequest[];
  onComplete?: (id: number) => void;
}) {
  const { t } = useLanguage();
  const COLS = [t("dashboard.colDescription"), t("dashboard.colDateReg"), t("dashboard.colDateExec"), t("dashboard.colPrice"), t("dashboard.colAddress")];
  const hasActions = !!onComplete;

  return (
    <div className="overflow-x-auto px-4 pt-3 pb-1">
      <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
        <thead>
          <tr>
            {COLS.map((h, i) => {
              const isFirst = i === 0;
              const isLast = !hasActions && i === COLS.length - 1;
              return (
                <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap text-left"
                  style={{
                    color: BLUE,
                    background: "white",
                    borderTop: "1px solid #BFDBFE",
                    borderBottom: "1px solid #BFDBFE",
                    borderLeft: isFirst ? "1px solid #BFDBFE" : "none",
                    borderRight: isLast ? "1px solid #BFDBFE" : "none",
                    borderRadius: isFirst ? "10px 0 0 10px" : isLast ? "0 10px 10px 0" : "0",
                  }}>
                  {h}
                </th>
              );
            })}
            {hasActions && (
              <th style={{ background:"white", borderTop:"1px solid #BFDBFE", borderBottom:"1px solid #BFDBFE", borderRight:"1px solid #BFDBFE", borderLeft:"none", borderRadius:"0 10px 10px 0", width:"110px" }}/>
            )}
          </tr>
        </thead>
        <tbody>
          {reqs.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-start gap-2.5">
                  <img src={imgHelperAvatar} alt={req.name} className="w-10 h-10 rounded-full object-cover shrink-0"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-xs leading-tight">{req.name}</p>
                    <p className="text-[10px] text-gray-400 leading-tight mb-0.5">↳ {req.serviceLabel}</p>
                    <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 max-w-[180px]">{req.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateCreated}</td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateExecution}</td>
              <td className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-100">{req.price}</td>
              <td className="px-3 py-3 text-gray-600 border-b border-gray-100">{req.address}</td>
              {onComplete && (
                <td className="px-3 py-3 border-b border-gray-100 text-right">
                  <button
                    onClick={() => onComplete(req.id)}
                    className="px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                    style={{background:"#EF4444"}}>
                    {t("dashboard.completeBtn")}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HelperAvailableTable({ reqs }: { reqs: HelperRequest[] }) {
  const { t } = useLanguage();
  const COLS = [t("dashboard.colDescription"), t("dashboard.colDateReg"), t("dashboard.colDateExec"), t("dashboard.colPrice"), t("dashboard.colAddress")];
  const [accepted, setAccepted] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const visible = reqs.filter(r => !rejected.includes(r.id));

  return (
    <div className="overflow-x-auto px-4 pt-3 pb-1">
      <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
        <thead>
          <tr>
            {COLS.map((h, i) => (
              <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap text-left"
                style={{
                  color: BLUE,
                  background: "white",
                  borderTop: "1px solid #BFDBFE",
                  borderBottom: "1px solid #BFDBFE",
                  borderLeft: i === 0 ? "1px solid #BFDBFE" : "none",
                  borderRight: "none",
                  borderRadius: i === 0 ? "10px 0 0 10px" : "0",
                }}>
                {h}
              </th>
            ))}
            <th style={{ background:"white", borderTop:"1px solid #BFDBFE", borderBottom:"1px solid #BFDBFE", borderRight:"1px solid #BFDBFE", borderLeft:"none", borderRadius:"0 10px 10px 0", width:"110px" }}/>
          </tr>
        </thead>
        <tbody>
          {visible.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-start gap-2.5">
                  <img src={imgHelperAvatar} alt={req.name} className="w-10 h-10 rounded-full object-cover shrink-0"/>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-xs leading-tight">{req.name}</p>
                    <p className="text-[10px] text-gray-400 leading-tight mb-0.5">↳ {req.serviceLabel}</p>
                    <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 max-w-[180px]">{req.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateCreated}</td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateExecution}</td>
              <td className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-100">{req.price}</td>
              <td className="px-3 py-3 text-gray-600 border-b border-gray-100">{req.address}</td>
              <td className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-center gap-1.5 justify-end">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{background:"#FEF9C3", border:"1px solid #FDE047"}} title="Написать">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <button onClick={() => setAccepted(a => [...a, req.id])}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{background: accepted.includes(req.id) ? GREEN : "#DCFCE7", border:`1px solid ${accepted.includes(req.id) ? GREEN : "#86EFAC"}`}} title="Принять">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={accepted.includes(req.id) ? "white" : "#22C55E"} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button onClick={() => setRejected(r => [...r, req.id])}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{background:"#FEE2E2", border:"1px solid #FCA5A5"}} title="Отклонить">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HelperDashboard({ user }: { user: { firstName: string } }) {
  const { t } = useLanguage();
  const [activeReqs, setActiveReqs] = useState<HelperRequest[]>(HELPER_ACTIVE);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleComplete = (id: number) => setCompletingId(id);
  const handleSubmitCompletion = () => {
    setActiveReqs(r => r.filter(x => x.id !== completingId));
    setCompletingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
        <p className="font-bold text-gray-800 text-sm">Добро пожаловать, {user.firstName}!</p>
        <p className="text-xs text-gray-500 mt-0.5">Сегодня в вашем регионе поступило <span className="font-semibold text-gray-700">12</span> новых запросов. Готовы помочь?</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-sm" style={{color:GREEN}}>{t("dashboard.activeRequests")}</h3>
        </div>
        {activeReqs.length === 0 ? (
          <p className="px-5 py-6 text-xs text-gray-400 text-center">Нет активных заявок</p>
        ) : (
          <HelperReqTable reqs={activeReqs} onComplete={handleComplete}/>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-bold text-sm text-gray-800">{t("dashboard.availableRequests")}</h3>
          <div className="relative">
            <button onClick={() => setFilterOpen(v=>!v)}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors">
              {t("dashboard.filterByDistance")} <ChevronDown className="w-3.5 h-3.5"/>
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[140px] overflow-hidden">
                {["По расстоянию","По дате","По цене"].map(opt=>(
                  <button key={opt} onClick={()=>setFilterOpen(false)}
                    className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700">{opt}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <HelperAvailableTable reqs={AVAILABLE_REQS}/>
      </div>

      {completingId !== null && (
        <CompletionModal onClose={() => setCompletingId(null)} onSubmit={handleSubmitCompletion}/>
      )}
    </div>
  );
}

/* ─────────────── chat detail ─────────────── */
function ChatDetail({ conv }: { conv: Conversation }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES[conv.id] ?? []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setMessages(m => [...m, { id: Date.now(), from: "me", text, time }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
        <Avatar conv={conv} size={40}/>
        <p className="font-bold text-gray-900 text-sm">{conv.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
        <div className="text-center">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">22 марта</span>
        </div>
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from==="me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed relative ${
              msg.from==="me"
                ? "text-white rounded-tr-sm"
                : "text-gray-800 rounded-tl-sm border border-gray-200"
            }`}
            style={msg.from==="me"?{background:BLUE}:{background:"white"}}>
              {msg.text.split("\n").map((line,i)=>(
                <span key={i}>{line}{i<msg.text.split("\n").length-1 && <br/>}</span>
              ))}
              <span className={`text-[10px] ml-2 ${msg.from==="me"?"text-blue-100":"text-gray-400"} inline-flex items-center gap-0.5`}>
                {msg.time}
                {msg.from==="me" && <CheckCheck className="w-3 h-3 text-blue-200"/>}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 bg-white">
        <input
          type="text"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && !e.shiftKey && handleSend()}
          placeholder="написать сообщение..."
          className="flex-1 text-xs text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
        />
        <button onClick={handleSend} className="shrink-0 transition-opacity hover:opacity-75" style={{color:BLUE}}>
          <Send className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
}

/* ─────────────── messages list ─────────────── */
type MsgFilter = "all" | "new" | "read" | "important";

function MessagesContent({ onOpenChat }: { onOpenChat: (id: number) => void }) {
  const [filter, setFilter] = useState<MsgFilter>("all");

  const filterTabs: {key:MsgFilter;label:string}[] = [
    {key:"all",label:"Все"},
    {key:"new",label:"Новые"},
    {key:"read",label:"Прочитанные"},
    {key:"important",label:"Важные"},
  ];

  const filtered = CONVERSATIONS.filter(c => {
    if (filter==="new") return c.unread;
    if (filter==="read") return c.read;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100 px-2">
        {filterTabs.map(tab=>(
          <button key={tab.key} onClick={()=>setFilter(tab.key)}
            className="px-4 py-3.5 text-xs font-semibold transition-colors whitespace-nowrap border-b-2 -mb-px"
            style={filter===tab.key
              ?{color:BLUE,borderColor:BLUE}
              :{color:"#6b7280",borderColor:"transparent"}}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.map(conv=>(
          <button key={conv.id} onClick={()=>onOpenChat(conv.id)}
            className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
            <Avatar conv={conv} size={44}/>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-tight ${conv.unread?"font-bold text-gray-900":"font-semibold text-gray-800"}`}>
                {conv.name}
              </p>
              <p className="text-xs text-gray-400 leading-snug mt-0.5 line-clamp-2 whitespace-pre-line">
                {conv.preview}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
              <span className="text-xs text-gray-400 whitespace-nowrap">{conv.time}</span>
              {conv.read && <CheckCheck className="w-3.5 h-3.5" style={{color:BLUE}}/>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── my requests page ─────────────── */
function RequestsTable({
  requests,
  onCancel,
  emptyText,
}: {
  requests: ServiceRequest[];
  onCancel?: (id: number) => void;
  emptyText: string;
}) {
  const COLS = ["Наименование", "Дата регистрации", "Дата выполнения услуг", "Цена", "Помощник"];

  return (
    <div className="overflow-x-auto px-4 pt-3 pb-1">
      <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: "0 6px" }}>
        <thead>
          <tr>
            {COLS.map((h, i) => {
              const isFirst = i === 0;
              const isLast = !onCancel && i === COLS.length - 1;
              return (
                <th
                  key={h}
                  className="px-4 py-2.5 font-medium whitespace-nowrap"
                  style={{
                    color: BLUE,
                    background: "white",
                    borderTop: "1px solid #BFDBFE",
                    borderBottom: "1px solid #BFDBFE",
                    borderLeft: isFirst ? "1px solid #BFDBFE" : "none",
                    borderRight: isLast ? "1px solid #BFDBFE" : "none",
                    borderRadius: isFirst ? "10px 0 0 10px" : isLast ? "0 10px 10px 0" : "0",
                    textAlign: "left",
                  }}
                >{h}</th>
              );
            })}
            {onCancel && (
              <th
                style={{
                  background: "white",
                  borderTop: "1px solid #BFDBFE",
                  borderBottom: "1px solid #BFDBFE",
                  borderRight: "1px solid #BFDBFE",
                  borderLeft: "none",
                  borderRadius: "0 10px 10px 0",
                  width: "90px",
                }}
              />
            )}
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">{emptyText}</td></tr>
          ) : requests.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <img src={SERVICE_IMG[req.serviceKey] ?? imgHousehold} alt={req.serviceLabel} className="w-full h-full object-contain p-1"/>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 leading-tight">{req.serviceLabel}</p>
                    <p className="text-gray-400 leading-tight truncate max-w-[140px]">{req.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateCreated}</td>
              <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-b border-gray-100">{req.dateExecution}</td>
              <td className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-100">{req.price}</td>
              <td className="px-3 py-3 border-b border-gray-100">
                {req.helper
                  ? <span className="text-gray-700">{req.helper}</span>
                  : <span className="italic text-gray-400">в поиске</span>}
              </td>
              {onCancel && (
                <td className="px-3 py-3 border-b border-gray-100 text-right">
                  <button
                    onClick={() => onCancel(req.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors hover:bg-red-50 whitespace-nowrap"
                    style={{ color: "#EF4444", borderColor: "#fecaca" }}
                  >
                    Отменить
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MyRequestsContent({ userId }: { userId: number }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(() => loadRequests(userId));

  const active    = requests.filter(r => (r.status ?? "active") === "active");
  const completed = requests.filter(r => r.status === "completed");
  const cancelled = requests.filter(r => r.status === "cancelled");

  const handleCancel = (id: number) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: "cancelled" as RequestStatus } : r);
    setRequests(updated);
    saveRequests(userId, updated);
  };

  const Section = ({
    title,
    color,
    reqs,
    showCancel,
  }: {
    title: string;
    color: string;
    reqs: ServiceRequest[];
    showCancel?: boolean;
  }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100">
        <h3 className="font-bold text-sm" style={{ color }}>{title}</h3>
      </div>
      <RequestsTable
        requests={reqs}
        onCancel={showCancel ? handleCancel : undefined}
        emptyText="Нет заявок"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Активные заявки"   color={GREEN}      reqs={active}    showCancel />
      <Section title="Прошлые заявки"    color="#374151"    reqs={completed}            />
      <Section title="Отмененные заявки" color="#EF4444"    reqs={cancelled}            />
    </div>
  );
}

/* ─────────────── coming soon placeholder ─────────────── */
function ComingSoon() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">{t("dashboard.comingSoon")}</p>
    </div>
  );
}

/* ─────────────── main content area ─────────────── */
function DashboardContent({ activeNav, userId, userRole, firstName, openedChatId, setOpenedChatId }: {
  activeNav: NavKey;
  userId: number;
  userRole: string;
  firstName: string;
  openedChatId: number | null;
  setOpenedChatId: (id: number | null) => void;
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  if (activeNav==="messages") {
    if (openedChatId !== null) {
      const conv = CONVERSATIONS.find(c=>c.id===openedChatId);
      if (!conv) return null;
      return (
        <div style={{ height: "calc(100vh - 108px)" }}>
          <ChatDetail conv={conv}/>
        </div>
      );
    }
    return <MessagesContent onOpenChat={setOpenedChatId}/>;
  }

  if (activeNav==="requests") return <MyRequestsContent userId={userId}/>;

  if (activeNav!=="dashboard") return <ComingSoon/>;

  if (userRole === "offer-help") {
    return <HelperDashboard user={{ firstName }}/>;
  }

  const tabs: {key:TabKey;label:string}[] = [
    {key:"create",        label:t("dashboard.tabCreate")},
    {key:"search",        label:t("dashboard.tabSearch")},
    {key:"notifications", label:t("dashboard.tabNotifications")},
    {key:"settings",      label:t("dashboard.tabSettings")},
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex">
          {tabs.map(tab=>(
            <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
              className="px-5 py-3 text-xs font-semibold transition-colors whitespace-nowrap border-b-2"
              style={activeTab===tab.key?{color:BLUE,borderColor:BLUE,background:"white"}:{color:"#6b7280",borderColor:"transparent"}}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab==="create" ? <CreateRequestTab userId={userId}/> : <ComingSoon/>}
    </div>
  );
}

/* ─────────────── page root ─────────────── */
function DashboardPage() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [openedChatId, setOpenedChatId] = useState<number | null>(null);

  if (!currentUser) return null;

  const handleNavChange = (key: NavKey) => {
    setActiveNav(key);
    setOpenedChatId(null);
  };

  const navTitleMap: Partial<Record<NavKey, string>> = {
    messages: t("dashboard.navMessages"),
    requests: t("dashboard.navMyRequests"),
  };

  const headerLeft = navTitleMap[activeNav] ? (
    <button
      onClick={() => {
        if (activeNav === "messages" && openedChatId !== null) setOpenedChatId(null);
        else handleNavChange("dashboard");
      }}
      className="flex items-center gap-1.5 font-bold text-sm transition-opacity hover:opacity-75"
      style={{ color: BLUE }}
    >
      <ArrowLeft className="w-4 h-4"/>
      {navTitleMap[activeNav]}
    </button>
  ) : (
    <p className="text-sm font-bold" style={{ color: BLUE }}>{t("dashboard.title")}</p>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar activeNav={activeNav} setActiveNav={handleNavChange} user={currentUser}/>

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50">
        <div className="p-4 flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3 flex items-center justify-between shrink-0">
            {headerLeft}
            <div className="flex items-center gap-2">
              <AccessibilityToggle/>
              <LanguageSwitcher/>
            </div>
          </div>

          <DashboardContent
            activeNav={activeNav}
            userId={currentUser.id}
            userRole={currentUser.role}
            firstName={currentUser.firstName}
            openedChatId={openedChatId}
            setOpenedChatId={setOpenedChatId}
          />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPageWithGuard() {
  return (
    <AuthGuard>
      <DashboardPage/>
    </AuthGuard>
  );
}
