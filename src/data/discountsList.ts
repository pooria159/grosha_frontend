export interface InstantDiscount {
    id: number;
    title: string;
    code: string;
    description: string;
    percentage: number;
    for_first_purchase: boolean;
}

export const instantDiscounts: InstantDiscount[] = [
    {
        id: 1,
        title: "تخفیف ویژه بهاری",
        code: "SPRING20",
        description: "تخفیف ویژه فصل بهار برای تمام محصولات",
        percentage: 20,
        for_first_purchase: false
    },
    {
        id: 2,
        title: "تخفیف اولین خرید",
        code: "WELCOME15",
        description: "تخفیف ویژه برای اولین خرید شما",
        percentage: 15,
        for_first_purchase: true
    },
    {
        id: 3,
        title: "تخفیف آخر هفته",
        code: "WEEKEND10",
        description: "تخفیف ویژه آخر هفته",
        percentage: 10,
        for_first_purchase: false
    },
    {
        id: 4,
        title: "تخفیف ویژه الکترونیک",
        code: "ELECTRO25",
        description: "تخفیف ویژه محصولات الکترونیکی",
        percentage: 25,
        for_first_purchase: false
    },
    {
        id: 5,
        title: "تخفیف لباس‌ها",
        code: "FASHION30",
        description: "تخفیف ویژه محصولات مد و فشن",
        percentage: 30,
        for_first_purchase: false
    },
    {
        id: 6,
        title: "تخفیف کتاب‌ها",
        code: "BOOKS40",
        description: "تخفیف ویژه کتاب‌ها و محصولات فرهنگی",
        percentage: 40,
        for_first_purchase: false
    },
    {
        id: 7,
        title: "تخفیف عضویت",
        code: "MEMBER50",
        description: "تخفیف ویژه اعضای طلایی",
        percentage: 50,
        for_first_purchase: false
    },
    {
        id: 8,
        title: "تخفیف تولد",
        code: "BIRTHDAY",
        description: "تخفیف ویژه در ماه تولد شما",
        percentage: 20,
        for_first_purchase: false
    },
    {
        id: 9,
        title: "تخفیف دو نفره",
        code: "DUO15",
        description: "تخفیف ویژه خریدهای دو نفره",
        percentage: 15,
        for_first_purchase: false
    },
    {
        id: 10,
        title: "تخفیف خانوادگی",
        code: "FAMILY20",
        description: "تخفیف ویژه خریدهای خانوادگی",
        percentage: 20,
        for_first_purchase: false
    },
    {
        id: 11,
        title: "تخفیف دانشجویی",
        code: "STUDENT25",
        description: "تخفیف ویژه دانشجویان",
        percentage: 25,
        for_first_purchase: false
    },
    {
        id: 12,
        title: "تخفیف معلمین",
        code: "TEACHER30",
        description: "تخفیف ویژه معلمین و اساتید",
        percentage: 30,
        for_first_purchase: false
    },
    {
        id: 13,
        title: "تخفیف پزشکان",
        code: "DOCTOR15",
        description: "تخفیف ویژه کادر درمان",
        percentage: 15,
        for_first_purchase: false
    },
    {
        id: 14,
        title: "تخفیف نظامی",
        code: "MILITARY20",
        description: "تخفیف ویژه نیروهای مسلح",
        percentage: 20,
        for_first_purchase: false
    },
    {
        id: 15,
        title: "تخفیف ورزشی",
        code: "SPORT25",
        description: "تخفیف ویژه محصولات ورزشی",
        percentage: 25,
        for_first_purchase: false
    },
    {
        id: 16,
        title: "تخفیف ساعت‌ها",
        code: "WATCH30",
        description: "تخفیف ویژه ساعت‌های هوشمند",
        percentage: 30,
        for_first_purchase: false
    },
    {
        id: 17,
        title: "تخفیف لوازم خانگی",
        code: "HOME40",
        description: "تخفیف ویژه لوازم خانگی",
        percentage: 40,
        for_first_purchase: false
    },
    {
        id: 18,
        title: "تخفیف دیجیتال",
        code: "DIGITAL20",
        description: "تخفیف ویژه محصولات دیجیتال",
        percentage: 20,
        for_first_purchase: false
    },
    {
        id: 19,
        title: "تخفیف نوروزی",
        code: "NOWRUZ25",
        description: "تخفیف ویژه نوروز",
        percentage: 25,
        for_first_purchase: false
    },
    {
        id: 20,
        title: "تخفیف آخر فصل",
        code: "SEASON30",
        description: "تخفیف ویژه پایان فصل",
        percentage: 30,
        for_first_purchase: false
    }
];