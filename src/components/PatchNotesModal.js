import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

export function PatchNotesModal({ patchNotes }) {
  const p = useTranslations("PatchNotes");

  // Function to format the date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based, so add 1
    const day = date.getDate().toString().padStart(2, "0"); // Ensure day is always two digits

    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{p("Title")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{p("Title")}</DialogTitle>
          <DialogDescription>{p("Description")}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[300px] pr-4">
          {patchNotes.map((note, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                {p("VersionNumber", { number: note.version })}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {formatDate(note.date)} {/* Format the date here */}
              </p>
              <ul className="list-disc pl-5">
                {note.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="text-sm">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
