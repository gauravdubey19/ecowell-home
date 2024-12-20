import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  PinIcon as Pinterest,
} from "lucide-react";

import { CiPhone, CiMail, CiLocationOn } from "react-icons/ci";

export const links = [
  { id: 1, head: "Home", herf: "/" },
  { id: 1, head: "Products", herf: "/#products" },
  { id: 1, head: "About Us", herf: "/#about-us" },
  { id: 1, head: "Contact", herf: "/#contact" },
];

export const footerData = {
  newsletter: {
    title: "Join our tribe",
    description: "Be the first to hear about fresh news and new products",
    placeholder: "Enter your email here",
    buttonText: "Join",
  },
  links: {
    sections: [
      {
        title: "ABOUT",
        items: [
          {
            type: "link",
            content: "Shop All",
            href: "/#",
          },
          {
            type: "link",
            content: "About Us",
            href: "/#",
          },
          {
            type: "link",
            content: "Category",
            href: "/#",
          },
        ],
      },
      {
        title: "HELP",
        items: [
          {
            type: "link",
            content: "Shipping & Return",
            href: "/#",
          },
          {
            type: "link",
            content: "Term's & Condition's",
            href: "/#",
          },
          {
            type: "link",
            content: "Privacy Policies",
            href: "/#",
          },
        ],
      },
      {
        title: "CONTACT",
        items: [
          {
            type: "phone",
            content: "+91-9355951519",
            href: "tel:+91-9355951519",
            icon: <CiPhone size={20} className="w-6 h-6 text-[#0B3D2E]" />,
          },
          {
            type: "email",
            content: "ecowellonline@gmail.com",
            href: "mailto:ecowellonline@gmail.com",
            icon: <CiMail size={20} className="w-6 h-6 text-[#0B3D2E]" />,
          },
          {
            type: "address",
            content:
              "19, Park Lane, Church road, Vasant Kunj, New Delhi-110070",
            icon: (
              <CiLocationOn size={20} className="w-12 h-12 text-[#0B3D2E]" />
            ),
          },
        ],
      },
    ],
  },
  companyInfo: {
    name: "Ecowell",
    logo: "/logo.png",
    description:
      "At Ecowell, we blend science with the finest natural ingredients to craft premium wellness products. From muscle support to radiant skin, our range is designed to fuel your body, mind, and soul.",
  },
  socialMedia: [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Pinterest, href: "#" },
  ],
  copyright: {
    year: new Date().getFullYear(),
    company: "Ecowell, Inc.",
    links: ["Privacy Policy", "Terms of Service"],
  },
};

// bento grid section data
export const features = [
  {
    title: "Science Meets Nature",
    description:
      "Every product is a perfect fusion of cutting-edge research and nature's finest ingredients. No compromises, just pure, effective goodness.",
    image: "/p1.png",
  },
  {
    title: "Thoughtfully Curated for You",
    description:
      "From energy-boosting blends to beauty-enhancing supplements, our offerings are designed with one goal in mind – your well-being.",
    image: "/p2.png",
  },
  {
    title: "Empowering Your Journey",
    description:
      "With Ecowell, you're not just buying a product; you're joining a community committed to helping you thrive.",
    image: "/p3.png",
  },
  {
    title: "Premium You Can Trust",
    description:
      "Every formula is crafted with care, ensuring exceptional quality, safety, and results. It's wellness you can rely on.",
    image: "/p4.png",
  },
  {
    title: "Less is More",
    description:
      "We believe in keeping it minimal yet impactful – both in our products and our philosophy. Simple, effective solutions for your busy life.",
    image: "/p1.png",
  },
];

export const categoriesData = [
  { name: "PROTEIN", image: "/p1.png", href: "/#shop?category=protein" },
  { name: "COLLAGEN", image: "/p2.png", href: "/#shop?category=collagen" },
  { name: "SHILAJIT", image: "/p3.png", href: "/#shop?category=shilajit" },
  { name: "DAILY ESSENTIALS", image: "/p4.png", href: "/#shop?category=daily-essentials" },
];

export const certificationsData = [
  { id: 1, alt: "FDA", img: "/c1.png" },
  { id: 1, alt: "HACCP", img: "/c2.png" },
  { id: 1, alt: "GMP", img: "/c3.png" },
  { id: 1, alt: "ISO", img: "/c4.png" },
  { id: 1, alt: "FSSAI", img: "/c5.png" },
];

export const partnerLogoData = [
  { src: "/l1.png", alt: "Logo 1" },
  { src: "/l2.png", alt: "Logo 2" },
  { src: "/l3.png", alt: "Logo 3" },
];
