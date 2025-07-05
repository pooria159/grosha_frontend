export interface Product {
    stock: number;
    id: number;
    name: string;
    price: number;
    brand: string;
    category: string;
    subcategory: string;
    image: string;
    rating: number;
}

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "یخچال ساید بای ساید سامسونگ 25 فوت",
        price: 25000000,
        brand: "سامسونگ",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge1.jpg",
        rating: 4.5,
    },
    {
        id: 2,
        name: "یخچال فراست فری ال جی 18 فوت",
        price: 18000000,
        brand: "ال جی",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge2.jpg",
        rating: 4.2,
    },
    {
        id: 3,
        name: "یخچال ساده دو درب هیمالیا",
        price: 12000000,
        brand: "هیمالیا",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge3.jpg",
        rating: 3.9,
    },
    {
        id: 4,
        name: "یخچال آمریکایی بوش",
        price: 32000000,
        brand: "بوش",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge4.jpg",
        rating: 4.7,
    },
    {
        id: 5,
        name: "یخچال ساید بای ساید دوو",
        price: 22000000,
        brand: "دوو",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge5.jpg",
        rating: 4.0,
    },
    {
        id: 6,
        name: "یخچال ساده تک درب پارس خزر",
        price: 9000000,
        brand: "پارس خزر",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge6.jpg",
        rating: 3.5,
    },
    {
        id: 7,
        name: "یخچال ساید بای ساید اسنوا",
        price: 28000000,
        brand: "اسنوا",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge7.jpg",
        rating: 4.3,
    },
    {
        id: 8,
        name: "یخچال فراست فری میندو",
        price: 15000000,
        brand: "میندو",
        category: "لوازم خانگی",
        subcategory: "یخچال",
        image: "https://example.com/fridge8.jpg",
        rating: 3.8,
    },
];