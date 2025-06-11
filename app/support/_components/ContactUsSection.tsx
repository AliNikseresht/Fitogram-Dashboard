import React from "react";
import ContactForm from "./ContactForm";
import Image from "next/image";
import contactPhoto from "@/public/contact-us-image.png";

const ContactUsSection: React.FC = () => {
  return (
    <section className="w-full p-4 md:px-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Contact Us</h2>
      <p className="text-center lg:text-start text-xs md:text-sm lg:text-base">
        Have questions or feedback? We&apos;re here to help. Reach out and
        we&apos;ll get back to you shortly.
      </p>

      <div className="flex justify-between gap-5 items-center w-full h-full">
        <ContactForm />
        <Image
          src={contactPhoto}
          alt="contact photo"
          priority
          width={600}
          height={600}
          className="object-contain hidden lg:flex rounded-lg w-full h-auto"
        />
      </div>
    </section>
  );
};

export default ContactUsSection;
