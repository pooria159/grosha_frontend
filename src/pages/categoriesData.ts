export interface Subcategory {
    id: number;
    name: string;
    image: string;
}

export interface Category {
    id: number;
    name: string;
    subcategories: Subcategory[];
}

export const categories: Category[] = [
    {
        id: 1,
        name: "لوازم خانگی",
        subcategories: [
            { id: 11, name: "یخچال" , image: "https://static.vecteezy.com/system/resources/previews/031/089/496/non_2x/2-door-refrigerator-outline-icon-style-vector.jpg"},
            { id: 12, name: "ماشین لباسشویی", image: "https://i.etsystatic.com/19543171/r/il/368a29/5683657158/il_570xN.5683657158_sk8z.jpg" },
            { id: 13, name: "ظرفشویی", image: "https://static.vecteezy.com/system/resources/previews/014/601/979/non_2x/dishwasher-icon-free-vector.jpg" },
            { id: 14, name: "اجاق گاز", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPOcFZ66H3RukMKFugS5VgRPjOkajJgDh9Cg&s" },
        ],
    },
    {
        id: 2,
        name: "مد و پوشاک",
        subcategories: [
            { id: 21, name: "پیراهن" , image: "https://i.etsystatic.com/36867827/r/il/7c2707/4146741250/il_570xN.4146741250_qps3.jpg"},
            { id: 22, name: "شلوار" , image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdPd4G77I7qxEWmfTUVtyiLSzw4zWo0fjkLw&s"},
            { id: 23, name: "کفش", image: "https://static.vecteezy.com/system/resources/previews/003/586/211/non_2x/casual-shoe-illustration-free-vector.jpg" },
            { id: 24, name: "اکسسوری", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt8xm7S5B_nioFgHh4f0iqiMh2jRkILmDzfg&s" },
        ],
    },
    {
        id: 3,
        name: "دیجیتال",
        subcategories: [
            { id: 31, name: "موبایل", image: "https://i.etsystatic.com/36262552/r/il/ba9883/4436017947/il_fullxfull.4436017947_1soy.jpg" },
            { id: 32, name: "لپ تاپ", image: "https://i.etsystatic.com/36867827/r/il/fa34b8/4146594208/il_570xN.4146594208_88fk.jpg" },
            { id: 33, name: "تبلت", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZWrmofsmuU-F0RDdvSLrhvts3pB_Zi0qWEw&s" },
            { id: 34, name: "ساعت هوشمند", image: "https://static.vecteezy.com/system/resources/previews/014/627/348/non_2x/gym-smartwatch-icon-simple-style-vector.jpg" },
        ],
    },
    {
        id: 4,
        name: "زیبایی و سلامت",
        subcategories: [
            { id: 41, name: "لوازم آرایشی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnBN_96FBJX8hZTmyhMOFbb8AyW9a-jkRAptWYh5qJdY_BzmJk9c32J77zOHubYumigcE&usqp=CAU" },
            { id: 42, name: "مراقبت پوست", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShYK2so6MR6WayeIsla8GH1nWxTR9yFEb8lafXpCejtDbjT2teK2bz2utDAwgu4t-Ydhs&usqp=CAU" },
            { id: 43, name: "عطر", image: "https://t4.ftcdn.net/jpg/04/63/40/43/360_F_463404380_5v0VnwOKizj7oMj2VlcLaV7cus1OSARX.jpg" },
            { id: 44, name: "مراقبت مو", image: "https://static.vecteezy.com/system/resources/previews/048/962/420/non_2x/hair-line-icon-follicle-curls-hair-follicle-growth-injection-treatment-loss-transplant-removal-recovery-tip-section-care-skin-acne-pores-health-beauty-therapy-medical-vector.jpg" },
        ],
    },
    {
        id: 5,
        name: "ورزش و سفر",
        subcategories: [
            { id: 51, name: "دوچرخه", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWNWzfAus9m_HjbgO1p4_grAAi21P87JveHpj4XU_HXPHniJwCBsGPqDELXvrkaIkdkO4&usqp=CAU" },
            { id: 52, name: "چمدان", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmJdaqGPcxadojmvXLyX1El3ojdEeN4Idbw8lywOKUS-VrrwlqIR3psGFDkmMF1O-AHw&usqp=CAU" },
            { id: 53, name: "کفش ورزشی", image: "https://static.vecteezy.com/system/resources/previews/024/118/255/non_2x/sneakers-sports-shoes-shoes-for-running-graphic-boots-vector.jpg" },
            { id: 54, name: "تجهیزات کوهنوردی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRSAE4MoPL-ewWihoj9CCpEQO7hePIrdp-1g&s" },
        ],
    },
    {
        id: 6,
        name: "کتاب و لوازم تحریر",
        subcategories: [
            { id: 61, name: "کتاب داستان", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBA6u5ECTQYQrGQIpDPXIMte6ZQD51NXYylA&s" },
            { id: 62, name: "کتاب آموزشی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGq_IMP8nw95AMprbRPgZfl-nT8csPW5IBZQ&s" },
            { id: 63, name: "دفتر", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuSQWMz5o-qbSACjA681VIZdAqyQy7z_lWmg&s" },
            { id: 64, name: "نوشت‌افزار", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWJ_IKKB4kvsUQ7tuWibDLoqVCiCQ-wLsZSVknh8k45ENSI42hDd2mIofs2LMD-wjy2qc&usqp=CAU" },
        ],
    },
    {
        id: 7,
        name: "کودک و نوزاد",
        subcategories: [
            { id: 71, name: "لباس کودک", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDp7EisU8M9ofUAyQP1pcp5E1Td8N9tos_IA&s" },
            { id: 72, name: "اسباب بازی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDLZQZ-ZKLL9Fg18a9CDYVrIFy49pVVVAuI9pHIF5bECeKOxFPUkvzW7Q5CZ6Ar32ix6U&usqp=CAU" },
            { id: 73, name: "لوازم بهداشتی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXWvZaD2A9TEVVE0GuayCtgVj3Y4VWHtEJ472yNCDDqu9b_DGCKyBoQ07IqUOIo8HMdJI&usqp=CAU" },
            { id: 74, name: "کالسکه", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE3EDioRbQVUKkh9iK36jceo9I2j1QjB68YePbwwvjmJAUWnU9SCojzQ3KvTNZGyIu6Ng&usqp=CAU" },
        ],
    },
    {
        id: 8,
        name: "ابزارآلات صنعتی",
        subcategories: [
            { id: 81, name: "دریل", image: "https://i.etsystatic.com/18154652/r/il/24f358/5245295870/il_570xN.5245295870_12zz.jpg" },
            { id: 82, name: "پیچ گوشتی برقی", image: "https://png.pngtree.com/png-vector/20191124/ourmid/pngtree-electric-screwdriver-drill-icon-simple-png-image_2018211.jpg" },
            { id: 83, name: "اره برقی", image: "https://www.creativefabrica.com/wp-content/uploads/2021/05/06/1620286107/Chainsaw-black-580x386.jpg" },
            { id: 84, name: "ابزار دستی", image: "https://static.vecteezy.com/system/resources/previews/026/455/564/non_2x/pliers-icon-isolated-on-white-background-vector.jpg" },
        ],
    },
    {
        id: 9,
        name: "خودرو و موتورسیکلت",
        subcategories: [
            { id: 91, name: "لوازم یدکی خودرو", image: "https://static.vecteezy.com/system/resources/previews/000/157/159/non_2x/car-spare-part-icons-vector.jpg" },
            { id: 92, name: "موتورسیکلت", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV0XmUeU7I3YwX92PahY09lPls4MlLfruSGA&s" },
            { id: 93, name: "روغن و فیلتر", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAkjfGvr1aXi6AbF87SLbTDniQT6U6vkq0bA&s" },
            { id: 94, name: "تجهیزات جانبی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEvXvw_1pEpc2hpUzC1R3IKBPGkIc12KBcJA&s" },
        ],
    },
    {
        id: 10,
        name: "خوراک و نوشیدنی",
        subcategories: [
            { id: 101, name: "نوشیدنی‌ها", image: "https://www.vectorkhazana.com/assets/images/products/silhouette-of-a-drink.jpg" },
            { id: 102, name: "شیرینی و شکلات", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-KGtP6a1H6avhDhkZaSW6lOp6SmdZW-N_mPIOkJ4S9P96DkR-9yDLWgPE0vsWedHT4-Y&usqp=CAU" },
            { id: 103, name: "میوه و سبزی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTihr8G_fBKO--f2tno1Z33c_vJTlFgxWBQXOgnLiyq3TDWKbcVUttUy-tmq3Umnx95djI&usqp=CAU" },
            { id: 104, name: "محصولات لبنی", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD5IWXWziZY2ab5RhIOyQc4fW4IV4qDP9fHw&s" },
        ],
    },
];
