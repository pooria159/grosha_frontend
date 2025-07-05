import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const CategoryMenu: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowMenu(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowMenu(false);
        }, 200);
    };

    const handleSubcategoryClick = (subcategoryName: string) => {
        const urlFriendlyName = subcategoryName;
        navigate(`/subcategory-products/${urlFriendlyName}`);
    };

    return (
        <div
            className="relative inline-block text-right"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="flex items-center gap-1 hover:text-[#FDC500] transition-colors">
                دسته‌بندی‌ها
                <span className="inline-block transform rotate-90 text-sm">▶</span>
            </button>

            {showMenu && (
                <div className="absolute top-full mt-2 right-1/2 translate-x-1/2 bg-white text-black rounded-xl shadow-2xl z-30 p-4 grid grid-cols-3 gap-4 min-w-[700px] max-w-[90vw] max-h-[250px] overflow-auto text-right">
                    {categories.map((cat, idx) => (
                        <div key={idx}>
                            <div className="font-semibold text-[#00296B] mb-1">{cat.name}</div>
                            <ul className="space-y-0.5 text-sm leading-5">
                                {cat.subcategories.map((sub, i) => (
                                    <li
                                        key={i}
                                        className="hover:text-[#FDC500] transition-colors cursor-pointer pr-2"
                                        onClick={() => handleSubcategoryClick(sub.name)}
                                    >
                                        {sub.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryMenu;