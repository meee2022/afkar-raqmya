import { mutation } from "./_generated/server";

export const seedProjects = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("agencyProjects").collect();
    if (existing.length > 0) return { skipped: true, count: existing.length };

    const projects = [
      {
        titleAr: "نَفَحات — صحبة القرآن",
        descriptionAr: "منصة رقمية لصحبة دائمة مع القرآن الكريم، تقدم تجربة تفاعلية يومية تجمع المستخدم بكلام الله.",
        category: "تطبيقات",
        result: "تجربة روحية يومية",
        tags: ["React", "TypeScript", "PWA"],
        sortOrder: 0,
      },
      {
        titleAr: "Adrenaline — مطعم",
        descriptionAr: "موقع مطعم عصري متكامل بقائمة طعام تفاعلية، نظام حجز طاولات، وعروض ترويجية ديناميكية.",
        category: "مواقع",
        result: "تجربة مستخدم فاخرة",
        tags: ["React", "Tailwind", "Convex"],
        sortOrder: 1,
      },
      {
        titleAr: "DarkFit — نادي رياضي",
        descriptionAr: "موقع نادي لياقة بدنية بتصميم داكن وقوي، يشمل برامج التدريب والاشتراكات وحجز الجلسات.",
        category: "مواقع",
        result: "↑ 55% اشتراكات جديدة",
        tags: ["React", "Vite", "Tailwind"],
        sortOrder: 2,
      },
      {
        titleAr: "Smart Arena — منصة رياضية",
        descriptionAr: "منصة إدارة رياضية متكاملة تشمل جداول المباريات، ترتيب الفرق، وإحصائيات اللاعبين.",
        category: "تطبيقات",
        result: "إدارة شاملة للدوري",
        tags: ["React", "TypeScript", "Convex"],
        sortOrder: 3,
      },
      {
        titleAr: "ابن تيمية — أكاديمية",
        descriptionAr: "موقع أكاديمية إسلامية متخصص يعرض المناهج والمحاضرات والتسجيل في الدورات التعليمية.",
        category: "مواقع",
        result: "↑ 70% تسجيلات",
        tags: ["React", "Tailwind"],
        sortOrder: 4,
      },
      {
        titleAr: "Arirang Bakery — مخبز",
        descriptionAr: "موقع مخبز كوري-عربي فاخر بعرض المنتجات، الطلبات المسبقة، وهوية بصرية مميزة.",
        category: "هوية",
        result: "هوية بصرية متكاملة",
        tags: ["Figma", "React", "Tailwind"],
        sortOrder: 5,
      },
      {
        titleAr: "العلاهي — مؤسسة أكاديمية",
        descriptionAr: "موقع مؤسسة تعليمية يضم المناهج والكوادر الأكاديمية وبوابة التسجيل الإلكتروني.",
        category: "مواقع",
        result: "بوابة رقمية متكاملة",
        tags: ["React", "Tailwind"],
        sortOrder: 6,
      },
      {
        titleAr: "دار ابن الجزري",
        descriptionAr: "موقع دار علمية إسلامية متخصص في تعليم علوم القرآن والتجويد، بتصميم راقٍ وهوية أصيلة.",
        category: "مواقع",
        result: "↑ 3× عدد الطلاب",
        tags: ["React", "Tailwind"],
        sortOrder: 7,
      },
      {
        titleAr: "نظام ERP متكامل",
        descriptionAr: "نظام إدارة موارد مؤسسية شامل يغطي المخزون، الفواتير، الموارد البشرية، والتقارير التحليلية.",
        category: "نظم",
        result: "↑ 80% كفاءة تشغيلية",
        tags: ["React", "TypeScript", "Convex"],
        sortOrder: 8,
      },
    ];

    for (const p of projects) {
      await ctx.db.insert("agencyProjects", {
        ...p,
        isActive: true,
        createdAt: Date.now(),
      });
    }

    return { seeded: true, count: projects.length };
  },
});
