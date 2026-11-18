import { FormEvent, useMemo, useRef, useState } from "react"
import {
  Bell,
  BookOpen,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Eye,
  EyeOff,
  FileCheck2,
  Filter,
  HelpCircle,
  IdCard,
  Inbox,
  KeyRound,
  Laptop,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Upload,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react"

type Page = "browse" | "report" | "activity" | "chat" | "notifications" | "profile"
type ItemStatus = "Lost" | "Found" | "Pending Claim" | "Claimed" | "Returned"
type ClaimStatus = "Pending" | "Approved" | "Rejected"
type RewardType = "none" | "money" | "other"
type AuthView = "home" | "about" | "login" | "signup" | "forgot" | "verify"

type DemoUser = {
  id: string
  name: string
  initials: string
  accountType: "PLM Student" | "PLM Staff" | "External User"
  email: string
  studentNumber?: string
  staffId?: string
  yearLevel?: string
  course?: string
  college?: string
  school?: string
  phone?: string
  role: string
}

type Item = {
  id: number
  name: string
  category: string
  status: ItemStatus
  date: string
  location: string
  description: string
  image: string
  reporter: string
  reporterRole: string
  question?: string
  answer?: string
  mine?: boolean
  ownerId?: string
  rewardType?: RewardType
  rewardAmount?: string
  rewardDescription?: string
}

type Claim = {
  id: number
  itemId: number
  claimant: string
  accountType: string
  status: ClaimStatus
  requested: string
  verified: boolean
  explanation: string
  proof?: string
  claimantId?: string
}

type Message = {
  id: number
  mine: boolean
  text: string
  time: string
}

type Conversation = {
  id: number
  itemId: number
  user: string
  avatar: string
  unread: number
  messages: Message[]
}

type ItemCardProps = {
  item: Item
  onClick: () => void
}

const demoUsers: DemoUser[] = [
  {
    id: "student",
    name: "Ana Dela Cruz",
    initials: "AD",
    accountType: "PLM Student",
    email: "ana.delacruz@plm.edu.ph",
    studentNumber: "2023-10427",
    yearLevel: "2nd Year",
    course: "BS Computer Science",
    college: "College of Engineering and Technology",
    phone: "+63 917 100 0427",
    role: "General student testing account",
  },
  {
    id: "staff",
    name: "Roberto Santos",
    initials: "RS",
    accountType: "PLM Staff",
    email: "roberto.santos@plm.edu.ph",
    staffId: "PLM-STAFF-084",
    phone: "+63 917 200 0084",
    role: "University staff testing account",
  },
  {
    id: "external",
    name: "Carlos Villanueva",
    initials: "CV",
    accountType: "External User",
    email: "carlos.villanueva@gmail.com",
    school: "Mapúa University",
    phone: "+63 917 300 1182",
    role: "Verified external visitor",
  },
  {
    id: "finder",
    name: "Mika Reyes",
    initials: "MR",
    accountType: "PLM Student",
    email: "mika.reyes@plm.edu.ph",
    studentNumber: "2022-10482",
    yearLevel: "3rd Year",
    course: "BS Information Technology",
    college: "College of Engineering and Technology",
    phone: "+63 917 482 1048",
    role: "Finder with incoming claim requests",
  },
  {
    id: "claimant",
    name: "Joaquin Flores",
    initials: "JF",
    accountType: "PLM Student",
    email: "joaquin.flores@plm.edu.ph",
    studentNumber: "2023-11876",
    yearLevel: "2nd Year",
    course: "BS Business Administration",
    college: "PLM Business School",
    phone: "+63 917 520 1876",
    role: "Claimant with active ownership requests",
  },
]

const yearLevels = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "6th Year",
  "7th Year",
]

const plmColleges = [
  "College of Accountancy (CA)",
  "College of Architecture and Sustainable Built Environments (CASBE)",
  "College of Business Administration (CBA)",
  "College of Education (CED)",
  "College of Engineering (CE)",
  "College of Humanities, Arts and Social Sciences (CHASS)",
  "College of Information Systems and Technology Management (CISTM)",
  "College of Medicine (CM)",
  "College of Nursing (CN)",
  "College of Physical Therapy (CPT)",
  "College of Public Administration (CPA)",
  "College of Science (CS)",
  "College of Tourism and Hospitality Management (CTHM)",
  "College of Law (CL)",
]

const photos = {
  wallet:
    "https://images.unsplash.com/photo-1579014134953-1580d7f123f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  tech: "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  laptop:
    "https://images.unsplash.com/photo-1589979034086-5885b60c8f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  phone:
    "https://images.unsplash.com/photo-1542351967-d5ae722fed71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  calculator:
    "https://images.unsplash.com/photo-1516201580490-33550d32de5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  books:
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
  keys: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
  id: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=80",
  umbrella:
    "https://images.unsplash.com/photo-1551492625-0ad059e5f5e5?auto=format&fit=crop&w=1200&q=80",
}

const initialItems: Item[] = [
  {
    id: 1,
    name: "Black leather wallet",
    category: "Accessories",
    status: "Found",
    date: "May 18, 2025",
    location: "University Library, 2nd floor",
    description:
      "A slim black leather wallet was found beside the north reading area. Contents are secured and will be used only for ownership verification.",
    image: photos.wallet,
    reporter: "Mika Reyes",
    reporterRole: "PLM Student",
    ownerId: "finder",
    question: "What small symbol is embossed inside the wallet?",
    answer: "star",
    mine: true,
  },
  {
    id: 2,
    name: "Silver laptop with clear case",
    category: "Electronics",
    status: "Lost",
    date: "May 17, 2025",
    location: "Gusaling Villegas, Room 307",
    description:
      "13-inch silver laptop in a clear shell with two small stickers near the trackpad. Last seen after an afternoon lecture.",
    image: photos.laptop,
    reporter: "Paolo Santos",
    reporterRole: "PLM Student",
    rewardType: "money",
    rewardAmount: "500",
  },
  {
    id: 3,
    name: "PLM student ID",
    category: "IDs and Cards",
    status: "Found",
    date: "May 17, 2025",
    location: "University Activity Center",
    description:
      "Student identification card found near the west entrance. The name and number are hidden for the owner’s privacy.",
    image: photos.id,
    reporter: "Elena Cruz",
    reporterRole: "PLM Staff",
    ownerId: "staff",
    question: "What is the last digit of your student number?",
    answer: "7",
  },
  {
    id: 4,
    name: "White wireless earbuds",
    category: "Electronics",
    status: "Pending Claim",
    date: "May 16, 2025",
    location: "Tanghalang Bayan",
    description:
      "Wireless earbuds in a white charging case, found under a seat after a student assembly.",
    image: photos.tech,
    reporter: "Mika Reyes",
    reporterRole: "PLM Student",
    ownerId: "finder",
    question: "What word is written under the case?",
    answer: "north",
    mine: true,
  },
  {
    id: 5,
    name: "Scientific calculator",
    category: "Electronics",
    status: "Found",
    date: "May 15, 2025",
    location: "College of Engineering lobby",
    description:
      "Dark scientific calculator with a protective cover and a faded label on the back.",
    image: photos.calculator,
    reporter: "Nathan Lim",
    reporterRole: "PLM Student",
    question: "What are the initials on the back label?",
    answer: "ncl",
  },
  {
    id: 6,
    name: "Constitutional Law notes",
    category: "Books and Notes",
    status: "Lost",
    date: "May 15, 2025",
    location: "Justo Albert Auditorium",
    description:
      "Blue binder containing handwritten Constitutional Law notes and highlighted reading materials.",
    image: photos.books,
    reporter: "Alyssa Mendoza",
    reporterRole: "PLM Student",
    rewardType: "other",
    rewardDescription: "Coffee and a meal voucher",
  },
  {
    id: 7,
    name: "Keyring with blue tag",
    category: "Accessories",
    status: "Returned",
    date: "May 14, 2025",
    location: "PLM Chapel walkway",
    description:
      "Three keys on a silver ring with a small blue acrylic tag. Successfully returned to its owner.",
    image: photos.keys,
    reporter: "Mika Reyes",
    reporterRole: "PLM Student",
    ownerId: "finder",
    mine: true,
  },
  {
    id: 8,
    name: "Android smartphone",
    category: "Electronics",
    status: "Found",
    date: "May 14, 2025",
    location: "Intramuros Gate entrance",
    description:
      "Dark Android phone in a textured case. Screen is locked and the device is being kept safely.",
    image: photos.phone,
    reporter: "Carlos Villanueva",
    reporterRole: "External User",
    ownerId: "external",
    question: "What color is the lock-screen wallpaper?",
    answer: "green",
  },
  {
    id: 9,
    name: "Cream folding umbrella",
    category: "Others",
    status: "Lost",
    date: "May 13, 2025",
    location: "Pamantasan Gymnasium",
    description:
      "Compact cream umbrella with a wooden handle and a tan wrist strap.",
    image: photos.umbrella,
    reporter: "Bea Navarro",
    reporterRole: "PLM Student",
    rewardType: "none",
  },
]

const initialClaims: Claim[] = [
  {
    id: 1,
    itemId: 4,
    claimant: "Joaquin Flores",
    claimantId: "claimant",
    accountType: "PLM Student",
    status: "Pending",
    requested: "Today, 9:42 AM",
    verified: true,
    explanation:
      "I can also confirm the serial number in person. I last used these during the student assembly.",
  },
  {
    id: 2,
    itemId: 7,
    claimant: "Sofia Ramos",
    claimantId: "staff",
    accountType: "PLM Staff",
    status: "Approved",
    requested: "May 14, 2025",
    verified: true,
    explanation: "The keys include my faculty office key and desk key.",
  },
  {
    id: 3,
    itemId: 5,
    claimant: "Joaquin Flores",
    claimantId: "claimant",
    accountType: "PLM Student",
    status: "Rejected",
    requested: "May 16, 2025",
    verified: true,
    explanation:
      "It looked similar to the calculator I misplaced before an exam.",
  },
]

const initialConversations: Conversation[] = [
  {
    id: 1,
    itemId: 4,
    user: "Joaquin Flores",
    avatar: "JF",
    unread: 2,
    messages: [
      {
        id: 1,
        mine: false,
        text: "Hi Mika, I believe the white earbuds you found are mine.",
        time: "9:41 AM",
      },
      {
        id: 2,
        mine: true,
        text: "Thanks for reaching out. I received your claim and verification.",
        time: "9:43 AM",
      },
      {
        id: 3,
        mine: false,
        text: "I can share the serial number or meet at the library desk to verify them.",
        time: "9:46 AM",
      },
    ],
  },
  {
    id: 2,
    itemId: 7,
    user: "Sofia Ramos",
    avatar: "SR",
    unread: 0,
    messages: [
      {
        id: 1,
        mine: true,
        text: "Your claim has been approved. When can you pick up the keys?",
        time: "Yesterday",
      },
      {
        id: 2,
        mine: false,
        text: "Thank you! I can meet you by the library entrance at 3 PM.",
        time: "Yesterday",
      },
      {
        id: 3,
        mine: true,
        text: "The keys have been safely returned. Glad we found you.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    itemId: 8,
    user: "Gabriel Tan",
    avatar: "GT",
    unread: 0,
    messages: [
      {
        id: 1,
        mine: false,
        text: "Could I ask where exactly in the library the wallet was found?",
        time: "Mon",
      },
      {
        id: 2,
        mine: true,
        text: "It was beside the north reading area, close to the windows.",
        time: "Mon",
      },
    ],
  },
]

const initialNotifications = [
  {
    id: 1,
    type: "claim",
    title: "New claim request",
    text: "Joaquin Flores submitted a claim for White wireless earbuds.",
    time: "12 minutes ago",
    unread: true,
    target: "activity" as Page,
  },
  {
    id: 2,
    type: "message",
    title: "New message from Joaquin",
    text: "“I can share the serial number or meet at the library desk…”",
    time: "18 minutes ago",
    unread: true,
    target: "chat" as Page,
  },
  {
    id: 3,
    type: "approved",
    title: "Claim approved",
    text: "Your claim for the Blue keyring has been approved.",
    time: "Yesterday",
    unread: false,
    target: "activity" as Page,
  },
  {
    id: 4,
    type: "return",
    title: "Item successfully returned",
    text: "Blue keyring was marked as returned. Thank you for helping.",
    time: "Yesterday",
    unread: false,
    target: "activity" as Page,
  },
]

const verificationStorageKey = "reclaim_verification_attempts"

function readVerificationAttempts() {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(verificationStorageKey) || "[]",
    )
    return Array.isArray(value) ? value as string[] : []
  } catch {
    return []
  }
}

function rewardText(item: Item) {
  if (item.rewardType === "money" && item.rewardAmount) {
    const amount = Number(item.rewardAmount)
    return `₱${
      Number.isFinite(amount)
        ? amount.toLocaleString("en-PH")
        : item.rewardAmount
    }`
  }
  if (item.rewardType === "other" && item.rewardDescription) {
    return item.rewardDescription
  }
  return "No Reward"
}

const navItems = [
  { id: "browse" as Page, label: "Browse items", icon: Search },
  { id: "report" as Page, label: "Report item", icon: Plus },
  { id: "activity" as Page, label: "My reports & claims", icon: FileCheck2 },
  { id: "chat" as Page, label: "Chat inbox", icon: MessageCircle },
  { id: "notifications" as Page, label: "Notifications", icon: Bell },
]

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div>
      <div className={`brand ${light ? "text-white" : "text-navy"}`}>
        Re<span>Claim</span>
      </div>
      <p
        className={`text-[9px] font-semibold tracking-[0.14em] uppercase ${
          light ? "text-white/55" : "text-[#70817f]"
        }`}
      >
        PLM lost & found
      </p>
    </div>
  )
}

function PublicNav({
  view,
  onNavigate,
}: {
  view: AuthView
  onNavigate: (view: AuthView) => void
}) {
  const [open, setOpen] = useState(false)
  const navigate = (nextView: AuthView) => {
    onNavigate(nextView)
    setOpen(false)
  }

  return (
    <header className="public-header">
      <button
        className="public-logo"
        onClick={() => navigate("home")}
        aria-label="ReClaim home"
      >
        <Logo />
      </button>
      <button
        className="public-menu"
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={`public-nav ${open ? "open" : ""}`}>
        <button
          className={view === "home" ? "active" : ""}
          onClick={() => navigate("home")}
        >
          Home
        </button>
        <button
          className={view === "about" ? "active" : ""}
          onClick={() => navigate("about")}
        >
          About
        </button>
        <span className="public-nav-divider" />
        <button className="login-link" onClick={() => navigate("login")}>
          Log In
        </button>
        <button className="signup-link" onClick={() => navigate("signup")}>
          Create Account
        </button>
      </nav>
    </header>
  )
}

function LostFoundIllustration({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={compact ? "lost-found-art compact" : "lost-found-art"}
      viewBox="0 0 720 410"
      role="img"
      aria-label="Two people using ReClaim to return a lost wallet"
    >
      <path
        className="art-soft"
        d="M75 338c76-49 154-31 222-13 92 25 172 21 346-16v73H75z"
      />
      <path
        className="art-butter"
        d="M278 68h183a20 20 0 0 1 20 20v206H258V88a20 20 0 0 1 20-20z"
      />
      <rect
        className="art-paper"
        x="287"
        y="96"
        width="165"
        height="155"
        rx="8"
      />
      <path className="art-line" d="M315 130h109M315 153h82M315 176h96" />
      <path className="art-line thick" d="M351 215h38m-19 0v36" />
      <path className="art-line" d="M327 294h84M308 311h122" />

      <circle className="art-paper" cx="158" cy="163" r="39" />
      <path
        className="art-fill"
        d="M121 157c4-49 70-56 77-5-18-5-33-18-41-34-4 20-17 34-36 39z"
      />
      <path className="art-line" d="M138 165c7 6 18 6 26 0m12-3h3" />
      <path
        className="art-oyster"
        d="M107 222c6-37 30-55 57-55 31 0 56 24 61 64l13 112H85z"
      />
      <path
        className="art-line"
        d="M108 223c-11 32-23 70-29 112m143-112c15 37 24 76 25 116M137 204c12 12 27 12 39 0"
      />
      <path className="art-line" d="M221 242c49-7 79-8 112-3" />
      <path className="art-paper" d="M302 224h54v38h-54a19 19 0 0 1 0-38z" />
      <circle className="art-fill" cx="337" cy="243" r="3" />

      <circle className="art-paper" cx="574" cy="161" r="39" />
      <path
        className="art-fill"
        d="M536 159c0-47 62-61 78-19 5 14 5 36-3 51-3-34-24-48-48-59-4 15-13 23-27 27z"
      />
      <path
        className="art-line"
        d="M567 166c8 6 18 6 25 0m-16 15c7 4 14 4 21 0"
      />
      <path
        className="art-oyster"
        d="M510 225c6-39 31-58 62-58 29 0 55 22 61 63l20 113H487z"
      />
      <path
        className="art-line"
        d="M512 224c-14 29-24 68-28 111m146-110c12 34 21 72 25 111M549 205c11 11 27 11 39 0"
      />
      <path className="art-line" d="M516 241c-47-3-80-2-119 3" />
      <rect
        className="art-fill"
        x="356"
        y="225"
        width="44"
        height="36"
        rx="5"
      />
      <path className="art-paper" d="M353 235h7m32 0h7" />

      <path
        className="art-line"
        d="M94 347h559M74 84c18-18 37-18 55 0s37 18 55 0M545 69c14-14 29-14 43 0s29 14 43 0"
      />
      <path className="art-line" d="M200 72v24m-12-12h24M503 112v19m-10-9h20" />
      <circle className="art-butter" cx="81" cy="191" r="12" />
      <circle className="art-oyster" cx="656" cy="184" r="15" />
      <path className="art-line" d="M67 191h28M656 169v30" />
      <path className="art-line" d="M136 347v35m68-35v35m330-35v35m67-35v35" />
    </svg>
  )
}

function LandingPage({ onNavigate }: { onNavigate: (view: AuthView) => void }) {
  return (
    <div className="public-site">
      <PublicNav view="home" onNavigate={onNavigate} />
      <main>
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="landing-kicker">
              <span />
              Community-powered lost & found
            </span>
            <h1>
              Lost something?
              <br />
              <em>Let’s bring it back.</em>
            </h1>
            <div className="landing-purpose">
              <ShieldCheck size={17} />
              <span>
                Report with care. Verify with confidence. Return with kindness.
              </span>
            </div>
          </div>
          <div className="landing-art-wrap">
            <span className="art-label label-found">
              <CheckCircle2 size={14} /> Item found
            </span>
            <span className="art-label label-secure">
              <ShieldCheck size={14} /> Verified return
            </span>
            <LostFoundIllustration />
          </div>
        </section>
      </main>
    </div>
  )
}

function AboutPage({ onNavigate }: { onNavigate: (view: AuthView) => void }) {
  return (
    <div className="public-site about-page">
      <PublicNav view="about" onNavigate={onNavigate} />
      <main className="about-main">
        <section className="about-intro">
          <p className="landing-kicker">
            <span />
            Our purpose
          </p>
          <h1>About ReClaim</h1>
          <p>
            ReClaim is a centralized lost-and-found platform for PLM students,
            faculty, staff, and visitors. It brings reporting, discovery,
            ownership verification, and secure communication into one trusted
            space—helping missing belongings find their way back to the right
            people.
          </p>
        </section>
        <section className="about-quote">
          <span aria-hidden="true">“</span>
          <blockquote>
            Every lost item has a story, and every found item is a chance to
            make someone’s day. Let’s make finding what matters easier.
          </blockquote>
        </section>
        <section className="about-contact">
          <h2>Contact Us</h2>
          <p>
            Have questions, concerns, or suggestions about ReClaim? Feel free to
            reach out to us through our email.
          </p>
          <a href="mailto:reclaim@plm.edu.ph">reclaim@plm.edu.ph</a>
        </section>
      </main>
    </div>
  )
}

function Auth({ onLogin }: { onLogin: (user: DemoUser) => void }) {
  const [view, setView] = useState<AuthView>("home")
  const [showPassword, setShowPassword] = useState(false)
  const [accountKind, setAccountKind] = useState<"plm" | "external" | null>(
    null,
  )
  const [role, setRole] = useState<"student" | "staff">("student")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")
    if (!email.trim() || !password) {
      setError("Enter any text in both fields to continue testing.")
      return
    }
    const normalizedIdentity = email.trim().toLowerCase()
    onLogin({
      ...demoUsers[3],
      id: `prototype:${normalizedIdentity}`,
      email: email.trim(),
      name: email.includes("@") ? email.split("@")[0] : email.trim(),
      initials: email.trim().slice(0, 2).toUpperCase(),
    })
  }

  if (view === "home") {
    return <LandingPage onNavigate={setView} />
  }

  if (view === "about") {
    return <AboutPage onNavigate={setView} />
  }

  if (view === "forgot") {
    return (
      <ForgotPassword onBack={() => setView("login")} onNavigate={setView} />
    )
  }

  if (view === "verify") {
    return (
      <div className="auth-page">
        <PublicNav view={view} onNavigate={setView} />
        <main className="auth-stage">
          <AuthDecor />
          <div className="auth-card auth-card-surface max-w-[470px] text-center">
            <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-sage text-teal">
              <ShieldCheck size={31} />
            </div>
            <p className="eyebrow">One last step</p>
            <h1 className="font-display text-3xl font-bold text-navy mt-2">
              Verify your email
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              We sent a 6-digit code to your email. This frontend demonstration
              accepts any six digits.
            </p>
            <div className="mt-7 flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((number) => (
                <input
                  key={number}
                  maxLength={1}
                  className="code-input"
                  defaultValue={number === 0 ? "4" : ""}
                  aria-label={`Digit ${number + 1}`}
                />
              ))}
            </div>
            <button
              className="btn-primary mt-7 w-full"
              onClick={() => onLogin(demoUsers[0])}
            >
              Verify and continue <ChevronRight size={17} />
            </button>
            <button
              className="text-button mt-4"
              onClick={() => setView("signup")}
            >
              Resend verification code
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <PublicNav view={view} onNavigate={setView} />
      <main className="auth-stage">
        <AuthDecor />
        <div
          className={`auth-card auth-card-surface ${
            view === "signup" ? "max-w-[660px]" : "max-w-[470px]"
          }`}
        >
          {view === "login" ? (
            <>
              <p className="eyebrow text-center">Good to see you again</p>
              <h1 className="auth-title text-center">Welcome Back!</h1>
              <p className="auth-copy">
                Log in to your ReClaim account to continue finding what matters.
              </p>
              <form className="mt-8 space-y-5" onSubmit={submitLogin}>
                <Field
                  label="Email address or username"
                  name="email"
                  placeholder="Email Address"
                  icon={<UserRound size={17} />}
                />
                <div>
                  <label className="field-label" htmlFor="password">
                    Password
                  </label>
                  <div className="field-wrap">
                    <LockKeyhole size={17} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="field-action"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="form-error">
                    <XCircle size={16} />
                    {error}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[#546866]">
                    <input type="checkbox" className="accent-[#4B2E1F]" />{" "}
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setView("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>
                <button className="btn-primary w-full" type="submit">
                  Sign in <ChevronRight size={17} />
                </button>
              </form>
              <p className="mt-7 text-center text-sm text-muted">
                Don’t have an account?{" "}
                <button
                  className="text-button font-semibold"
                  onClick={() => setView("signup")}
                >
                  Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <button
                className="back-link"
                onClick={() => {
                  setView("login")
                  setAccountKind(null)
                  setStep(1)
                }}
              >
                <ChevronLeft size={16} /> Back to sign in
              </button>
              <div className="mt-5 flex items-start justify-between gap-5">
                <div>
                  <p className="eyebrow">Create your account</p>
                  <h1 className="font-display text-[32px] leading-tight font-bold text-navy mt-2">
                    Join the recovery network.
                  </h1>
                </div>
                <span className="step-chip">Step {step} of 2</span>
              </div>
              {!accountKind ? (
                <>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <AccountCard
                      icon={<IdCard />}
                      title="PLM Student / Staff"
                      text="Use your verified university credentials."
                      onClick={() => setAccountKind("plm")}
                    />
                    <AccountCard
                      icon={<UserRound />}
                      title="External User"
                      text="For visitors and members of other schools."
                      onClick={() => setAccountKind("external")}
                    />
                  </div>
                  <p className="mt-7 text-center text-sm text-muted">
                    Already have an account?{" "}
                    <button
                      className="text-button font-semibold"
                      onClick={() => setView("login")}
                    >
                      Log In
                    </button>
                  </p>
                </>
              ) : (
                <form
                  className="mt-7"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setView("verify")
                  }}
                >
                  <button
                    type="button"
                    className="text-button mb-5 flex items-center gap-1"
                    onClick={() => setAccountKind(null)}
                  >
                    <ChevronLeft size={15} /> Change account type
                  </button>
                  {accountKind === "plm" && (
                    <div className="segmented mb-5">
                      <button
                        type="button"
                        className={role === "student" ? "active" : ""}
                        onClick={() => setRole("student")}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        className={role === "staff" ? "active" : ""}
                        onClick={() => setRole("staff")}
                      >
                        Staff
                      </button>
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      name="name"
                      placeholder="Your complete name"
                    />
                    {accountKind === "external" && (
                      <Field
                        label="Age"
                        name="age"
                        type="number"
                        placeholder="18"
                      />
                    )}
                    <Field
                      label={
                        accountKind === "plm"
                          ? "Official PLM email"
                          : "Gmail address"
                      }
                      name="email"
                      placeholder="Email Address"
                    />
                    {accountKind === "external" ? (
                      <>
                        <Field
                          label="Contact number"
                          name="contact"
                          placeholder="+63 9XX XXX XXXX"
                        />
                        <Field
                          label="School / University (optional)"
                          name="school"
                          placeholder="Current school"
                        />
                      </>
                    ) : (
                      <>
                        <Field
                          label={
                            role === "student"
                              ? "Student number"
                              : "Staff ID number"
                          }
                          name="id"
                          placeholder={
                            role === "student" ? "2022-12345" : "PLM-STAFF-001"
                          }
                        />
                        <Field
                          label="Contact number"
                          name="contact"
                          placeholder="Enter your contact number"
                          inputMode="tel"
                          pattern="^[0-9+() -]{7,20}$"
                          title="Enter a valid contact number using 7 to 20 digits or common phone symbols."
                        />
                        {role === "student" && (
                          <>
                            <SelectField
                              label="Year Level"
                              name="year"
                              placeholder="Select Year Level"
                              options={yearLevels}
                            />
                            <Field
                              label="Course / Program"
                              name="course"
                              placeholder="BS Information Technology"
                            />
                            <SelectField
                              label="College"
                              name="college"
                              placeholder="Select College"
                              options={plmColleges}
                            />
                          </>
                        )}
                      </>
                    )}
                    <Field
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="At least 8 characters"
                    />
                    <Field
                      label="Confirm password"
                      name="confirm"
                      type="password"
                      placeholder="Repeat password"
                    />
                  </div>
                  <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted">
                    <input
                      required
                      type="checkbox"
                      className="mt-1 accent-[#4B2E1F]"
                    />
                    I agree to ReClaim’s privacy and responsible use policy.
                    This demo does not create a production account.
                  </label>
                  <button className="btn-primary mt-6 w-full" type="submit">
                    Create account <ChevronRight size={17} />
                  </button>
                  <p className="mt-6 text-center text-sm text-muted">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-button font-semibold"
                      onClick={() => setView("login")}
                    >
                      Log In
                    </button>
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function AuthDecor() {
  return (
    <div className="auth-decor" aria-hidden="true">
      <div className="auth-art">
        <LostFoundIllustration compact />
      </div>
      <span className="decor-loop loop-one" />
      <span className="decor-loop loop-two" />
      <span className="decor-block block-one" />
      <span className="decor-block block-two" />
    </div>
  )
}

function ForgotPassword({
  onBack,
  onNavigate,
}: {
  onBack: () => void
  onNavigate: (view: AuthView) => void
}) {
  const [step, setStep] = useState(1)
  return (
    <div className="auth-page">
      <PublicNav view="forgot" onNavigate={onNavigate} />
      <main className="auth-stage">
        <AuthDecor />
        <div className="auth-card auth-card-surface max-w-[470px]">
          <button className="back-link" onClick={onBack}>
            <ChevronLeft size={16} /> Back to login
          </button>
          <div className="mt-7 grid size-13 place-items-center rounded-2xl bg-sage text-teal">
            <KeyRound />
          </div>
          <p className="eyebrow mt-6">Account recovery</p>
          <h1 className="auth-title">
            {step === 1
              ? "Reset your password."
              : step === 2
                ? "Check your email."
                : "Password updated."}
          </h1>
          {step === 1 && (
            <>
              <p className="auth-copy">
                Enter your registered email and we’ll send a secure reset code.
              </p>
              <div className="mt-7">
                <Field
                  label="Registered email address"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                />
              </div>
              <button
                className="btn-primary mt-6 w-full"
                onClick={() => setStep(2)}
              >
                Send reset code <Send size={16} />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <p className="auth-copy">
                For this demonstration, enter any code and choose a new
                password.
              </p>
              <div className="mt-7 space-y-4">
                <Field
                  label="Verification code"
                  name="code"
                  placeholder="6-digit code"
                />
                <Field
                  label="New password"
                  name="new-password"
                  type="password"
                  placeholder="At least 8 characters"
                />
                <Field
                  label="Confirm new password"
                  name="confirm"
                  type="password"
                  placeholder="Repeat new password"
                />
              </div>
              <button
                className="btn-primary mt-6 w-full"
                onClick={() => setStep(3)}
              >
                Update password <Check size={16} />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <p className="auth-copy">
                Your password has been reset successfully. You can now sign in
                with your new credentials.
              </p>
              <button className="btn-primary mt-7 w-full" onClick={onBack}>
                Return to login <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  inputMode,
  pattern,
  title,
}: {
  label: string
  name: string
  type?: string
  placeholder: string
  icon?: React.ReactNode
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  pattern?: string
  title?: string
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <div className="field-wrap">
        {icon}
        <input
          id={name}
          name={name}
          type={type === "password" ? "password" : "text"}
          placeholder={placeholder}
          inputMode={inputMode}
          pattern={pattern}
          title={title}
          required={!label.includes("optional")}
        />
      </div>
    </div>
  )
}

function SelectField({
  label,
  name,
  placeholder,
  options,
}: {
  label: string
  name: string
  placeholder: string
  options: string[]
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="select-field"
        defaultValue=""
        required
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function AccountCard({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  text: string
  onClick: () => void
}) {
  return (
    <button className="account-card" onClick={onClick}>
      <span className="account-icon">{icon}</span>
      <span className="font-display text-lg font-semibold text-navy">
        {title}
      </span>
      <span className="mt-1 text-sm leading-5 text-muted">{text}</span>
      <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-teal">
        Select <ChevronRight size={15} />
      </span>
    </button>
  )
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null)
  const [page, setPage] = useState<Page>("browse")
  const [items, setItems] = useState(initialItems)
  const [claims, setClaims] = useState(initialClaims)
  const [conversations, setConversations] = useState(initialConversations)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState("")
  const [verificationAttempts, setVerificationAttempts] = useState<string[]>(
    readVerificationAttempts,
  )

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(""), 2800)
  }

  function goTo(nextPage: Page) {
    setPage(nextPage)
    setMobileNav(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function recordVerificationAttempt(userId: string, itemId: number) {
    const key = `${userId}:${itemId}`
    const storedAttempts = readVerificationAttempts()
    if (storedAttempts.includes(key)) return false
    const nextAttempts = [...storedAttempts, key]
    window.localStorage.setItem(
      verificationStorageKey,
      JSON.stringify(nextAttempts),
    )
    setVerificationAttempts(nextAttempts)
    return true
  }

  if (!currentUser)
    return (
      <Auth
        onLogin={(user) => {
          setCurrentUser(user)
          setPage("browse")
        }}
      />
    )

  const userItems = items.map((item) => ({
    ...item,
    mine: item.ownerId === currentUser.id,
  }))
  const unread = notifications.filter(
    (notification) => notification.unread,
  ).length

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="px-6 pt-7 pb-8">
          <Logo light />
        </div>
        <nav className="flex-1 px-3">
          <p className="nav-label">Workspace</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => goTo(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "chat" && <span className="nav-count">2</span>}
              {id === "notifications" && unread > 0 && (
                <span className="nav-count gold">{unread}</span>
              )}
            </button>
          ))}
          <p className="nav-label mt-8">Account</p>
          <button
            className={`nav-item ${page === "profile" ? "active" : ""}`}
            onClick={() => goTo("profile")}
          >
            <Settings size={18} />
            <span>Profile & settings</span>
          </button>
        </nav>
        <div className="sidebar-user">
          <button className="sidebar-profile" onClick={() => goTo("profile")}>
            <span className="avatar">{currentUser.initials}</span>
            <span className="min-w-0 text-left">
              <b>{currentUser.name}</b>
              <small>{currentUser.accountType}</small>
            </span>
            <MoreHorizontal size={18} />
          </button>
          <button
            className="logout-button"
            onClick={() => setCurrentUser(null)}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        />
      )}
      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="topbar-context">
            <span>ReClaim workspace</span>
            <ChevronRight size={13} />
            <b>
              {navItems.find((item) => item.id === page)?.label ||
                "Profile & settings"}
            </b>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="top-action hidden sm:flex"
              onClick={() => goTo("report")}
            >
              <Plus size={16} /> Report item
            </button>
            <button
              className="icon-button relative"
              onClick={() => goTo("notifications")}
              aria-label="Notifications"
            >
              <Bell size={19} />
              {unread > 0 && <span className="notification-dot">{unread}</span>}
            </button>
            <button className="top-profile" onClick={() => goTo("profile")}>
              <span className="avatar small">{currentUser.initials}</span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>
        <main className="content">
          {page === "browse" && (
            <Browse
              items={userItems}
              onSelect={setSelectedItem}
              onReport={() => goTo("report")}
            />
          )}
          {page === "report" && (
            <ReportForm
              onCancel={() => goTo("browse")}
              user={currentUser}
              onSubmit={(item) => {
                setItems((all) => [item, ...all])
                goTo("browse")
                notify("Your report is now live in Browse Items.")
              }}
            />
          )}
          {page === "activity" && (
            <Activity
              items={userItems}
              claims={claims}
              currentUserId={currentUser.id}
              onSelect={setSelectedItem}
              onUpdateClaim={(claimId, status) => {
                const claim = claims.find((entry) => entry.id === claimId)
                if (!claim) return
                setClaims((all) =>
                  all.map((entry) =>
                    entry.id === claimId ? { ...entry, status } : entry,
                  ),
                )
                setItems((all) =>
                  all.map((item) =>
                    item.id === claim.itemId
                      ? {
                          ...item,
                          status: status === "Approved" ? "Claimed" : "Found",
                        }
                      : item,
                  ),
                )
                setNotifications((all) => [
                  {
                    id: Date.now(),
                    type: status.toLowerCase(),
                    title: `Claim ${status.toLowerCase()}`,
                    text: `${claim.claimant} was notified about your decision.`,
                    time: "Just now",
                    unread: true,
                    target: "activity",
                  },
                  ...all,
                ])
                notify(`Claim ${status.toLowerCase()} and claimant notified.`)
              }}
              onReturned={(itemId) => {
                const returnedItem = items.find((item) => item.id === itemId)
                setItems((all) =>
                  all.map((item) =>
                    item.id === itemId ? { ...item, status: "Returned" } : item,
                  ),
                )
                setNotifications((all) => [
                  {
                    id: Date.now(),
                    type: "return",
                    title: "Item successfully returned",
                    text: `${returnedItem?.name || "The item"} was marked as returned.`,
                    time: "Just now",
                    unread: true,
                    target: "activity",
                  },
                  ...all,
                ])
                notify("Item marked as returned. Recovery complete.")
              }}
            />
          )}
          {page === "chat" && (
            <Chat
              conversations={conversations}
              items={items}
              currentUser={currentUser}
              setConversations={setConversations}
            />
          )}
          {page === "notifications" && (
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
              goTo={goTo}
            />
          )}
          {page === "profile" && (
            <Profile
              user={currentUser}
              notify={notify}
              onLogout={() => setCurrentUser(null)}
            />
          )}
        </main>
      </div>
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          verificationAlreadySubmitted={
            verificationAttempts.includes(
              `${currentUser.id}:${selectedItem.id}`,
            ) ||
            readVerificationAttempts().includes(
              `${currentUser.id}:${selectedItem.id}`,
            )
          }
          onClose={() => setSelectedItem(null)}
          onMessage={() => {
            setSelectedItem(null)
            goTo("chat")
          }}
          onClaim={(proof, explanation) => {
            if (!recordVerificationAttempt(currentUser.id, selectedItem.id)) {
              return false
            }
            const claim: Claim = {
              id: Date.now(),
              itemId: selectedItem.id,
              claimant: currentUser.name,
              claimantId: currentUser.id,
              accountType: currentUser.accountType,
              status: "Pending",
              requested: "Just now",
              verified: true,
              explanation,
              proof,
            }
            setClaims((all) => [claim, ...all])
            setNotifications((all) => [
              {
                id: Date.now(),
                type: "claim",
                title: "New claim request",
                text: `${currentUser.name} submitted a claim for ${selectedItem.name}.`,
                time: "Just now",
                unread: true,
                target: "activity",
              },
              ...all,
            ])
            setItems((all) =>
              all.map((item) =>
                item.id === selectedItem.id
                  ? { ...item, status: "Pending Claim" }
                  : item,
              ),
            )
            const existing = conversations.find(
              (conversation) => conversation.itemId === selectedItem.id,
            )
            if (!existing) {
              setConversations((all) => [
                {
                  id: Date.now(),
                  itemId: selectedItem.id,
                  user: currentUser.name,
                  avatar: currentUser.name
                    .split(" ")
                    .map((part) => part[0])
                    .join(""),
                  unread: 0,
                  messages: [
                    {
                      id: 1,
                      mine: true,
                      text: `Hi, I submitted an ownership claim for ${selectedItem.name}.`,
                      time: "Now",
                    },
                  ],
                },
                ...all,
              ])
            }
            setSelectedItem(null)
            notify("Claim submitted. A secure conversation is now available.")
            return true
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}

function Browse({
  items,
  onSelect,
  onReport,
}: {
  items: Item[]
  onSelect: (item: Item) => void
  onReport: () => void
}) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")
  const [category, setCategory] = useState("All")
  const categories = [
    "All",
    "Electronics",
    "IDs and Cards",
    "Books and Notes",
    "Accessories",
    "Others",
  ]
  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const haystack =
          `${item.name} ${item.description} ${item.location}`.toLowerCase()
        return (
          haystack.includes(search.toLowerCase()) &&
          (status === "All" || item.status === status) &&
          (category === "All" || item.category === category)
        )
      }),
    [items, search, status, category],
  )

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <ShieldCheck size={15} /> Trusted PLM community network
          </span>
          <h1>
            Helping lost things
            <br />
            <span>find their way home.</span>
          </h1>
          <p>
            Search verified campus reports or tell the community what you’ve
            lost or found.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="btn-cream" onClick={onReport}>
              <Plus size={17} /> Report an item
            </button>
            <button className="btn-ghost" onClick={() => setStatus("Found")}>
              Browse found items <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <b>142</b>
            <span>items reunited</span>
          </div>
          <div>
            <b>38</b>
            <span>active reports</span>
          </div>
          <div>
            <b>92%</b>
            <span>verified returns</span>
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-main">
          <Search size={20} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by item, description, or campus location..."
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              <X size={17} />
            </button>
          )}
        </div>
        <div className="status-toggle">
          {["All", "Lost", "Found"].map((value) => (
            <button
              key={value}
              className={status === value ? "active" : ""}
              onClick={() => setStatus(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </section>
      <div className="category-row">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <SlidersHorizontal size={15} /> Filter
        </span>
        {categories.map((value) => (
          <button
            key={value}
            className={category === value ? "active" : ""}
            onClick={() => setCategory(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Campus feed</p>
          <h2>Recently reported items</h2>
        </div>
        <span>
          {visibleItems.length}{" "}
          {visibleItems.length === 1 ? "result" : "results"}
        </span>
      </div>
      {visibleItems.length ? (
        <div className="item-grid">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onSelect(item)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div>
            <Search size={28} />
          </div>
          <h3>No matching items found</h3>
          <p>Try a broader search or change one of your filters.</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearch("")
              setStatus("All")
              setCategory("All")
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  )
}

function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <article className="item-card" onClick={onClick}>
      <div className="item-image">
        <img src={item.image} alt={item.name} />
        <StatusBadge status={item.status} />
      </div>
      <div className="item-content">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="item-category">{item.category}</p>
            <h3>{item.name}</h3>
          </div>
          <button className="card-arrow" aria-label={`View ${item.name}`}>
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="item-description">{item.description}</p>
        {item.status === "Lost" && (
          <div
            className={`reward-card-label ${
              item.rewardType && item.rewardType !== "none" ? "offered" : ""
            }`}
          >
            <WalletCards size={13} />
            <span>
              {item.rewardType && item.rewardType !== "none"
                ? `Reward Offered · ${rewardText(item)}`
                : "No Reward"}
            </span>
          </div>
        )}
        <div className="item-meta">
          <span>
            <MapPin size={14} />
            {item.location}
          </span>
          <span>
            <Clock3 size={14} />
            {item.date}
          </span>
        </div>
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: ItemStatus | ClaimStatus }) {
  return (
    <span
      className={`status-badge status-${status.toLowerCase().replace(" ", "-")}`}
    >
      {status}
    </span>
  )
}

function ReportForm({
  onCancel,
  onSubmit,
  user,
}: {
  onCancel: () => void
  onSubmit: (item: Item) => void
  user: DemoUser
}) {
  const [kind, setKind] = useState<"Lost" | "Found">("Lost")
  const [rewardType, setRewardType] = useState<RewardType>("none")
  const [preview, setPreview] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSubmit({
      id: Date.now(),
      name: String(form.get("name")),
      category: String(form.get("category")),
      status: kind,
      date: "Just now",
      location: String(form.get("location")),
      description: String(form.get("description")),
      image: preview || (kind === "Lost" ? photos.books : photos.tech),
      reporter: user.name,
      reporterRole: user.accountType,
      ownerId: user.id,
      question: kind === "Found" ? String(form.get("question")) : undefined,
      answer:
        kind === "Found" ? String(form.get("answer")).toLowerCase() : undefined,
      rewardType: kind === "Lost" ? rewardType : undefined,
      rewardAmount:
        kind === "Lost" && rewardType === "money"
          ? String(form.get("rewardAmount"))
          : undefined,
      rewardDescription:
        kind === "Lost" && rewardType === "other"
          ? String(form.get("rewardDescription"))
          : undefined,
      mine: true,
    })
  }
  return (
    <div className="page-narrow">
      <PageTitle
        eyebrow="New campus report"
        title="What happened?"
        text="Share clear details to help the right person recognize and recover the item."
      />
      <form onSubmit={submit} className="form-card">
        <div className="report-choice">
          <button
            type="button"
            className={kind === "Lost" ? "active lost" : ""}
            onClick={() => setKind("Lost")}
          >
            <Search />
            <span>
              <b>I lost something</b>
              <small>Ask the community for help</small>
            </span>
            <CheckCircle2 />
          </button>
          <button
            type="button"
            className={kind === "Found" ? "active found" : ""}
            onClick={() => setKind("Found")}
          >
            <PackageCheck />
            <span>
              <b>I found something</b>
              <small>Help return it safely</small>
            </span>
            <CheckCircle2 />
          </button>
        </div>
        <div className="form-section">
          <h3>Item details</h3>
          <p>
            Give people enough information to identify the item, without
            revealing private proof.
          </p>
          <div className="form-grid">
            <Field
              label="Item name"
              name="name"
              placeholder="e.g. Black leather wallet"
            />
            <div>
              <label className="field-label" htmlFor="category">
                Category
              </label>
              <select id="category" name="category" className="select-field">
                <option>Electronics</option>
                <option>IDs and Cards</option>
                <option>Books and Notes</option>
                <option>Accessories</option>
                <option>Others</option>
              </select>
            </div>
            <Field
              label={`Date ${kind.toLowerCase()}`}
              name="date"
              type="date"
              placeholder=""
            />
            <Field
              label="Campus location"
              name="location"
              placeholder="Building, floor, or nearby landmark"
            />
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="description">
                Description and identifying marks
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="Describe color, condition, unique marks, and relevant context..."
              />
            </div>
          </div>
        </div>
        {kind === "Found" && (
          <div className="security-box">
            <div className="security-icon">
              <ShieldCheck />
            </div>
            <div className="flex-1">
              <h3>Private ownership verification</h3>
              <p>
                This answer is encrypted in a production system and is never
                shown publicly.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Security question"
                  name="question"
                  placeholder="What unique mark is on the item?"
                />
                <Field
                  label="Expected correct answer"
                  name="answer"
                  type="password"
                  placeholder="Private answer"
                />
              </div>
            </div>
          </div>
        )}
        {kind === "Lost" && (
          <div className="form-section reward-section">
            <h3>Offer a Reward (Optional)</h3>
            <p>
              Would you like to offer a reward to someone who finds your missing
              item? You may offer money or another item as a token of
              appreciation. This is completely optional.
            </p>
            <div className="mt-4">
              <label className="field-label" htmlFor="rewardType">
                Reward option
              </label>
              <select
                id="rewardType"
                name="rewardType"
                className="select-field"
                value={rewardType}
                onChange={(event) =>
                  setRewardType(event.target.value as RewardType)
                }
              >
                <option value="none">No Reward Offered</option>
                <option value="money">Money</option>
                <option value="other">Item / Other Reward</option>
              </select>
            </div>
            {rewardType === "money" && (
              <div className="mt-4">
                <label className="field-label" htmlFor="rewardAmount">
                  Reward amount
                </label>
                <div className="currency-field">
                  <span>₱</span>
                  <input
                    id="rewardAmount"
                    name="rewardAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
            )}
            {rewardType === "other" && (
              <div className="mt-4">
                <Field
                  label="Reward description"
                  name="rewardDescription"
                  placeholder="Describe the item or other reward"
                />
              </div>
            )}
          </div>
        )}
        <div className="form-section border-0">
          <h3>Item photo</h3>
          <p>A clear photo can make an item much easier to recognize.</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) setPreview(URL.createObjectURL(file))
            }}
          />
          <button
            type="button"
            className={`upload-area ${preview ? "has-preview" : ""}`}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Item preview" />
            ) : (
              <>
                <span>
                  <Camera size={24} />
                </span>
                <b>Upload a clear item photo</b>
                <small>PNG or JPG, up to 10MB</small>
              </>
            )}
          </button>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-tertiary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" type="submit">
            <Send size={16} /> Submit report
          </button>
        </div>
      </form>
    </div>
  )
}

function PageTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  )
}

function ItemModal({
  item,
  verificationAlreadySubmitted,
  onClose,
  onMessage,
  onClaim,
}: {
  item: Item
  verificationAlreadySubmitted: boolean
  onClose: () => void
  onMessage: () => void
  onClaim: (proof: string, explanation: string) => boolean
}) {
  const [claimStep, setClaimStep] = useState<"detail" | "verify" | "proof">(
    "detail",
  )
  const [answer, setAnswer] = useState("")
  const [proof, setProof] = useState("")
  const [proofError, setProofError] = useState("")
  const [explanation, setExplanation] = useState("")
  const [duplicateDialog, setDuplicateDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="item-modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <div className="modal-image">
          <img src={item.image} alt={item.name} />
          <StatusBadge status={item.status} />
        </div>
        <div className="modal-body">
          {claimStep === "detail" && (
            <>
              <p className="item-category">{item.category}</p>
              <h2>{item.name}</h2>
              <div className="modal-meta">
                <span>
                  <MapPin />
                  {item.location}
                </span>
                <span>
                  <Clock3 />
                  {item.date}
                </span>
              </div>
              <section className="item-description-block">
                <span>Full description & identifying details</span>
                <p>{item.description}</p>
              </section>
              {item.status === "Lost" && (
                <section
                  className={`reward-detail ${
                    item.rewardType && item.rewardType !== "none"
                      ? "offered"
                      : ""
                  }`}
                >
                  <span>
                    {item.rewardType && item.rewardType !== "none"
                      ? "Reward Offered"
                      : "No Reward Offered"}
                  </span>
                  <b>{rewardText(item)}</b>
                </section>
              )}
              <div className="reporter-box">
                <span className="avatar">
                  {item.reporter
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <div>
                  <small>Reported by</small>
                  <b>{item.reporter}</b>
                  <span>
                    <ShieldCheck size={13} /> {item.reporterRole} · Verified
                  </span>
                </div>
              </div>
              <div className="privacy-note">
                <LockKeyhole size={16} />
                <span>
                  Personal contact details stay private. Use ReClaim chat to
                  communicate safely.
                </span>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={onMessage}>
                  <MessageCircle size={16} /> Message reporter
                </button>
                {(item.status === "Found" ||
                  item.status === "Pending Claim") && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (verificationAlreadySubmitted) {
                        setDuplicateDialog(true)
                      } else {
                        setClaimStep("verify")
                      }
                    }}
                  >
                    <ShieldCheck size={16} /> Start ownership claim
                  </button>
                )}
              </div>
            </>
          )}
          {claimStep === "verify" && (
            <>
              <button
                className="back-link"
                onClick={() => setClaimStep("detail")}
              >
                <ChevronLeft size={16} /> Item details
              </button>
              <div className="step-icon">
                <ShieldCheck />
              </div>
              <p className="eyebrow">Step 1 of 2</p>
              <h2>Verify ownership</h2>
              <p className="modal-description">
                Answer the finder’s private question to continue. During
                prototype testing, any response is accepted and does not approve
                the claim automatically.
              </p>
              <div className="question-card">
                <HelpCircle size={18} />
                <div>
                  <small>Security question</small>
                  <b>{item.question}</b>
                </div>
              </div>
              <label className="field-label mt-5" htmlFor="claim-answer">
                Your answer
              </label>
              <input
                id="claim-answer"
                className="plain-input"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Enter your answer"
              />
              <button
                className="btn-primary mt-5 w-full"
                onClick={() => setClaimStep("proof")}
              >
                Verify and continue <ChevronRight size={16} />
              </button>
            </>
          )}
          {claimStep === "proof" && (
            <>
              <button
                className="back-link"
                onClick={() => setClaimStep("verify")}
              >
                <ChevronLeft size={16} /> Verification
              </button>
              <div className="step-icon">
                <FileCheck2 />
              </div>
              <p className="eyebrow">Step 2 of 2</p>
              <h2>Support your claim</h2>
              <p className="modal-description">
                Add an optional photo or explanation as private supporting
                evidence. Only you and the finder can see this.
              </p>
              <label className="proof-upload">
                <input
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg"
                  className="hidden"
                  onChange={async (event) => {
                    const input = event.currentTarget
                    const file = event.target.files?.[0]
                    if (!file) return
                    setProofError("")
                    const maxSize = 5 * 1024 * 1024 * 1024
                    if (file.size > maxSize) {
                      setProof("")
                      setProofError(
                        "The uploaded file exceeds the 5 GB limit. Please choose a smaller file.",
                      )
                      input.value = ""
                      return
                    }
                    const extensionIsValid = /\.(jpe?g)$/i.test(file.name)
                    const signature = new Uint8Array(
                      await file.slice(0, 3).arrayBuffer(),
                    )
                    const hasJpegSignature =
                      signature[0] === 0xff &&
                      signature[1] === 0xd8 &&
                      signature[2] === 0xff
                    if (
                      file.type !== "image/jpeg" ||
                      !extensionIsValid ||
                      !hasJpegSignature
                    ) {
                      setProof("")
                      setProofError(
                        "Invalid file format. Please upload a JPG or JPEG image only.",
                      )
                      input.value = ""
                      return
                    }
                    setProof(URL.createObjectURL(file))
                  }}
                />
                {proof ? (
                  <img src={proof} alt="Claim proof preview" />
                ) : (
                  <>
                    <Upload size={21} />
                    <span>
                      <b>Upload private proof photo</b>
                      <small>Choose a JPG or JPEG file</small>
                    </span>
                  </>
                )}
              </label>
              <p className="proof-helper">
                Upload a photo of yourself with the item as additional proof of
                ownership. Accepted formats: JPG and JPEG. Maximum file size: 5
                GB.
              </p>
              {proofError && (
                <div className="form-error mt-3">
                  <XCircle size={16} />
                  {proofError}
                </div>
              )}
              <label className="field-label mt-5" htmlFor="explanation">
                Additional explanation (optional)
              </label>
              <textarea
                id="explanation"
                rows={3}
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Share any serial number, memory, or detail that could help..."
              />
              <button
                className="btn-primary mt-5 w-full"
                disabled={submitting}
                onClick={() => {
                  if (submitting) return
                  setSubmitting(true)
                  const accepted = onClaim(proof, explanation)
                  if (!accepted) {
                    setSubmitting(false)
                    setClaimStep("detail")
                    setDuplicateDialog(true)
                  }
                }}
              >
                Submit claim request <Send size={16} />
              </button>
            </>
          )}
        </div>
        {duplicateDialog && (
          <div className="verification-dialog-layer">
            <div
              className="verification-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="verification-dialog-title"
            >
              <div className="verification-dialog-icon">
                <ShieldCheck size={22} />
              </div>
              <h3 id="verification-dialog-title">
                Verification Already Submitted
              </h3>
              <p>
                You have already submitted your verification answers for this
                item. You are only allowed to answer the verification questions
                once per Found item. Please wait for the finder to review your
                claim request and respond.
              </p>
              <button
                className="btn-primary"
                onClick={() => {
                  setDuplicateDialog(false)
                  setClaimStep("detail")
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Activity({
  items,
  claims,
  currentUserId,
  onSelect,
  onUpdateClaim,
  onReturned,
}: {
  items: Item[]
  claims: Claim[]
  currentUserId: string
  onSelect: (item: Item) => void
  onUpdateClaim: (id: number, status: ClaimStatus) => void
  onReturned: (id: number) => void
}) {
  const [tab, setTab] = useState<"reported" | "claims" | "found">("reported")
  const myItems = items.filter((item) => item.mine)
  const myClaims = claims.filter((claim) => claim.claimantId === currentUserId)
  const incoming = claims.filter(
    (claim) =>
      items.find((item) => item.id === claim.itemId)?.mine &&
      claim.claimantId !== currentUserId,
  )
  return (
    <>
      <PageTitle
        eyebrow="Your activity"
        title="Reports and claims"
        text="Track every report, review incoming claims, and follow each recovery through return."
      />
      <div className="tabs">
        <button
          className={tab === "reported" ? "active" : ""}
          onClick={() => setTab("reported")}
        >
          Items reported <span>{myItems.length}</span>
        </button>
        <button
          className={tab === "claims" ? "active" : ""}
          onClick={() => setTab("claims")}
        >
          My claims <span>{myClaims.length}</span>
        </button>
        <button
          className={tab === "found" ? "active" : ""}
          onClick={() => setTab("found")}
        >
          Items I found <span>{incoming.length}</span>
        </button>
      </div>
      {tab === "reported" && (
        <div className="list-card">
          {myItems.map((item) => (
            <ActivityRow
              key={item.id}
              item={item}
              onSelect={onSelect}
              extra={
                item.status === "Claimed" ? (
                  <button
                    className="btn-small"
                    onClick={(event) => {
                      event.stopPropagation()
                      onReturned(item.id)
                    }}
                  >
                    Mark as returned
                  </button>
                ) : (
                  <button className="icon-button">
                    <Pencil size={16} />
                  </button>
                )
              }
            />
          ))}
        </div>
      )}
      {tab === "claims" && (
        <div className="list-card">
          {myClaims.map((claim) => {
            const item = items.find((entry) => entry.id === claim.itemId)!
            return (
              <ActivityRow
                key={claim.id}
                item={item}
                onSelect={onSelect}
                extra={
                  <div className="text-right">
                    <StatusBadge status={claim.status} />
                    <small className="mt-2 block text-muted">
                      {claim.requested}
                    </small>
                  </div>
                }
              />
            )
          })}
        </div>
      )}
      {tab === "found" && (
        <div className="space-y-4">
          {incoming.map((claim) => {
            const item = items.find((entry) => entry.id === claim.itemId)!
            return (
              <article key={claim.id} className="claim-review">
                <div className="claim-header">
                  <img src={item.image} alt="" />
                  <div>
                    <p className="item-category">{item.name}</p>
                    <h3>{claim.claimant}</h3>
                    <span>
                      {claim.accountType} · Requested {claim.requested}
                    </span>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
                <div className="claim-details">
                  <div>
                    <small>Ownership answer</small>
                    <b>
                      <CheckCircle2 size={15} /> Verified successfully
                    </b>
                  </div>
                  <div>
                    <small>Additional explanation</small>
                    <p>{claim.explanation}</p>
                  </div>
                </div>
                {claim.status === "Pending" && (
                  <div className="claim-actions">
                    <button
                      className="btn-reject"
                      onClick={() => onUpdateClaim(claim.id, "Rejected")}
                    >
                      <XCircle size={16} /> Reject claim
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => onUpdateClaim(claim.id, "Approved")}
                    >
                      <CheckCircle2 size={16} /> Approve claim
                    </button>
                  </div>
                )}
                {claim.status === "Approved" && item.status !== "Returned" && (
                  <div className="claim-actions">
                    <button
                      className="btn-primary"
                      onClick={() => onReturned(item.id)}
                    >
                      <PackageCheck size={16} /> Mark as returned
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}

function ActivityRow({
  item,
  onSelect,
  extra,
}: {
  item: Item
  onSelect: (item: Item) => void
  extra: React.ReactNode
}) {
  return (
    <button className="activity-row" onClick={() => onSelect(item)}>
      <img src={item.image} alt="" />
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <h3>{item.name}</h3>
          <StatusBadge status={item.status} />
        </div>
        <p>
          <MapPin size={13} />
          {item.location}
          <span>·</span>
          {item.date}
        </p>
        {item.status === "Lost" && (
          <small className="activity-reward">
            <WalletCards size={12} />
            {item.rewardType && item.rewardType !== "none"
              ? `Reward: ${rewardText(item)}`
              : "No Reward"}
          </small>
        )}
      </div>
      {extra}
    </button>
  )
}

function Chat({
  conversations,
  items,
  currentUser,
  setConversations,
}: {
  conversations: Conversation[]
  items: Item[]
  currentUser: DemoUser
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
}) {
  const [selected, setSelected] = useState(conversations[0]?.id)
  const [message, setMessage] = useState("")
  const [search, setSearch] = useState("")
  const conversation =
    conversations.find((entry) => entry.id === selected) || conversations[0]
  const item = items.find((entry) => entry.id === conversation?.itemId)
  const conversationName =
    currentUser.id === "finder" ? conversation?.user : item?.reporter
  function send() {
    if (!message.trim() || !conversation) return
    setConversations((all) =>
      all.map((entry) =>
        entry.id === conversation.id
          ? {
              ...entry,
              messages: [
                ...entry.messages,
                {
                  id: Date.now(),
                  mine: true,
                  text: message.trim(),
                  time: "Now",
                },
              ],
            }
          : entry,
      ),
    )
    setMessage("")
  }
  return (
    <>
      <PageTitle
        eyebrow="Secure messaging"
        title="Chat inbox"
        text="Every conversation stays connected to a specific report or claim."
      />
      <div className="chat-shell">
        <aside
          className={`conversation-list ${conversation ? "has-selection" : ""}`}
        >
          <div className="conversation-head">
            <h3>Messages</h3>
            <button className="icon-button">
              <Pencil size={16} />
            </button>
          </div>
          <div className="conversation-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
            />
          </div>
          <div className="conversation-scroll">
            {conversations
              .filter((entry) => {
                const relatedItem = items.find(
                  (candidate) => candidate.id === entry.itemId,
                )
                const displayName =
                  currentUser.id === "finder"
                    ? entry.user
                    : relatedItem?.reporter
                return displayName?.toLowerCase().includes(search.toLowerCase())
              })
              .map((entry) => {
                const related = items.find(
                  (candidate) => candidate.id === entry.itemId,
                )
                const displayName =
                  currentUser.id === "finder" ? entry.user : related?.reporter
                const displayAvatar = displayName
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")
                const last = entry.messages[entry.messages.length - 1]
                return (
                  <button
                    key={entry.id}
                    className={`conversation ${
                      selected === entry.id ? "active" : ""
                    }`}
                    onClick={() => {
                      setSelected(entry.id)
                      setConversations((all) =>
                        all.map((item) =>
                          item.id === entry.id ? { ...item, unread: 0 } : item,
                        ),
                      )
                    }}
                  >
                    <span className="avatar">{displayAvatar}</span>
                    <span className="conversation-copy">
                      <span>
                        <b>{displayName}</b>
                        <small>{last.time}</small>
                      </span>
                      <em>{related?.name}</em>
                      <p>{last.text}</p>
                    </span>
                    {entry.unread > 0 && <i>{entry.unread}</i>}
                  </button>
                )
              })}
          </div>
        </aside>
        {conversation && item && (
          <section className="message-pane">
            <header className="message-head">
              <span className="avatar">
                {conversationName
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <b>{conversationName}</b>
                <small>Active now</small>
              </div>
              <button className="related-item">
                <img src={item.image} alt="" />
                <span>
                  <small>Related item</small>
                  <b>{item.name}</b>
                </span>
                <ChevronRight size={16} />
              </button>
            </header>
            <div className="secure-strip">
              <LockKeyhole size={14} /> Messages are private to claim
              participants
            </div>
            <div className="messages">
              <div className="message-date">Today</div>
              {conversation.messages.map((entry) => (
                <div
                  key={entry.id}
                  className={`message-wrap ${entry.mine ? "mine" : ""}`}
                >
                  <div className="message">{entry.text}</div>
                  <span>{entry.time}</span>
                </div>
              ))}
            </div>
            <div className="message-compose">
              <button className="icon-button">
                <Plus size={18} />
              </button>
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") send()
                }}
                placeholder="Write a message..."
              />
              <button
                className="send-button"
                onClick={send}
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function Notifications({
  notifications,
  setNotifications,
  goTo,
}: {
  notifications: typeof initialNotifications
  setNotifications: React.Dispatch<React.SetStateAction<typeof initialNotifications>>
  goTo: (page: Page) => void
}) {
  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <PageTitle
          eyebrow="Stay up to date"
          title="Notifications"
          text="Claim updates, new messages, and return milestones in one place."
        />
        <button
          className="text-button mb-7 whitespace-nowrap"
          onClick={() =>
            setNotifications((all) =>
              all.map((entry) => ({ ...entry, unread: false })),
            )
          }
        >
          <Check size={15} /> Mark all as read
        </button>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => {
          const Icon =
            notification.type === "message"
              ? MessageCircle
              : notification.type === "claim"
                ? FileCheck2
                : notification.type === "return"
                  ? PackageCheck
                  : CheckCircle2
          return (
            <button
              key={notification.id}
              className={`notification ${notification.unread ? "unread" : ""}`}
              onClick={() => {
                setNotifications((all) =>
                  all.map((entry) =>
                    entry.id === notification.id
                      ? { ...entry, unread: false }
                      : entry,
                  ),
                )
                goTo(notification.target)
              }}
            >
              <span className="notification-icon">
                <Icon size={19} />
              </span>
              <span className="flex-1 text-left">
                <span>
                  <b>{notification.title}</b>
                  <small>{notification.time}</small>
                </span>
                <p>{notification.text}</p>
              </span>
              {notification.unread && <i />}
            </button>
          )
        })}
      </div>
    </>
  )
}

function Profile({
  user,
  notify,
  onLogout,
}: {
  user: DemoUser
  notify: (message: string) => void
  onLogout: () => void
}) {
  const [editing, setEditing] = useState(false)
  return (
    <>
      <PageTitle
        eyebrow="Account management"
        title="Profile & settings"
        text="Review your verified identity and manage the details other users can see."
      />
      <div className="profile-grid">
        <aside className="profile-card">
          <div className="profile-photo">
            {user.initials}
            <button>
              <Camera size={15} />
            </button>
          </div>
          <h2>{user.name}</h2>
          <p>{user.course || user.school || user.role}</p>
          <span className="verified-chip">
            <ShieldCheck size={14} /> Verified {user.accountType}
          </span>
          <div className="profile-stats">
            <div>
              <b>4</b>
              <span>Reports</span>
            </div>
            <div>
              <b>2</b>
              <span>Returns</span>
            </div>
          </div>
          <button className="btn-tertiary w-full mt-6" onClick={onLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </aside>
        <section className="settings-card">
          <div className="settings-head">
            <div>
              <h3>Personal information</h3>
              <p>Your verified university details are protected.</p>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                if (editing) notify("Profile changes saved.")
                setEditing((value) => !value)
              }}
            >
              {editing ? (
                <>
                  <Check size={16} /> Save changes
                </>
              ) : (
                <>
                  <Pencil size={16} /> Edit profile
                </>
              )}
            </button>
          </div>
          <div className="settings-fields">
            <ProfileField
              label="Full name"
              value={user.name}
              editable={editing}
            />
            <ProfileField
              label={
                user.accountType === "External User"
                  ? "Verified email"
                  : "Official email"
              }
              value={user.email}
            />
            <ProfileField
              label={user.staffId ? "Staff ID" : "Student number"}
              value={user.staffId || user.studentNumber || "Not applicable"}
            />
            <ProfileField
              label="Year level"
              value={user.yearLevel || "Not applicable"}
              editable={editing}
            />
            <ProfileField
              label="Course / Program"
              value={user.course || user.school || "Not applicable"}
              editable={editing}
            />
            <ProfileField
              label="College"
              value={user.college || user.school || "Not applicable"}
            />
            <ProfileField
              label="Contact number"
              value={user.phone || "Not provided"}
              editable={editing}
            />
            <ProfileField label="Account type" value={user.accountType} />
          </div>
          <div className="settings-divider" />
          <div className="settings-head">
            <div>
              <h3>Password & security</h3>
              <p>Use a strong, unique password to protect your claims.</p>
            </div>
            <button
              className="btn-tertiary"
              onClick={() =>
                notify("Password change link prepared for this demo.")
              }
            >
              <KeyRound size={16} /> Change password
            </button>
          </div>
          <div className="security-status">
            <ShieldCheck size={20} />
            <div>
              <b>Email verification active</b>
              <p>Your official PLM email was verified on May 3, 2025.</p>
            </div>
            <CheckCircle2 size={18} />
          </div>
        </section>
      </div>
    </>
  )
}

function ProfileField({
  label,
  value,
  editable = false,
}: {
  label: string
  value: string
  editable?: boolean
}) {
  return (
    <div>
      <label>
        {label}
        {!editable && <LockKeyhole size={11} />}
      </label>
      <input defaultValue={value} disabled={!editable} />
    </div>
  )
}
