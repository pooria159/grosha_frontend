import React from "react";
import { Link } from "react-router-dom";

const Categories: React.FC = () => {
  const categories = [
    { id: 1, name: "الکترونیک", image: "https://dkstatics-public.digikala.com/digikala-mega-menu/151ec29bae111afd3b6a0e71cec5c4c26f1c3014_1740299456.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" },
    { id: 2, name: "مد و پوشاک", image: "https://dkstatics-public.digikala.com/digikala-mega-menu/b3d4eaefebe67ab8d849296ea2e7e113cde8094c_1740299538.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" },
    { id: 3, name: "خانه و آشپزخانه", image: "https://dkstatics-public.digikala.com/digikala-mega-menu/8a042388b93c5116604f35092a1fb35f8f0756be_1740299467.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" },
    { id: 4, name: "کالاهای سوپرمارکتی", image: "https://dkstatics-public.digikala.com/digikala-mega-menu/7adb0cc6edc18a6d04b9ba3bdd424b1bcce47848_1740299618.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" },
    { id: 5, name: "کتاب و لوازم تحریر", image: "https://dkstatics-public.digikala.com/digikala-mega-menu/0cdf9c404e509371c3177a334be948a7e500419c_1740299574.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80" },
  ];

  return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-8">
        {categories.map((category) => (
            <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img src={category.image} alt={category.name} className="w-16 h-16 mb-2 rounded-full" />
              <span className="text-sm text-center">{category.name}</span>
            </Link>
        ))}
      </div>
  );
};

export default Categories;
