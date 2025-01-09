import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* <img src="./images/djmsre_httpss.mj.runmeErbMom2y0_httpss.mj.run20TopOWtqHw_http_fde037e9-5804-40da-9844-fd5aa01acd76_0.png" />
      <img src="./images/djmsre_httpss.mj.runn7LNtMFbWOI_httpss.mj.runDIdp9ObNnhs_http_62d1c903-3df2-4f70-89d0-fa8823c48b75_2.png" />
      <img src="./images/djmsre_httpss.mj.runn7LNtMFbWOI_httpss.mj.runDIdp9ObNnhs_http_88c11966-f933-46d9-ba39-0ec40e4a3c94_1.png" />
      <img src="./images/djmsre_httpss.mj.runn7LNtMFbWOI_httpss.mj.runDIdp9ObNnhs_http_99b66892-fc8b-4e0e-80e4-aba23a13a04e_0.png" /> */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a project in mind? We'd love to hear about it. Send us a message
          and we'll get back to you as soon as possible.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
