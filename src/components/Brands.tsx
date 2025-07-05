import React from 'react';

const Brands: React.FC = () => {
    const brands = [
        { id: 1, name: 'برند ۱', image: 'https://dkstatics-public.digikala.com/digikala-brands/2c36ceb629598fa31b9b321fcd4e47773bd93ef7_1649498016.png?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80', link: '#' },
        { id: 2, name: 'برند ۲', image: 'https://dkstatics-public.digikala.com/digikala-brands/1313.png?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80', link: '#' },
        { id: 3, name: 'برند ۳', image: 'https://dkstatics-public.digikala.com/digikala-brands/3960.jpg?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80', link: '#' },
        { id: 4, name: 'برند ۴', image: 'https://dkstatics-public.digikala.com/digikala-brands/960dc4b74e21a9d33d594a161386179b26b3a68a_1606823783.png?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80', link: '#' },
        { id: 5, name: 'برند ۵', image: 'https://dkstatics-public.digikala.com/digikala-brands/5a10ae95eb42fc96906c8062563b28062668d418_1722238640.png?x-oss-process=image/resize,m_lfit,h_160,w_160/quality,q_80', link: '#' },
    ];

    return (
        <div className="my-8">
            <div className="flex justify-between items-center">
                <div className="flex-1"></div>
                <h2 className="text-2xl font-bold mb-4">برندهای محبوب</h2>
            </div>
            <div className="flex justify-between items-center gap-4 overflow-x-auto py-4">
                {brands.slice().reverse().map((brand) => (
                    <a
                        key={brand.id}
                        href={brand.link}
                        className="flex-shrink-0 flex flex-col items-center"
                        style={{ minWidth: '120px' }}
                    >
                        <div className="bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                            <img src={brand.image} alt={brand.name} className="w-32 h-32 rounded-full object-cover" />
                        </div>
                        <span className="text-sm mt-2 text-center">{brand.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Brands;
