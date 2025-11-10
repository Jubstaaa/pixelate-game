"use client";

import { Button, ModalHeader, ModalBody, ModalFooter, Textarea } from "@heroui/react";
import { Frown, Meh, Smile, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

import { useSendFeedbackMutation } from "@/lib/api/game-api";

const ratings = [
  { icon: Frown, label: "Poor" },
  { icon: Meh, label: "Okay" },
  { icon: Smile, label: "Good" },
  { icon: ThumbsUp, label: "Great" },
];

export default function Feedback({ onClose }) {
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [sendFeedback, { isLoading }] = useSendFeedbackMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await sendFeedback({ feedback, rating: selectedRating }).unwrap();
        onClose();
        setFeedback("");
        setSelectedRating(null);
      }}
    >
      <ModalHeader className="flex flex-col items-start gap-1">
        Share your thoughts
        <span className="text-muted-foreground text-sm font-normal">
          We&apos;d love to hear your feedback.
        </span>
      </ModalHeader>
      <ModalBody>
        <div className="grid gap-4 py-4">
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Ideas or suggestions to improve our product"
            className="col-span-3"
            rows={5}
            required
          />
        </div>
      </ModalBody>
      <ModalFooter className="flex-row sm:justify-between">
        <div className="flex gap-2">
          {ratings.map((rating, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onPress={() => setSelectedRating(rating.label)}
              className={selectedRating === rating.label ? "text-primary" : "text-muted-foreground"}
            >
              <rating.icon className="h-4 w-4" />
              <span className="sr-only">{rating.label}</span>
            </Button>
          ))}
        </div>
        <Button type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </ModalFooter>
    </form>
  );
}
