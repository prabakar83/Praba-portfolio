"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Tell me your name"),
  email: z.email("I'll need a valid email to reply"),
  company: z.string().optional(),
  reason: z.string().min(1, "Pick one"),
  message: z.string().min(20, "Give me at least a couple of sentences"),
  // honeypot — real people never see or fill this field
  website: z.string().max(0).optional(),
});

type ContactValues = z.infer<typeof contactSchema>;

const REASONS = [
  "Job opportunity",
  "Freelance project",
  "General inquiry",
];

/**
 * Contact form — react-hook-form + zod validation, animated submit
 * states. The submit handler is a stub: wire it to a route handler,
 * server action or service (Resend, Formspree…) per project.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { reason: "" },
  });

  // useWatch (not watch()) — safe with the React Compiler
  const reason = useWatch({ control, name: "reason" });

  const onSubmit = async (values: ContactValues) => {
    setSubmitError(null);
    const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL;
    if (!apiUrl) {
      setSubmitError(
        "Contact API isn't configured yet — set NEXT_PUBLIC_CONTACT_API_URL. Meanwhile, email me directly.",
      );
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setSubmitError(
        "Couldn't send that just now — please email me directly instead.",
      );
    }
  };

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-96 flex-col items-start justify-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Check className="size-6" />
            </span>
            <h2 className="mt-8 font-display text-4xl">
              Message received<span className="text-accent">.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Thanks for reaching out — I read everything myself and usually
              reply within two working days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="relative space-y-10"
          >
            {submitError && (
              <p role="alert" className="text-sm text-destructive">
                {submitError}
              </p>
            )}
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p role="alert" className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Optional"
                {...register("company")}
              />
            </div>

            <fieldset>
              <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                What&apos;s this about? *
              </legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setValue("reason", r, { shouldValidate: true })
                    }
                    aria-pressed={reason === r}
                    data-cursor="hover"
                    className={
                      reason === r
                        ? "rounded-full border border-accent bg-accent px-5 py-2 text-sm text-accent-foreground"
                        : "rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
              {errors.reason && (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {errors.reason.message}
                </p>
              )}
            </fieldset>

            {/* Honeypot — hidden from real visitors via CSS, not display:none
                (some bots skip display:none fields specifically) */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message">Project *</Label>
              <Textarea
                id="message"
                placeholder="What are we building? Timeline, goals, references…"
                aria-invalid={!!errors.message}
                {...register("message")}
              />
              {errors.message && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              data-cursor="hover"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Sending…
                </>
              ) : (
                "Send the brief"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
