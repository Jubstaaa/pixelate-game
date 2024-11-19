import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { updateUsername } from "@/lib/leaderboard";
import { useRouter } from "next/navigation";

function LeaderboardForm() {
  const t = useTranslations("Ranking");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      const toastId = toast.loading(t("Joining"));

      const res = await updateUsername(username);
      if (res?.error) {
        toast.error(res?.error, { id: toastId });
      } else {
        toast.success(res.message, { id: toastId });
        router.refresh();
        setIsOpen(false);
        setUsername("");
      }
    } else {
      toast.error(t("UsernameRequired"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {t("Join")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("JoinTitle")}</DialogTitle>
          <DialogDescription>{t("JoinDescription")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">{t("Username")}</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="submit">{t("Submit")}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LeaderboardForm;
