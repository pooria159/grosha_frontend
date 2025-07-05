import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#00296B] text-white mt-8 py-6" style={{ direction: "rtl" }}>
            <div className="container mx-auto text-center px-4">
                <p className="text-lg mb-2">&copy; {new Date().getFullYear()} گروشا همه حقوق محفوظ است.</p>
                <p className="text-sm text-[#FDC500]">با ❤️ طراحی شده</p>
            </div>
        </footer>
    );
};

export default Footer;
