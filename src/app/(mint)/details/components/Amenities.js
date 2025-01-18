const { default: SvgIcon } = require("@/app/_components/utils/SvgIcon");
const { useFormsStore } = require("../../_store/form-store-zustand");

function Amenities({ nftDetail }) {
    const { amenitiesOption } = useFormsStore();
  
    const nftAmenities = nftDetail?.deedsData?.amenities || [];

    const filteredAmenities = amenitiesOption.filter((amenity) =>
      nftAmenities?.includes(amenity.name)
    );

    if(nftAmenities.length === 0) return null;
  
    return (
      <div className="w-full mt-4">
        <div className="p-6 border border-black/10 rounded-xl">
          <h2 className="text-lg font-semibold">Amenities</h2>
          { filteredAmenities.length === 0 && 
              <div className="font-urbanist text-black text-base w-full mt-4">
                <p>There are no amenities selected for this property.</p>
              </div>
          }
          {
            filteredAmenities.length !== 0 &&
            <div className="mt-6 grid grid-cols-4 gap-6 py-2 w-full max-w-[600px] justify-items-center">
            {
              filteredAmenities.map((amenity) => (
                <div key={amenity.id} className="flex flex-col items-center gap-2">
                  <SvgIcon src={amenity.src} className="size-8 bg-neutral-600" />
                  <p className="text-sm text-neutral-600 text-center">{amenity.name}</p>
                </div>
              ))
            }
          </div>
          }
        </div>
      </div>
    );
  }

  export default Amenities