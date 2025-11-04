import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  EmailOutlined,
  PhoneOutlined,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";

interface FooterProps {
  logoSrc?: string;
  companyName?: string;
  description?: string;
  email?: string;
  phone?: string;
  quickLinks?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{ platform: "facebook" | "twitter" | "instagram" | "linkedin"; href: string }>;
  copyrightYear?: number;
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  logoSrc = "/images/logo2.PNG",
  companyName = "Woman Empowering Journey",
  description = "Discover unique handcrafted arts and learn from talented artists through our comprehensive courses.",
  email = "team@womanej.com",
  phone = "+1 (555) 123-4567",
  quickLinks = [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Return & Exchange Policy", href: "/return-exchange-policy" },
    { label: "FAQ", href: "/faq" },
  ],
  socialLinks = [
    { platform: "facebook", href: "https://facebook.com/artspace" },
    { platform: "twitter", href: "https://twitter.com/artspace" },
    { platform: "instagram", href: "https://instagram.com/artspace" },
    { platform: "linkedin", href: "https://linkedin.com/company/artspace" },
  ],
  copyrightYear = new Date().getFullYear(),
  copyrightText = "Woman Empowering Journey. All rights reserved. Crafted with ❤️ for artists and art lovers.",
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "linkedin":
        return <LinkedIn className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-[#f6f0e3] border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
          
          <div className="space-y-4 max-w-sm text-center">
            <div className="flex flex-col items-center space-y-2">
              <Image src={logoSrc} alt={companyName} width={130} height={80} className="rounded-lg" />
              <h2 className="text-xl font-semibold text-[#675744]">{companyName}</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link key={index} href={link.href} className="block text-gray-600 hover:text-[#61503c] text-sm">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <EmailOutlined className="w-4 h-4 text-gray-600" />
                <Link href={`mailto:${email}`} className="text-gray-900 hover:text-[#61503c]">
                  {email}
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <PhoneOutlined className="w-4 h-4 text-gray-600" />
                <Link href={`tel:${phone.replace(/\s/g, "")}`} className="text-gray-900 hover:text-[#61503c]">
                  {phone}
                </Link>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-3">Follow us</p>
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#61503c]">
                      {getSocialIcon(social.platform)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © {copyrightYear} {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
