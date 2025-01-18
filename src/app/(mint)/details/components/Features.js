const { default: SvgIcon } = require("@/app/_components/utils/SvgIcon");

const featuresMaps = [
    {
      propertyName: "propertyType",
      src: "/assets/icons/features/building-icon.svg"
    },
    {
      propertyName: "numberOfBedrooms",
      src: "/assets/icons/features/bed-icon.svg"
    },
    {
      propertyName: "numberOfBathrooms",
      src: "/assets/icons/features/shower-icon.svg"
    },
    {
      propertyName: "landArea",
      src: "/assets/icons/features/land-area-icon.svg"
    },
    {
      propertyName: "buildingSize",
      src: "/assets/icons/features/resize-square-icon.svg"
    },
    {
      propertyName: "furnishType",
      src: "/assets/icons/features/sofa-furnished-icon.svg"
    },
  ];

  const mapText = {
    "APARTMENT": "Apartment",
    "LAND": "Land",
    "VILLA": "Villa"
  }
  
  function Features({ nftDetail }) {
    const deedsData = nftDetail.deedsData;

    if(!deedsData) return null;
    return (
        <div className="mt-4">
            <div className="w-full flex items-center flex-wrap gap-4 font-urbanist font-medium text-[#222222] text-base">
                {featuresMaps.map((feature, idx) => {
                const value = deedsData[feature.propertyName];
                if (value !== null && value !== undefined && value !== '') {
                    let displayValue = value;
                    if (feature.propertyName === 'buildingSize' || feature.propertyName === 'landArea') {
                    displayValue = `${value} m²`;
                    }

                    if(feature.propertyName === 'propertyType') {
                      displayValue = mapText[deedsData.propertyType]
                    }
                    
                    return (
                    <div key={idx} className="flex items-center gap-2">
                        <SvgIcon src={feature.src} className="size-6 bg-black" />
                        <p className="capitalize">{displayValue}</p>
                    </div>
                    );
                }
                return null; 
                })}
            </div>
        </div>
    );
  }


  export default Features