export interface AgencyProject {
  _id: string;
  titleAr: string;
  descriptionAr: string;
  category: string;
  imageUrl: string | null;
  videoUrl: string | null;
  liveUrl?: string;
  result?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  role?: string;
  duration?: string;
  featured?: boolean;
  phone?: boolean;
  tags?: string[];
  slug?: string;
  seedKey?: string;
  isActive?: boolean;
  sortOrder?: number;
}
const SLUGS: Record<string, string> = {
  s0: "marasi-boats",
  s1: "adrenaline-healthy",
  s2: "nafahat",
  s3: "nada-makeup",
  s4: "radda",
  s5: "darkfit",
  s6: "dopamin",
  s7: "darb",
  s8: "ibn-jazri",
  s9: "salaty",
  s10: "gold-qatar",
  s11: "matabekh-aljanoub",
  s13: "alahli-academy",
  s14: "bashayer",
  s15: "adrenaline-cafe",
  s16: "musk",
  s17: "dps",
  s18: "ruqi",
  s19: "qtourist",
};
// Bootstrap only. Database rows, including their active state, are authoritative.
export const PROJECT_CATALOG: AgencyProject[] = [
  {
    _id: "s0",
    titleAr: "Marasi Boats — رحلات بحرية فاخرة",
    descriptionAr:
      "موقع فاخر لرحلات اليخت الخاص في الدوحة: الباقات والمناسبات والمعرض والحجز.",
    category: "مواقع",
    result: "تجربة حجز فاخرة",
    imageUrl: "/previews/marasi.jpg",
    videoUrl: "/videos/marasi.mp4",
    color: "",
    accent: "#3B5BDB",
    liveUrl: "https://marasi-boats.pages.dev/",
  },
  {
    _id: "s1",
    titleAr: "Adrenaline — وجبات صحية",
    descriptionAr:
      "منصة وجبات صحية بخطط غذائية ذكية وحاسبة سعرات واشتراكات وتوصيل يومي داخل قطر.",
    category: "مواقع",
    result: "منصة طلب واشتراك",
    imageUrl: "/previews/adrenaline-food.png",
    videoUrl: "/videos/adrenaline.mp4",
    color: "",
    accent: "#3cc4f0",
    liveUrl: "https://adrenalinehealthy.com/",
  },
  {
    _id: "s2",
    titleAr: "نَفَحات — صحبة القرآن",
    descriptionAr:
      "تطبيق للمصحف وأوقات الصلاة والقبلة والتسبيح، بتجربة عربية هادئة.",
    category: "تطبيقات",
    phone: true,
    result: "تجربة روحية يومية",
    imageUrl: "/previews/naf-home.jpg",
    videoUrl: "/nafafat.mp4",
    color: "",
    accent: "#2dd4bf",
    challenge:
      "إيجاد طريقة تجعل القارئ على صلة يومية بالقرآن الكريم بأسلوب عصري وجذاب بعيداً عن التطبيقات التقليدية.",
    solution:
      "تصميم تجربة تفاعلية تشمل تصفّح المصحف، آية اليوم، التلاوات الصوتية، والأدوات والمكتبة — بواجهة عربية أنيقة وسلسة.",
    outcome:
      "تطبيق متكامل يوفّر صحبة قرآنية يومية بتجربة مستخدم راقية على الجوال.",
    liveUrl: "https://nafahat.vercel.app/",
  },
  {
    _id: "s3",
    titleAr: "Nada Makeup — خبيرة تجميل",
    descriptionAr:
      "موقع أنيق لخبيرة مكياج العرائس في قطر ومصر، مع معرض الأعمال ونظام الحجز.",
    category: "هوية",
    result: "هوية أنيقة + حجز",
    imageUrl: "/previews/nada-new.jpg",
    videoUrl: "/videos/nada.mp4",
    color: "",
    accent: "#C0806A",
    liveUrl: "https://nada-makeup-9yu.pages.dev/",
  },
  {
    _id: "s4",
    titleAr: "الردّة — تراث الغوص على اللؤلؤ",
    descriptionAr:
      "منصة تعليمية عن تراث الغوص على اللؤلؤ، برحلة غوص افتراضية بزاوية 360°.",
    category: "مواقع",
    result: "تجربة تعليمية غامرة",
    imageUrl: "/previews/radda.jpg",
    videoUrl: "/videos/radda.mp4",
    color: "",
    accent: "#38bdf8",
  },
  {
    _id: "s5",
    titleAr: "DarkFit — منصة لياقة",
    descriptionAr:
      "تمارين ومولّد خطط وتغذية ومدربين وحاسبات صحية في تطبيق واحد.",
    category: "تطبيقات",
    phone: true,
    result: "منظومة لياقة متكاملة",
    imageUrl: "/previews/darkfit-m.jpg",
    videoUrl: "/videos/darkfit.mp4",
    color: "",
    accent: "#4CA31A",
    liveUrl: "https://darkfit.netlify.app/",
  },
  {
    _id: "s6",
    titleAr: "Dopamin — حلويات صحية",
    descriptionAr:
      "هوية دافئة وموقع لعلامة حلويات صحية يعرض المنتجات بتجربة بصرية شهية.",
    category: "هوية",
    result: "هوية علامة شهية",
    imageUrl: "/previews/dopamin.png",
    videoUrl: "/videos/dopamin.mp4",
    color: "",
    accent: "#C2577E",
    liveUrl: "https://dopamin-bj1.pages.dev/",
  },
  {
    _id: "s7",
    titleAr: "دَرْب — التعلّم التفاعلي",
    descriptionAr:
      "منصة ألعاب وأنشطة تعليمية لكل المواد، يُنشئ فيها المعلم أنشطته ويشاركها مع طلابه.",
    category: "تطبيقات",
    result: "أدوات تعليمية تفاعلية",
    imageUrl: "/previews/games-new.jpg",
    videoUrl: "/videos/darb.mp4",
    color: "",
    accent: "#7A1630",
    liveUrl: "https://activities-dmc.pages.dev/",
  },
  {
    _id: "s8",
    titleAr: "دار ابن الجزري",
    descriptionAr:
      "منصة متكاملة لتحفيظ القرآن الكريم وتعليم أحكام التجويد لجميع الأعمار.",
    category: "مواقع",
    result: "منصة تعليم قرآني",
    imageUrl: "/previews/ibn-jazry-new.jpg",
    videoUrl: "/videos/ibn-jazry.mp4",
    color: "",
    accent: "#1F8A5B",
    liveUrl: "https://dar-ibn-jazri.vercel.app/",
  },
  {
    _id: "s9",
    titleAr: "صلاتي قرة عيني",
    descriptionAr:
      "رحلة تفاعلية تعلّم الأطفال الأذان والوضوء والصلاة مع شخصيتي حمد وهدى.",
    category: "تطبيقات",
    phone: true,
    result: "تعليم أطفال ممتع",
    imageUrl: "/previews/slaty.png",
    videoUrl: "/videos/slaty.mp4",
    color: "",
    accent: "#34A06B",
    liveUrl: "https://noora-edu.com/",
  },
  {
    _id: "s10",
    titleAr: "زينة وخزينة — الذهب",
    descriptionAr: "تطبيق لبيع وشراء الذهب ومتابعة الأسعار والمعاملات بسهولة.",
    category: "تطبيقات",
    result: "تداول ذهب مبسّط",
    imageUrl: "/previews/gold.jpg",
    videoUrl: null,
    color: "",
    accent: "#C9A35F",
    liveUrl: "https://goldqatar1.netlify.app/",
  },
  {
    _id: "s11",
    titleAr: "مطابخ الجنوب — نقاط بيع",
    descriptionAr:
      "نظام كاشير وفواتير إلكترونية ومتابعة مبيعات لمطاعم المأكولات الشعبية.",
    category: "نظم",
    result: "POS وفواتير",
    imageUrl: "/previews/elwakra-pos.jpg",
    videoUrl: null,
    color: "",
    accent: "#B4472A",
    liveUrl: "https://stdk.vercel.app/",
  },
  {
    _id: "s13",
    titleAr: "أكاديمية النادي الأهلي",
    descriptionAr:
      "موقع أكاديمية فنون الدفاع عن النفس بالنادي الأهلي: البرامج والمدربون والتسجيل.",
    category: "مواقع",
    result: "تسجيل أونلاين",
    imageUrl: "/previews/karateh.jpg",
    videoUrl: "/videos/karateh.mp4",
    color: "",
    accent: "#7A1630",
  },
  {
    _id: "s14",
    titleAr: "بصمة بشاير للإبداع",
    descriptionAr:
      "منصة تفاعلية لتعليم الاجتماعيات بالحكايات، مع مساحات خاصة للطالب والمعلم.",
    category: "مواقع",
    result: "تعلّم بالحكاية",
    imageUrl: "/previews/bshayer.jpg",
    videoUrl: "/videos/bshayer.mp4",
    color: "",
    accent: "#7A1630",
  },
  {
    _id: "s15",
    titleAr: "Adrenaline Store & Café",
    descriptionAr:
      "متجر ومقهى أدرينالين: قائمة المشروبات والمنتجات والطلب، مع نظام كاشير للموظفين.",
    category: "مواقع",
    result: "متجر + كاشير",
    imageUrl: "/previews/shop.jpg",
    videoUrl: "/videos/shop.mp4",
    color: "",
    accent: "#B08A4A",
  },
  {
    _id: "s16",
    titleAr: "المصك — وجبات دايت",
    descriptionAr:
      "منصة اشتراكات وجبات صحية مع حاسبة السعرات وإدارة الخطط والتوصيل اليومي.",
    category: "مواقع",
    result: "اشتراكات وجبات",
    imageUrl: "/previews/musk.jpg",
    videoUrl: "/videos/musk.mp4",
    color: "",
    accent: "#D7263D",
  },
  {
    _id: "s17",
    titleAr: "DPS — تغليف فاخر",
    descriptionAr:
      "موقع شركة تغليف فاخرة في الدوحة يعرض الحلول والكتالوج وطلب عروض الأسعار.",
    category: "مواقع",
    result: "حضور فاخر",
    imageUrl: "/previews/dps.jpg",
    videoUrl: "/videos/dps.mp4",
    color: "",
    accent: "#1F4D45",
  },
  {
    _id: "s18",
    titleAr: "رُقي — منصة دورات",
    descriptionAr:
      "منصة تعليمية متعددة المعلمين: مقررات ودروس وجدول يومي للطالب.",
    category: "تطبيقات",
    result: "تعلّم إلكتروني",
    imageUrl: "/previews/ruqi.jpg",
    videoUrl: "/videos/ruqi.mp4",
    color: "",
    accent: "#7A1630",
  },
  {
    _id: "s19",
    titleAr: "QTourist — رحلات قطر",
    descriptionAr:
      "تطبيق يكتشف فيه السائح أفضل الفنادق والمطاعم والأنشطة في قطر ويخطط رحلته.",
    category: "تطبيقات",
    phone: true,
    result: "دليل سياحي ذكي",
    imageUrl: "/previews/qtourist.jpg",
    videoUrl: "/videos/qtourist.mp4",
    color: "",
    accent: "#A31621",
  },
].map((p, index) => ({
  ...p,
  videoUrl: p.videoUrl === "/nafafat.mp4" ? "/nafahat.mp4" : p.videoUrl,
  seedKey: p._id,
  slug: SLUGS[p._id],
  featured: index < 4,
  sortOrder: index,
  tags: [],
  isActive: true,
}));

export function catalogMatch(p: { seedKey?: string; titleAr: string }) {
  return PROJECT_CATALOG.find((c) =>
    p.seedKey
      ? c.seedKey === p.seedKey
      : c.titleAr.split(" — ")[0] === p.titleAr.split(" — ")[0],
  );
}

// Compatibility with existing database rows. Enrich rows, never concatenate bootstrap rows.
export function normalizeProject(p: AgencyProject): AgencyProject {
  const fallback = catalogMatch(p);
  return {
    ...p,
    slug: p.slug ?? fallback?.slug ?? p._id,
    phone: p.phone ?? fallback?.phone ?? false,
    featured: p.featured ?? fallback?.featured ?? false,
    imageUrl: p.imageUrl || fallback?.imageUrl || null,
    videoUrl: p.videoUrl || fallback?.videoUrl || null,
  };
}
