import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Context,
} from "react";
/** Static images live in /public and are referenced by absolute, lowercase paths. */
export const LOGO_SRC = "/ghighais-logo.png";
export const PAMFLET_PLACEHOLDER = "/placeholder-pamflet.png";

export type ClientLogo = { id: string; src: string; name: string };

export type AppItem = {
  id: string;
  name: string;
  icon: string;
  url: string;
  platform: string;
};

export type SiteContent = {
  logo: string;
  heroLogo: string;
  navLinks: { label: string; href: string }[];
  ctaNav: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  appsTitle: string;
  apps: AppItem[];
  aboutTitle: string;
  aboutBody: string;
  aboutStats: { value: string; label: string }[];
  featuresTitle: string;
  featuresSubtitle: string;
  features: { title: string; body: string }[];
  contactTitle: string;
  contactBody: string;
  contactEmail: string;
  contactPhone: string;
  contactLocation: string;
  trustedTitle: string;
  clients: ClientLogo[];
  footerNote: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  logo: LOGO_SRC,
  heroLogo: LOGO_SRC,
  navLinks: [
    { label: "Solusi", href: "#solusi" },
    { label: "Fitur", href: "#fitur" },
    { label: "Ekosistem", href: "#ekosistem" },
    { label: "Tentang Kami", href: "#tentang" },
    { label: "Kontak", href: "#kontak" },
  ],
  ctaNav: "Minta Demo",
  heroBadge: "🚀 Solusi Teknologi Generasi Terbaru • Est. 2022",
  heroTitle:
    "Memberdayakan Pendidikan, UMKM, & Korporasi dengan Teknologi Tanpa Batas",
  heroSubtitle:
    "Ghighais Teknologi membangun aplikasi yang mudah digunakan siapa saja, dengan pengelolaan data yang rapi, aman, dan siap tumbuh bersama organisasi Anda.",
  heroPrimaryCta: "Mulai Konsultasi Gratis",
  heroSecondaryCta: "Lihat Ekosistem Produk",
  appsTitle: "Unduh aplikasi kami",
  apps: [
    {
      id: "app-ios",
      name: "Ghighais Suite",
      platform: "App Store",
      icon: LOGO_SRC,
      url: "https://apps.apple.com",
    },
    {
      id: "app-android",
      name: "Ghighais Suite",
      platform: "Google Play",
      icon: LOGO_SRC,
      url: "https://play.google.com",
    },
  ],
  aboutTitle: "Dibangun sejak 2022 untuk semua skala organisasi",
  aboutBody:
    "Ghighais Teknologi adalah badan usaha pengembang aplikasi yang berdiri sejak 2022. Kami melayani kebutuhan personal, UMKM, institusi pendidikan, hingga korporasi — mulai dari sistem informasi akademik, aplikasi operasional bisnis, sampai platform data terintegrasi. Fokus kami sederhana: teknologi yang mudah dipakai dan data yang mudah dikelola.",
  aboutStats: [
    { value: "2022", label: "Tahun berdiri" },
    { value: "4", label: "Segmen layanan" },
    { value: "99.9%", label: "Ketersediaan sistem" },
    { value: "24/7", label: "Dukungan teknis" },
  ],
  featuresTitle: "Satu ekosistem, banyak kemungkinan",
  featuresSubtitle:
    "Setiap produk kami dirancang dengan tiga prinsip utama yang tidak bisa ditawar.",
  features: [
    {
      title: "Fokus Pendidikan & Korporasi",
      body: "Modul akademik, kepegawaian, dan operasional yang dirancang mengikuti alur kerja nyata institusi pendidikan maupun perusahaan.",
    },
    {
      title: "Keamanan Data",
      body: "Enkripsi menyeluruh, kontrol akses berbasis peran, pencadangan otomatis, dan jejak audit untuk setiap perubahan data penting.",
    },
    {
      title: "Kemudahan Penggunaan",
      body: "Antarmuka bersih dan intuitif sehingga tim Anda bisa langsung produktif tanpa pelatihan panjang atau manual tebal.",
    },
  ],
  contactTitle: "Mari bicarakan kebutuhan Anda",
  contactBody:
    "Ceritakan tantangan digital organisasi Anda. Tim kami akan merespons dalam 1x24 jam kerja.",
  contactEmail: "ghighais@proton.me",
  contactPhone: "0816988848",
  contactLocation: "Jakarta, Indonesia",
  trustedTitle: "Dipercaya oleh mitra & klien kami",
  clients: [],
  footerNote: "© 2022–2026 Ghighais Teknologi. Seluruh hak cipta dilindungi.",
};

const CONTENT_KEY = "ghighais.content.v1";
export const ADMIN_USERNAME = "ghighais";
export const DEFAULT_PASSWORD = "gh1gh415";

type Ctx = {
  content: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  reset: () => void;
  save: () => Promise<boolean>;
  isAdmin: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (current: string, next: string) => Promise<boolean>;
};

// Keep one context instance even if this module is evaluated twice
// (route code-splitting / HMR would otherwise create a second context).
const globalStore = globalThis as unknown as {
  __ghighaisSiteContext?: Context<Ctx | null>;
};
const SiteContext: Context<Ctx | null> =
  globalStore.__ghighaisSiteContext ??
  (globalStore.__ghighaisSiteContext = createContext<Ctx | null>(null));

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");

  // Load the shared content from the central store (same on every domain).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchSiteContent } = await import("./site-content.functions");
        const res = await fetchSiteContent();
        if (cancelled) return;
        if (res?.json) {
          const remote = JSON.parse(res.json) as Partial<SiteContent>;
          if (remote && Object.keys(remote).length > 0) {
            setContent({ ...DEFAULT_CONTENT, ...remote });
            try {
              localStorage.setItem(CONTENT_KEY, res.json);
            } catch {
              /* ignore */
            }
            return;
          }
        }
        // Nothing saved centrally yet — fall back to this device's copy.
        const raw = localStorage.getItem(CONTENT_KEY);
        if (raw) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(raw) });
      } catch {
        try {
          const raw = localStorage.getItem(CONTENT_KEY);
          if (raw) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(raw) });
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback<Ctx["update"]>((key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      content,
      update,
      reset: () => setContent(DEFAULT_CONTENT),
      save: async () => {
        try {
          const { persistSiteContent } = await import("./site-content.functions");
          const json = JSON.stringify(content);
          const res = await persistSiteContent({
            data: { password: adminPass, content: json },
          });
          if (!res.ok) return false;
          try {
            localStorage.setItem(CONTENT_KEY, json);
          } catch {
            /* ignore */
          }
          return true;
        } catch {
          return false;
        }
      },
      isAdmin,
      login: async (u, p) => {
        try {
          const { verifyAdmin } = await import("./site-content.functions");
          const res = await verifyAdmin({ data: { username: u, password: p } });
          if (res.ok) {
            setAdminPass(p);
            setIsAdmin(true);
          }
          return res.ok;
        } catch {
          return false;
        }
      },
      logout: () => {
        setIsAdmin(false);
        setAdminPass("");
      },
      changePassword: async (current, next) => {
        try {
          const { updateAdminPassword } = await import("./site-content.functions");
          const res = await updateAdminPassword({ data: { current, next } });
          if (res.ok) setAdminPass(next);
          return res.ok;
        } catch {
          return false;
        }
      },
    }),
    [content, update, isAdmin, adminPass],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}


export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
