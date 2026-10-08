import { mutation } from "./_generated/server";

// مشاريع حقيقية — الأسماء والأوصاف مستخرجة من المشاريع الفعلية في فولدر projects
const PROJECTS = [
  {
    titleAr: "نَفَحات — صحبة القرآن",
    descriptionAr: "منصة رقمية لصحبة دائمة مع القرآن الكريم، تجمع تصفّح المصحف وآية اليوم والتلاوات في تجربة عربية سلسة.",
    category: "تطبيقات",
    result: "تطبيق قرآن تفاعلي",
    liveUrl: "https://nafahat.vercel.app/",
    previewImage: "/previews/nafahat.png",
    tags: ["React", "TypeScript", "PWA"],
  },
  {
    titleAr: "Adrenaline — وجبات صحية",
    descriptionAr: "منصة وجبات صحية بخطط غذائية ذكية وحاسبة سعرات واشتراكات وتوصيل يومي داخل قطر.",
    category: "مواقع",
    result: "منصة طلب واشتراك",
    liveUrl: "https://adrenalinehealthy.com/",
    previewImage: "/previews/adrenaline-food.png",
    tags: ["React", "Tailwind", "Convex"],
  },
  {
    titleAr: "Adrenaline Gym — نادي رياضي",
    descriptionAr: "موقع نادي أدرينالين جم في لوسيل يعرض خدمات التدريب والقوة والاستشفاء وحجز الزيارات.",
    category: "مواقع",
    result: "حضور رقمي قوي",
    previewImage: "/previews/adrenaline-gym.png",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "ردّة — تراث الغوص على اللؤلؤ",
    descriptionAr: "منصة تعليمية تفاعلية عن تراث الغوص على اللؤلؤ في قطر والخليج، تشمل رحلة غوص افتراضية والسفن والأدوات.",
    category: "مواقع",
    result: "تجربة تعليمية غامرة",
    previewImage: "/previews/diving.png",
    tags: ["React", "Three.js", "Tailwind"],
  },
  {
    titleAr: "Dopamin — حلويات",
    descriptionAr: "موقع علامة حلويات عصري بهوية دافئة، يعرض المنتجات والطلبات بتجربة بصرية شهية.",
    category: "مواقع",
    result: "هوية علامة شهية",
    previewImage: "/previews/dopamin.png",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "دار ابن الجزري",
    descriptionAr: "منصة متكاملة لتحفيظ القرآن الكريم وتعليم علومه، ببرامج متنوعة ومتخصصة لجميع الأعمار والمستويات.",
    category: "مواقع",
    result: "منصة تعليم قرآني",
    previewImage: "/previews/ibn-jazry.png",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "saifx — تعلّم الفيزياء",
    descriptionAr: "مساحة منظمة لتعلم الفيزياء: الدروس والكتب والتدريبات لصفوف المرحلة الثانوية.",
    category: "مواقع",
    result: "منصة تعليمية متخصصة",
    previewImage: "/previews/saifx.png",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "المصك — وجبات دايت ولياقة",
    descriptionAr: "موقع وجبات دايت ولياقة تُحضَّر يومياً بإشراف أخصائيي تغذية، مع باقات تنشيف ولياقة وتوصيل صحي في قطر.",
    category: "مواقع",
    result: "باقات تغذية متكاملة",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "DarkFit — منصة لياقة",
    descriptionAr: "منصة لياقة وصحة شاملة: تمارين ومولّد خطط وتغذية ومكملات ومدربين وحاسبات صحية في تجربة واحدة.",
    category: "تطبيقات",
    result: "منظومة لياقة متكاملة",
    liveUrl: "https://darkfit.netlify.app/",
    previewImage: "/previews/darkfit.png",
    tags: ["React", "Vite", "Tailwind"],
  },
  {
    titleAr: "Nada Makeup — خبيرة تجميل",
    descriptionAr: "موقع وهوية لخبيرة مكياج العرائس والمناسبات في قطر ومصر، مع عرض الأعمال ونظام حجز للجلسات المنزلية.",
    category: "هوية",
    result: "هوية أنيقة + حجز",
    tags: ["Branding", "React", "Tailwind"],
  },
  {
    titleAr: "مساحة التعلّم التفاعلي — قطر",
    descriptionAr: "منصة ألعاب وأسئلة تفاعلية وأوراق عمل لكل المواد، تتيح للمعلم إنشاء أنشطته ومشاركتها مع طلابه.",
    category: "تطبيقات",
    result: "أدوات تعليمية تفاعلية",
    previewImage: "/previews/games.png",
    tags: ["React", "TypeScript", "Convex"],
  },
  {
    titleAr: "صلاتي قرة عيني",
    descriptionAr: "رحلة تفاعلية لتعليم الأطفال الأذان والوضوء والصلاة مع شخصيتي حمد وهدى، مستوحاة من كتاب صلاتي قرة عيني.",
    category: "تطبيقات",
    result: "تعليم أطفال ممتع",
    previewImage: "/previews/slaty.png",
    tags: ["React", "Animation"],
  },
  {
    titleAr: "ruqi — منصة دورات",
    descriptionAr: "منصة دورات تعليمية إلكترونية متكاملة لإدارة الكورسات والطلاب والمحتوى.",
    category: "تطبيقات",
    result: "منصة تعلّم إلكتروني",
    tags: ["React", "TypeScript", "Convex"],
  },
  {
    titleAr: "مطابخ الجنوب — نقاط بيع",
    descriptionAr: "نظام نقاط بيع وفواتير إلكترونية لمطاعم المأكولات الشعبية — إدارة الطلبات والفواتير بسهولة.",
    category: "نظم",
    result: "POS وفواتير إلكترونية",
    liveUrl: "https://elwakra-kitchen.vercel.app/",
    previewImage: "/previews/elwakra.png",
    tags: ["React", "TypeScript", "POS"],
  },
  {
    titleAr: "مدم مي للتجارة",
    descriptionAr: "منصة إدارة تجارة جملة الخضروات والفواكه في الدوحة — متابعة البضائع والطلبات والحسابات.",
    category: "نظم",
    result: "إدارة تجارة جملة",
    previewImage: "/previews/madam-mai.png",
    tags: ["React", "TypeScript", "Convex"],
  },
  {
    titleAr: "ابن تيمية — النظام الإلكتروني",
    descriptionAr: "النظام الإلكتروني الموحد للحضور والإشراف الصفي والتقارير والاستبانات لمدرسة ابن تيمية الثانوية للبنين.",
    category: "نظم",
    result: "نظام مدرسي متكامل",
    previewImage: "/previews/ibn-taymia.png",
    tags: ["React", "TypeScript", "Convex"],
  },
  {
    titleAr: "نورة الدوسري — تنسيق أكاديمي",
    descriptionAr: "منصة التنسيق الأكاديمي لمدرسة ابتدائية: الرسالة الأسبوعية والخطة السنوية ومتابعة المهام.",
    category: "نظم",
    result: "إدارة أكاديمية منظمة",
    liveUrl: "https://nora-work.pages.dev/",
    previewImage: "/previews/nora-work.png",
    tags: ["React", "Tailwind"],
  },
  {
    titleAr: "إشراف التربية البدنية",
    descriptionAr: "نظام إشراف ومتابعة لمعلمي التربية البدنية، يشمل الزيارات الصفية والتقارير والبحث الإجرائي في قطر.",
    category: "نظم",
    result: "نظام إشراف تربوي",
    tags: ["React", "TypeScript"],
  },
  {
    titleAr: "نظام ERP متكامل",
    descriptionAr: "نظام إدارة موارد مؤسسية شامل يغطي المخزون والفواتير والموارد البشرية والتقارير التحليلية.",
    category: "نظم",
    result: "إدارة مؤسسية شاملة",
    tags: ["React", "TypeScript", "Convex"],
  },
];

export const seedProjects = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("agencyProjects").collect();
    if (existing.length > 0) return { skipped: true, count: existing.length };

    let order = 0;
    for (const p of PROJECTS) {
      await ctx.db.insert("agencyProjects", {
        ...p,
        sortOrder: order++,
        isActive: true,
        createdAt: Date.now(),
      });
    }
    return { seeded: true, count: PROJECTS.length };
  },
});

// لإعادة التعبئة من الصفر: يمسح كل المشاريع ثم يضيف القائمة الحقيقية
export const reseedProjects = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("agencyProjects").collect();
    for (const row of existing) await ctx.db.delete(row._id);

    let order = 0;
    for (const p of PROJECTS) {
      await ctx.db.insert("agencyProjects", {
        ...p,
        sortOrder: order++,
        isActive: true,
        createdAt: Date.now(),
      });
    }
    return { reseeded: true, deleted: existing.length, count: PROJECTS.length };
  },
});
