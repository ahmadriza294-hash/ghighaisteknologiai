import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  Download,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  SiteProvider,
  useSite,
  readImageFile,
  type AppItem,
} from "@/lib/site-content";
import { Editable, EditableImage } from "@/components/site/Editable";
import { AdminLoginDialog, AdminToolbar } from "@/components/site/AdminBits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ghighais Teknologi — Pengembang Aplikasi Sejak 2022" },
      {
        name: "description",
        content:
          "Ghighais Teknologi membangun aplikasi untuk personal, UMKM, institusi pendidikan, dan korporasi. Mudah digunakan, aman, dan siap tumbuh.",
      },
      { property: "og:title", content: "Ghighais Teknologi — Solusi Aplikasi Tanpa Batas" },
      {
        property: "og:description",
        content:
          "Solusi teknologi untuk pendidikan, UMKM, dan korporasi dengan fokus kemudahan penggunaan dan pengelolaan data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteProvider>
      <LandingPage />
    </SiteProvider>
  ),
});

function Navbar({ onSecretTrigger }: { onSecretTrigger: () => void }) {
  const { content, update, isAdmin } = useSite();
  const clicks = useRef<{ count: number; timer: number | null }>({
    count: 0,
    timer: null,
  });

  const handleLogoClick = () => {
    if (isAdmin) return;
    clicks.current.count += 1;
    if (clicks.current.timer) window.clearTimeout(clicks.current.timer);
    clicks.current.timer = window.setTimeout(() => {
      clicks.current.count = 0;
    }, 900);
    if (clicks.current.count >= 3) {
      clicks.current.count = 0;
      onSecretTrigger();
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl glass px-4 py-3">
        <div onClick={handleLogoClick} className="cursor-pointer select-none">
          <EditableImage
            src={content.logo}
            alt="Logo Ghighais Teknologi"
            onChange={(v) => update("logo", v)}
            imgClassName="h-9 w-auto rounded-lg object-contain"
          />
        </div>
        <ul className="hidden items-center gap-7 lg:flex">
          {content.navLinks.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Editable
                  value={l.label}
                  onChange={(v) => {
                    const next = [...content.navLinks];
                    next[i] = { ...next[i]!, label: v };
                    update("navLinks", next);
                  }}
                />
              </a>
            </li>
          ))}
        </ul>
        <Button asChild size="sm" className="rounded-full bg-brand-gradient text-primary-foreground">
          <a href="#kontak">
            <Editable value={content.ctaNav} onChange={(v) => update("ctaNav", v)} />
          </a>
        </Button>
      </nav>
    </header>
  );
}

function AppCard({
  app,
  onChange,
  onRemove,
}: {
  app: AppItem;
  onChange: (next: AppItem) => void;
  onRemove: () => void;
}) {
  const { isAdmin } = useSite();
  return (
    <div className="group relative flex items-center gap-3 rounded-2xl glass px-4 py-3 transition hover:glow-ring">
      <EditableImage
        src={app.icon}
        alt={`Ikon aplikasi ${app.name}`}
        onChange={(v) => onChange({ ...app, icon: v })}
        imgClassName="size-12 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <Editable
          as="p"
          value={app.platform}
          onChange={(v) => onChange({ ...app, platform: v })}
          className="block text-[11px] tracking-wide text-muted-foreground uppercase"
        />
        <Editable
          as="p"
          value={app.name}
          onChange={(v) => onChange({ ...app, name: v })}
          className="block truncate text-sm font-semibold text-foreground"
        />
        {isAdmin ? (
          <button
            type="button"
            onClick={() => {
              const next = window.prompt(`URL unduhan ${app.name}`, app.url);
              if (next !== null) onChange({ ...app, url: next.trim() });
            }}
            className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-accent"
          >
            <Wand2 className="size-3" /> Ubah link
          </button>
        ) : (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-accent transition hover:underline"
          >
            <Download className="size-3" /> Unduh
          </a>
        )}
      </div>
      {!isAdmin && (
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Unduh ${app.name} di ${app.platform}`}
          className="absolute inset-0 rounded-2xl"
        />
      )}
      {isAdmin && (
        <button
          type="button"
          aria-label="Hapus aplikasi"
          onClick={onRemove}
          className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function LandingPage() {
  const { content, update, isAdmin } = useSite();
  const [loginOpen, setLoginOpen] = useState(false);
  const clientInput = useRef<HTMLInputElement>(null);

  return (
    <div className="aurora min-h-screen overflow-x-hidden bg-background">
      <Navbar onSecretTrigger={() => setLoginOpen(true)} />
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      <AdminToolbar />

      {/* HERO */}
      <section id="solusi" className="relative mx-auto max-w-6xl px-4 pt-36 pb-20 sm:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-accent">
            <Sparkles className="size-3.5" />
            <Editable value={content.heroBadge} onChange={(v) => update("heroBadge", v)} />
          </div>
          <Editable
            as="h1"
            multiline
            value={content.heroTitle}
            onChange={(v) => update("heroTitle", v)}
            className="mt-7 block text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-6xl text-gradient"
          />
          <Editable
            as="p"
            multiline
            value={content.heroSubtitle}
            onChange={(v) => update("heroSubtitle", v)}
            className="mx-auto mt-6 block max-w-2xl text-base text-muted-foreground sm:text-lg"
          />
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-brand-gradient text-primary-foreground glow-ring">
              <a href="#kontak">
                <Editable value={content.heroPrimaryCta} onChange={(v) => update("heroPrimaryCta", v)} />
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-transparent">
              <a href="#fitur">
                <Editable value={content.heroSecondaryCta} onChange={(v) => update("heroSecondaryCta", v)} />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-16 rounded-3xl glass p-6 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <EditableImage
              src={content.heroLogo}
              alt="Pratinjau aplikasi Ghighais"
              onChange={(v) => update("heroLogo", v)}
              className="mx-auto lg:mx-0"
              imgClassName="h-28 w-auto rounded-2xl object-contain sm:h-36"
            />
            <div className="flex-1">
              <Editable
                as="p"
                value={content.appsTitle}
                onChange={(v) => update("appsTitle", v)}
                className="block text-center text-xs tracking-widest text-muted-foreground uppercase lg:text-left"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {content.apps.map((app, i) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onChange={(next) => {
                      const list = [...content.apps];
                      list[i] = next;
                      update("apps", list);
                    }}
                    onRemove={() =>
                      update(
                        "apps",
                        content.apps.filter((x) => x.id !== app.id),
                      )
                    }
                  />
                ))}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      update("apps", [
                        ...content.apps,
                        {
                          id: `app-${Date.now()}`,
                          name: "Aplikasi Baru",
                          platform: "Google Play",
                          icon: content.logo,
                          url: "https://play.google.com",
                        },
                      ])
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 py-5 text-xs text-accent transition hover:glow-ring"
                  >
                    <Plus className="size-4" /> Tambah Aplikasi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Tentang Kami</p>
            <Editable
              as="h2"
              multiline
              value={content.aboutTitle}
              onChange={(v) => update("aboutTitle", v)}
              className="mt-4 block text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            />
            <Editable
              as="p"
              multiline
              value={content.aboutBody}
              onChange={(v) => update("aboutBody", v)}
              className="mt-5 block leading-relaxed text-muted-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {content.aboutStats.map((s, i) => (
              <div key={i} className="rounded-2xl glass p-6">
                <Editable
                  as="div"
                  value={s.value}
                  onChange={(v) => {
                    const next = [...content.aboutStats];
                    next[i] = { ...next[i]!, value: v };
                    update("aboutStats", next);
                  }}
                  className="text-3xl font-bold text-gradient"
                />
                <Editable
                  as="div"
                  value={s.label}
                  onChange={(v) => {
                    const next = [...content.aboutStats];
                    next[i] = { ...next[i]!, label: v };
                    update("aboutStats", next);
                  }}
                  className="mt-1 text-sm text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Editable
            as="h2"
            value={content.featuresTitle}
            onChange={(v) => update("featuresTitle", v)}
            className="block text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <Editable
            as="p"
            multiline
            value={content.featuresSubtitle}
            onChange={(v) => update("featuresSubtitle", v)}
            className="mt-4 block text-muted-foreground"
          />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {content.features.map((f, i) => {
            const Icon = [GraduationCap, Lock, Sparkles][i % 3]!;
            return (
              <article
                key={i}
                className="group rounded-3xl glass p-7 transition duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <Editable
                  as="h3"
                  value={f.title}
                  onChange={(v) => {
                    const next = [...content.features];
                    next[i] = { ...next[i]!, title: v };
                    update("features", next);
                  }}
                  className="mt-5 block text-lg font-semibold"
                />
                <Editable
                  as="p"
                  multiline
                  value={f.body}
                  onChange={(v) => {
                    const next = [...content.features];
                    next[i] = { ...next[i]!, body: v };
                    update("features", next);
                  }}
                  className="mt-3 block text-sm leading-relaxed text-muted-foreground"
                />
              </article>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontak" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 rounded-3xl glass p-8 lg:grid-cols-2 sm:p-12">
          <div>
            <Editable
              as="h2"
              value={content.contactTitle}
              onChange={(v) => update("contactTitle", v)}
              className="block text-3xl font-bold tracking-tight sm:text-4xl"
            />
            <Editable
              as="p"
              multiline
              value={content.contactBody}
              onChange={(v) => update("contactBody", v)}
              className="mt-4 block text-muted-foreground"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${content.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-accent"
              >
                <Mail className="size-4" />
                <Editable
                  value={content.contactEmail}
                  onChange={(v) => update("contactEmail", v)}
                />
              </a>
              <a
                href={`tel:${content.contactPhone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-accent"
              >
                <Phone className="size-4" />
                <Editable
                  value={content.contactPhone}
                  onChange={(v) => update("contactPhone", v)}
                />
              </a>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" />
                <Editable
                  value={content.contactLocation}
                  onChange={(v) => update("contactLocation", v)}
                />
              </span>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const name = String(form.get("name") ?? "").trim();
              const email = String(form.get("email") ?? "").trim();
              const message = String(form.get("message") ?? "").trim();
              if (!name || name.length > 100) {
                toast.error("Nama wajib diisi (maks 100 karakter)");
                return;
              }
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 255) {
                toast.error("Email tidak valid");
                return;
              }
              if (!message || message.length > 1000) {
                toast.error("Pesan wajib diisi (maks 1000 karakter)");
                return;
              }
              window.location.href = `mailto:${content.contactEmail}?subject=${encodeURIComponent(
                `Pesan dari ${name}`,
              )}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
              toast.success("Membuka aplikasi email Anda…");
              e.currentTarget.reset();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" name="name" maxLength={100} placeholder="Nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" maxLength={255} placeholder="anda@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Pesan</Label>
              <Textarea id="message" name="message" rows={5} maxLength={1000} placeholder="Ceritakan kebutuhan Anda…" />
            </div>
            <Button type="submit" className="w-full rounded-full bg-brand-gradient text-primary-foreground">
              Kirim Pesan
            </Button>
          </form>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section id="ekosistem" className="mx-auto max-w-6xl px-4 py-20">
        <Editable
          as="h2"
          value={content.trustedTitle}
          onChange={(v) => update("trustedTitle", v)}
          className="block text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase"
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {content.clients.map((c) => (
            <div key={c.id} className="relative flex h-24 items-center justify-center rounded-2xl glass p-4">
              <img src={c.src} alt={c.name} className="max-h-14 w-auto object-contain" />
              {isAdmin && (
                <button
                  type="button"
                  aria-label="Hapus logo klien"
                  onClick={() =>
                    update(
                      "clients",
                      content.clients.filter((x) => x.id !== c.id),
                    )
                  }
                  className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          ))}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => clientInput.current?.click()}
                className="flex h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border text-xs text-accent transition hover:glow-ring"
              >
                <Plus className="size-5" />
                Tambah Logo Klien
              </button>
              <input
                ref={clientInput}
                type="file"
                accept="image/*"
                hidden
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  const added = await Promise.all(
                    files.map(async (f) => ({
                      id: `${Date.now()}-${f.name}`,
                      name: f.name.replace(/\.[^.]+$/, ""),
                      src: await readImageFile(f),
                    })),
                  );
                  update("clients", [...content.clients, ...added]);
                  e.target.value = "";
                }}
              />
            </>
          )}
          {!isAdmin && content.clients.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground">
              Segera hadir — mitra kami akan tampil di sini.
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between">
          <img src={content.logo} alt="Ghighais Teknologi" className="h-8 w-auto object-contain" />
          <Editable
            as="p"
            value={content.footerNote}
            onChange={(v) => update("footerNote", v)}
            className="text-xs text-muted-foreground"
          />
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
            <a href={`mailto:${content.contactEmail}`} className="transition hover:text-accent">
              {content.contactEmail}
            </a>
            <a
              href={`tel:${content.contactPhone.replace(/\s/g, "")}`}
              className="transition hover:text-accent"
            >
              {content.contactPhone}
            </a>
            <span>{content.contactLocation}</span>
            <a href="#tentang" className="transition hover:text-accent">
              Kebijakan Privasi
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
