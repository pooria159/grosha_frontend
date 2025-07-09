import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const CategoryMenu: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();

        window.addEventListener("resize", checkIfMobile);

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMouseEnter = () => {
        if (isMobile) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowMenu(true);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        timeoutRef.current = setTimeout(() => {
            setShowMenu(false);
        }, 200);
    };

    const handleToggleMenu = () => {
        if (!isMobile) return;
        setShowMenu(!showMenu);
    };

    const handleSubcategoryClick = (subcategoryName: string) => {
        const urlFriendlyName = subcategoryName;
        navigate(`/subcategory-products/${urlFriendlyName}`);
        setShowMenu(false);
    };

    return (
        <div
            className="relative inline-block text-right"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={menuRef}
        >
            <button 
                className="flex items-center gap-1 hover:text-[#FDC500] transition-colors"
                onClick={handleToggleMenu}
                aria-expanded={showMenu}
                aria-label="دسته‌بندی‌ها"
            >
                دسته‌بندی‌ها
                <span className={`inline-block transform text-sm transition-transform ${showMenu ? 'rotate-180' : 'rotate-90'}`}>▶</span>
            </button>

            {showMenu && (
                <div className={`
                    absolute top-full mt-2 right-1/2 translate-x-1/2 
                    bg-white text-black rounded-xl shadow-2xl z-30 p-4 
                    ${isMobile ? 'w-[90vw] max-h-[70vh] overflow-auto' : 'grid grid-cols-3 gap-4 min-w-[700px] max-w-[90vw] max-h-[250px] overflow-auto'}
                    text-right border border-gray-200
                `}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className={isMobile ? 'mb-4' : ''}>
                            <div className="font-semibold text-[#00296B] mb-1">{cat.name}</div>
                            <ul className={`${isMobile ? 'space-y-2' : 'space-y-0.5'} text-sm leading-5`}>
                                {cat.subcategories.map((sub, i) => (
                                    <li
                                        key={i}
                                        className="hover:text-[#FDC500] transition-colors cursor-pointer pr-2 py-1"
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