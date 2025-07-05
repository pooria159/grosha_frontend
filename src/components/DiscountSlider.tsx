import { FaArrowLeft } from "react-icons/fa";

interface Product {
    id: number;
    image: string;
    discount: number;
}

const products: Product[] = [
    { id: 1, image: "https://dkstatics-public.digikala.com/digikala-products/08fc8b3b516f29285680a9a313465a6a1095670b_1718535521.jpg", discount: 40 },
    { id: 2, image: "https://dkstatics-public.digikala.com/digikala-products/7b039f1fee501420cab194939b5d7b043c4be8c0_1687169951.jpg", discount: 40 },
    { id: 3, image: "https://dkstatics-public.digikala.com/digikala-products/bd41549465c340158eb48dcd8f373492fe31f1dc_1695714651.jpg", discount: 41 },
    { id: 4, image: "https://dkstatics-public.digikala.com/digikala-products/acb34627099ca60e87114c909306f9cb8731c0d0_1638718245.jpg", discount: 50 },
    { id: 5, image: "https://dkstatics-public.digikala.com/digikala-products/988ba68a51b40872314a7e711f73346b8608747f_1695128484.jpg", discount: 50 },
    { id: 6, image: "https://dkstatics-public.digikala.com/digikala-products/bc69b51e405e0157a1be433cac01d4c7f856755f_1617794136.jpg", discount: 55 },
];

const DiscountSlider: React.FC = () => {
    return (
        <div className="bg-gray-300 p-4 rounded-xl flex items-center justify-between">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center">
                <FaArrowLeft className="ml-2" />
                بیش از 100 کالا
            </button>

            <div className="bg-yellow-400 text-white text-lg font-bold px-4 py-2 rounded-lg">
                🎉 تخفیف‌های شگفت‌انگیز امروز! 🎉
            </div>

            <div className="flex gap-2">
                {products.map((product) => (
                    <div key={product.id} className="relative">
                        <img
                            src={product.image}
                            alt={`Product ${product.id}`}
                            className="w-16 h-16 object-cover rounded-full border"
                        />
                        <span className="absolute bottom-0 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            {product.discount}٪
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscountSlider;
