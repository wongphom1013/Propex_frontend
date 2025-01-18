import React, { useState, useRef, useEffect } from 'react';
import Carousel from 'react-gallery-carousel';
import 'react-gallery-carousel/dist/index.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import Image from 'next/image';

const ImageGallery = ({ nftDetail }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const modalRef = useRef(null);
    const carouselRef = useRef(null);
    const images = nftDetail?.deedsData?.generalImages || [];
    const showSeeAllButton = images.length > 4;

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const displayImages = showSeeAllButton ? images.slice(0, 4) : images;

    if (nftDetail.tier !== 2 || images.length === 0) return null;

    return (
        <>
            <div className={`lg:flex-1 grid grid-cols-2 gap-5 h-[32rem] lg:h-auto`}>
                {displayImages.map((image, index) => (
                    <div
                        key={index}
                        className="w-full h-full bg-neutral-100 rounded-xl relative overflow-hidden cursor-pointer"
                        onClick={showSeeAllButton ? openModal : null}
                    >
                        <Image
                            src={image.url}
                            alt={image.fileName || 'general image'}
                            className="w-full h-full object-cover rounded-lg"
                            fill
                            sizes="400px"
                        />
                    </div>
                ))}
            </div>
            {showSeeAllButton && (
                <div
                    className="absolute bottom-5 right-5 bg-white rounded-lg px-5 py-2 gap-2 flex items-center border border-neutral-900 cursor-pointer"
                    onClick={openModal}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.9961 18H12.0051"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18 18H18.009"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6 18H6.00898"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M11.9961 12H12.0051"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 6H12.009"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18 12H18.009"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18 6H18.009"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6 12H6.00898"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6 6H6.00898"
                            stroke="#00272C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className="text-xs font-semibold">See All ({images.length})</p>
                </div>
            )}

            {modalIsOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
                    <div
                        ref={modalRef}
                        className="relative bg-white p-4 rounded-lg max-w-4xl w-full h-40-screen lg:h-60-screen flex flex-col justify-center items-center"
                    >
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <Carousel
                                images={images.map((image) => ({ src: image.url }))}
                                ref={carouselRef}
                                style={{ borderRadius: '20px' }}
                                hasThumbnails={true}
                                hasMediaButton={false}
                                shouldLazyLoad={true}
                                transitionDuration={500}
                                isLoop={true}
                                hasLeftButton={false}
                                hasRightButton={false}
                            />
                            <button
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lemongrass bg-mossgreen rounded-full p-2"
                                onClick={() => carouselRef.current.goLeft()}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lemongrass bg-mossgreen rounded-full p-2"
                                onClick={() => carouselRef.current.goRight()}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;
