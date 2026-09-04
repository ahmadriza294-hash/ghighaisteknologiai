import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import logoAsset from "@/assets/ghighais-logo.png.asset.json";

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
  trustedTitle: string;
  clients: ClientLogo[];
  footerNote: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  logo: logoAsset.url,
  heroLogo: logoAsset.url,
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
  appStoreUrl: "https://apps.apple.com",
  playStoreUrl: "https://play.google.com",
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
  trustedTitle: "Dipercaya oleh mitra & klien kami",
  clients: [],
  footerNote: "© 2022–2026 Ghighais Teknologi. Seluruh hak cipta dilindungi.",
};

const CONTENT_KEY = "ghighais.content.v1";
const PASS_KEY = "ghighais.pass.v1";
export const ADMIN_USERNAME = "ghighais";
export const DEFAULT_PASSWORD = "gh1gh415";

type Ctx = {
  content: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  reset: () => void;
  isAdmin: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  changePassword: (current: string, next: string) => boolean;
};

const SiteContext = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (raw) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: SiteContent) => {
    setContent(next);
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const update = useCallback<Ctx["update"]>(
    (key, value) => {
      setContent((prev) => {
        const next = { ...prev, [key]: value };
        try {
          localStorage.setItem(CONTENT_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      content,
      update,
      reset: () => persist(DEFAULT_CONTENT),
      isAdmin,
      login: (u, p) => {
        const stored =
          (typeof localStorage !== "undefined" &&
            localStorage.getItem(PASS_KEY)) ||
          DEFAULT_PASSWORD;
        const ok = u.trim() === ADMIN_USERNAME && p === stored;
        if (ok) setIsAdmin(true);
        return ok;
      },
      logout: () => setIsAdmin(false),
      changePassword: (current, next) => {
        const stored = localStorage.getItem(PASS_KEY) || DEFAULT_PASSWORD;
        if (current !== stored || next.length < 6) return false;
        localStorage.setItem(PASS_KEY, next);
        return true;
      },
    }),
    [content, update, persist, isAdmin],
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
