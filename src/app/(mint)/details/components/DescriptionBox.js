import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

// Function to format the text
const formatText = (text) => {
    // Replace ** for bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace _ for italic
    formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');

    // Replace newlines (\n) with line breaks
    formattedText = formattedText.replace(/\n/g, '<br/>');

    return formattedText;
};



const DescriptionBox = ({ nftDetail }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const contentRef = useRef(null);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const checkOverflow = () => {
            if (contentRef.current) {
                setShowToggle(contentRef.current.scrollHeight > contentRef.current.clientHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [nftDetail]);

    const formattedDescription = formatText(nftDetail?.deedsData?.propertyDescription || '');

    return (
        <div className="p-6 border border-black/10 rounded-xl font-urbanist">
            <h2 className="text-lg font-semibold">Description</h2>
            {
                formattedDescription !== '' ?
                <div
                ref={contentRef}
                className={`mt-6 text-base text-[#222222] font-open-sauce transition-all duration-300 ease-in-out ${
                    isExpanded ? 'line-clamp-none' : 'line-clamp-4'
                }`}
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: isExpanded ? 'unset' : 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
            ></div> : <div>
                {nftDetail?.metadata?.description}.
            </div>
            }
            {showToggle && (
                <button
                    className="mt-4 text-sm flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={toggleExpanded}
                >
                    {isExpanded ? 'View Less' : 'View More'}
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
            )}
        </div>
    );
};

export default DescriptionBox;
