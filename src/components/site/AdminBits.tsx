import { useState } from "react";
import { useSite } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, LogOut, ShieldCheck } from "lucide-react";

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete = "current-password",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition hover:text-accent"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function AdminLoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { login } = useSite();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="size-5 text-accent" /> Login Admin
          </DialogTitle>
          <DialogDescription>
            Akses terbatas untuk pengelola Ghighais Teknologi.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (login(username, password)) {
              toast.success("Mode Edit Admin aktif");
              onOpenChange(false);
              setUsername("");
              setPassword("");
            } else {
              toast.error("Username atau password salah");
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="admin-user">Username</Label>
            <Input
              id="admin-user"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Password</Label>
            <PasswordInput id="admin-pass" value={password} onChange={setPassword} />
          </div>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground">
            Masuk
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { changePassword } = useSite();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-accent" /> Ubah Password Admin
          </DialogTitle>
          <DialogDescription>
            Minimal 6 karakter. Password baru tersimpan di perangkat ini.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (next !== confirm) {
              toast.error("Konfirmasi password tidak cocok");
              return;
            }
            if (changePassword(current, next)) {
              toast.success("Password berhasil diubah");
              onOpenChange(false);
              setCurrent("");
              setNext("");
              setConfirm("");
            } else {
              toast.error("Password lama salah atau password baru terlalu pendek");
            }
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="cur">Password lama</Label>
            <PasswordInput id="cur" value={current} onChange={setCurrent} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">Password baru</Label>
            <PasswordInput id="new" value={next} onChange={setNext} autoComplete="new-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="conf">Ulangi password baru</Label>
            <PasswordInput id="conf" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          </div>
          <Button type="submit" className="w-full bg-brand-gradient text-primary-foreground">
            Simpan Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminToolbar() {
  const { isAdmin, logout, reset, save } = useSite();
  const [pwOpen, setPwOpen] = useState(false);
  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full glass px-3 py-2">
        <span className="hidden items-center gap-1.5 px-2 text-xs font-medium text-accent sm:flex">
          <ShieldCheck className="size-3.5" /> Mode Edit Admin
        </span>
        <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => setPwOpen(true)}>
          <KeyRound className="size-3.5" /> Ubah Password
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full text-xs text-muted-foreground"
          onClick={() => {
            if (confirm("Kembalikan seluruh konten ke bawaan?")) reset();
          }}
        >
          Reset Konten
        </Button>
        <Button
          size="sm"
          className="rounded-full bg-brand-gradient text-xs text-primary-foreground"
          onClick={() => {
            logout();
            toast.success("Kembali ke tampilan publik");
          }}
        >
          <LogOut className="size-3.5" /> Keluar Mode Admin
        </Button>
      </div>
      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </>
  );
}
