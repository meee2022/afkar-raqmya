export const SITE_NAME = "أثر للتقنية والتصميم";
export const SITE_EN = "ATHR Technology & Design";
// No legacy domain is assumed. Set this before publishing to the official domain.
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || window.location.origin
).replace(/\/$/, "");
export const NAV = [
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/packages", label: "الباقات" },
  { to: "/about", label: "عن أثر" },
  { to: "/contact", label: "تواصل معنا" },
];

export const SERVICES = [
  {
    title: "تصميم وتطوير المواقع",
    short: "المواقع الإلكترونية",
    description:
      "من أول زيارة إلى آخر خطوة. مواقع تعكس هوية مشروعك وتجعل الوصول إلى خدماتك أسهل.",
    features: [
      "تصميم تجربة وواجهة المستخدم",
      "تطوير متجاوب مع الأجهزة",
      "تهيئة لمحركات البحث",
      "تكامل مع خدمات مشروعك",
    ],
    icon: "web",
  },
  {
    title: "تطبيقات الجوال",
    short: "تطبيقات الجوال",
    description:
      "فكرتك أقرب إلى جمهورك. تطبيقات عربية بتجربة واضحة، من تصور الشاشات إلى الإطلاق.",
    features: [
      "تطبيقات iOS وAndroid",
      "واجهات عربية وRTL",
      "الإشعارات والتكاملات",
      "تجربة استخدام مدروسة",
    ],
    icon: "app",
  },
  {
    title: "الهوية البصرية",
    short: "الهوية البصرية",
    description:
      "هوية تشبهك وتُعرف بها. نربط الشعار والألوان والخطوط في لغة واحدة لمشروعك.",
    features: [
      "تصميم الشعار",
      "الألوان والخطوط",
      "دليل استخدام الهوية",
      "قوالب التواصل الاجتماعي",
    ],
    icon: "brand",
  },
  {
    title: "العروض التقديمية",
    short: "العروض التقديمية",
    description:
      "قصة مشروعك، مرتبة وواضحة. عروض تجمع الفكرة والمحتوى والتصميم في تجربة مقنعة.",
    features: [
      "عروض الشركات والمشاريع",
      "تصميم Pitch Deck",
      "تنظيم المحتوى البصري",
      "ملفات PowerPoint وPDF",
    ],
    icon: "slides",
  },
  {
    title: "الفيديو الترويجي",
    short: "الفيديو والموشن",
    description:
      "نمنح فكرتك صورة وصوتًا وحركة، بمحتوى مرئي يشرح ما تقدمه ويليق بعلامتك.",
    features: [
      "موشن جرافيك 2D",
      "فيديوهات ترويجية",
      "Reels وStories",
      "المونتاج والتوليف",
    ],
    icon: "video",
  },
  {
    title: "الدعوات الرقمية",
    short: "الدعوات الرقمية",
    description:
      "تفاصيل المناسبة تبدأ من الدعوة. دعوات تفاعلية سهلة المشاركة عبر واتساب.",
    features: [
      "دعوات المناسبات والأفراح",
      "دعوات الشركات",
      "رابط سهل المشاركة",
      "تفاصيل وتفاعلات مخصصة",
    ],
    icon: "invite",
  },
];
