import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import Brands from "../components/Brands";
import DiscountedProducts from "../components/DiscountedProducts";
import BestSellingProducts from "../components/BestSellingProducts";
import Collection from "../components/Collection";
import DiscountSlider from "../components/DiscountSlider";
import Collection2 from "../components/Collection2";
import HotProducts from "../components/HotProducts";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Home: React.FC = () => {
    const user = localStorage.getItem("user");
    const controls = useAnimation();
    const [ref, inView] = useInView();
    
    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const fadeInVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex flex-col overflow-x-hidden">
            <Header />
            
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-blue-700"
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-30"></div>
                        <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5fef5619b640934b33c2385e/5fef584b4ef0715b9e84f915_noise.png')] opacity-10"></div>
                    </div>
                </div>

                <div className="container mx-auto px-4 pt-64 pb-32 relative z-10">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {user ? `خوش آمدید، ${user}` : "!به فروشگاه ما خوش آمدید"}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
                        >
                            جدیدترین محصولات با بهترین کیفیت و قیمت را از ما بخواهید
                        </motion.p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 right-0 h-24 origin-left"
                    style={{ clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0% 100%)' }}
                ></motion.div>
            </motion.section>

            <main className="flex-grow">
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-28"
                    >
                        <Slider />
                    </motion.div>

                    <motion.div
                        ref={ref}
                        initial="hidden"
                        animate={controls}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 my-20"
                    >
                        {[
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ),
                                title: "ضمانت کیفیت",
                                desc: "تمامی محصولات با ضمانت کیفیت و اصالت کالا ارائه می‌شوند."
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                ),
                                title: "تحویل سریع",
                                desc: "ارسال سریع و به موقع به سراسر کشور در کوتاه‌ترین زمان ممکن."
                            },
                            {
                                icon: (
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                    </svg>
                                ),
                                title: "پرداخت امن",
                                desc: "پرداخت آنلاین با امنیت کامل و پشتیبانی چند مرحله‌ای."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="p-4 rounded-xl bg-opacity-20 mr-4" 
                                            style={{ 
                                                backgroundColor: index === 0 ? 'rgba(37, 99, 235, 0.1)' : 
                                                               index === 1 ? 'rgba(5, 150, 105, 0.1)' : 
                                                                           'rgba(124, 58, 237, 0.1)' 
                                            }}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Collection />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="my-20"
                    >
                        <DiscountSlider />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Categories />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="my-20"
                    >
                        <Collection2 />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 my-20 text-white overflow-hidden relative"
                    >
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500 rounded-full opacity-10"></div>
                        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-indigo-500 rounded-full opacity-10"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-8 md:mb-0 text-center md:text-right">
                                    <motion.h3 
                                        initial={{ x: -30, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.6 }}
                                        viewport={{ once: true }}
                                        className="text-3xl font-bold mb-3"
                                    >
                                        عضویت در خبرنامه
                                    </motion.h3>
                                    <motion.p
                                        initial={{ x: -30, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        viewport={{ once: true }}
                                        className="text-blue-100 max-w-md"
                                    >
                                        از جدیدترین تخفیف‌ها و محصولات با خبر شوید
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ x: 30, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="flex w-full md:w-auto"
                                >
                                    <input 
                                        type="email" 
                                        placeholder="آدرس ایمیل شما" 
                                        className="px-6 py-4 rounded-r-2xl w-full md:w-80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                    />
                                    <button className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-medium px-8 py-4 rounded-l-2xl transition-colors duration-300 flex items-center">
                                        <span>عضویت</span>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Brands />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="my-20"
                    >
                        <DiscountedProducts />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <HotProducts />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="my-20"
                    >
                        <BestSellingProducts />
                    </motion.div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Home;