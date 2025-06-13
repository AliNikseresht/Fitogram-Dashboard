"use client";

import React from "react";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { toast } from "react-toastify";
import CustomLoadingSpinner from "@/components/ui/loadings/CustomLoadingSpinner";
import { ContactFormInputs } from "@/types/ContactFormType";
import { validationRules } from "@/data/validationRulesData";

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>();

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      toast.success("Message sent successfully!");
      reset();
    } catch {
      toast.error("Failed to send message.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#fff] rounded-lg shadow-md p-3 md:p-4 space-y-5 max-w-2xl w-full h-full"
      noValidate
    >
      <FormField
        id="name"
        label="Full Name"
        register={register("name", validationRules.name)}
        error={errors.name?.message}
        placeholder="Your name"
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        register={register("email", validationRules.email)}
        error={errors.email?.message}
        placeholder="you@example.com"
      />
      <FormField
        id="subject"
        label="Subject"
        register={register("subject", validationRules.subject)}
        error={errors.subject?.message}
        placeholder="Message subject"
      />
      <FormField
        id="message"
        label="Message"
        isTextArea
        register={register("message", validationRules.message)}
        error={errors.message?.message}
        placeholder="Type your message here..."
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#0284c7] text-[#fff] py-2 rounded cursor-pointer disabled:opacity-50 hover:bg-[#027bc7] duration-200"
      >
        {isSubmitting ? <CustomLoadingSpinner /> : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
