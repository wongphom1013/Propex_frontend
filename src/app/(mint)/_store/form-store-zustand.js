import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define initial state
const initialPropertyForm = {
  propertyType: "",
  furnishingType: "",
  propertyDescription: "",
  landArea: "",
  buildingSize: "",
  numberOfBedrooms: "",
  numberOfBathrooms: "",
  startDateOfLease: "",
  endDateOfLease: "",
  sellingPrice: "",
  amenities: [],
  thumbnail: {
    url: "",
    public_id: "",
    fileName: "",
    mimeType: "",
    fileHash: ""
  },
  images: []
};

const initialOwnershipForm = {
  documentPdf: {
    url: "",
    public_id: "",
    fileName: "",
    mimeType: "",
    fileHash: ""
  },
  spptPBB: {
    url: "",
    public_id: "",
    fileName: "",
    mimeType: "",
    fileHash: ""
  },
  ownerIdentityCard: {
    url: "",
    public_id: "",
    fileName: "",
    mimeType: "",
    fileHash: ""
  },
  ownerFamilyCard: {
    url: "",
    public_id: "",
    fileName: "",
    mimeType: "",
    fileHash: ""
  },
  ownerType: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhoneNumber: ""
};

const slugMappings = {
  propertyType: 'property_type_tier_two',
  furnishingType: 'furnishing_type_tier_two',
  propertyDescription: 'property_description_tier_two',
  landArea: 'land_area_tier_two',
  buildingSize: 'building_size_tier_two',
  numberOfBedrooms: 'number_of_bedrooms_tier_two',
  numberOfBathrooms: 'number_of_bathrooms_tier_two',
  startDateOfLease: 'start_date_of_lease_tier_two',
  endDateOfLease: 'end_date_of_lease_tier_two',
  sellingPrice: 'selling_price_tier_two',
  amenities: 'amenities_tier_two',
  thumbnail: 'thumbnail_tier_two',
  images: 'images_tier_two',
  documentType: 'document_type_tier_two',
  documentPdf: 'document_pdf_tier_two',
  spptPBB: 'sppt_pbb_tier_two',
  ownerIdentityCard: 'owner_identity_card_tier_two',
  ownerFamilyCard: 'owner_family_card_tier_two',
  ownerType: 'owner_type_tier_two',
  ownerName: 'owner_name_tier_two',
  ownerEmail: 'owner_email_tier_two',
  ownerPhoneNumber: 'owner_phone_number_tier_two'
};

export const useFormsStore = create(
  persist(
    (set, get) => ({
      formStep: 'landingPage',
      formModalOpen: false,
      nftModalOpen: false,
      propertyFormZustand: initialPropertyForm,
      userHasStartedRWAForm: true,
      ownershipFormZustand: initialOwnershipForm,
      formSlugList: slugMappings,
      amenitiesOption: [
        { id: 1, name: 'Private Pool', src: '/assets/icons/amenities/pool-ladder.svg', selected: false },
        { id: 2, name: 'Shared Pool', src: '/assets/icons/amenities/shared-pool.svg', selected: false },
        { id: 3, name: 'Kitchen', src: '/assets/icons/amenities/kitchen.svg', selected: false },
        { id: 4, name: 'Carport', src: '/assets/icons/amenities/carport.svg', selected: false },
        { id: 5, name: 'Garage', src: '/assets/icons/amenities/garage.svg', selected: false },
        { id: 6, name: 'Bathtub', src: '/assets/icons/amenities/bathtub.svg', selected: false },
        { id: 7, name: 'Shower', src: '/assets/icons/amenities/shower.svg', selected: false },
        { id: 8, name: 'Jacuzzi', src: '/assets/icons/amenities/jacuzzi.svg', selected: false },
        { id: 9, name: '24H Security', src: '/assets/icons/amenities/24-hours-protection.svg', selected: false },
        { id: 10, name: 'CCTV', src: '/assets/icons/amenities/cctv.svg', selected: false },
        { id: 11, name: 'Laundry', src: '/assets/icons/amenities/laundry.svg', selected: false },
        { id: 12, name: 'Smart TV', src: '/assets/icons/amenities/smart-tv.svg', selected: false },
      ],
      
      // Points related state
      points: 0,
      pointsActivity: [],
      hasSelectedOptions: {
        ownerType: false,
        propertyType: false,
        furnishingType: false,
        numberOfBedrooms: false,
        numberOfBathrooms: false
      },

      // ================ Setters ==================
      // Generalized setter for both propertyForm and ownershipFormZustand
      updateFormField: (formType, id, value) => {
        set((state) => {
          const updatedForm = { ...state[formType], [id]: value };
          return { [formType]: updatedForm };
        });
      },

      // Specific setter for propertyForm
      setPropertyFormZustand: (id, value) => {
        const { updateFormField } = get();
        updateFormField('propertyFormZustand', id, value);
      },

      // Specific setter for ownershipFormZustand
      setOwnershipFormZustand: (id, value) => {
        const { updateFormField } = get();
        updateFormField('ownershipFormZustand', id, value);
      },

      setAllOwnershipFormZustand: (newData) => {
        set({ ownershipFormZustand: newData });
      },

      // Inside your store (useFormsStore)
      setHasSelectedOptions: (id, status) => {
        set(state => ({
          ...state,
          hasSelectedOptions: {
            ...state.hasSelectedOptions,
            [id]: status,
          },
        }));
      },


      setPropertyFormPoint: (points) => set({ propertyFormPoint: points }),
      setFormAddedPoint: (points) => set({ formAddedPoint: points }),
      setUserHasStartedRWAForm: (started) => set({ userHasStartedRWAForm: started }),
      setPoints: (points) => set({ points }),
      
      // Points management
      addPointsActivity: (name, slug, pointsAdded) => {
        const { pointsActivity } = get();
        const activityExists = pointsActivity.some(activity => activity.slug === slug);
        if (!activityExists) {
          set(state => ({
            pointsActivity: [...state.pointsActivity, { name, slug, pointsAdded }],
            points: state.points + pointsAdded,
          }));
        }
      },
      removePointsActivity: (slug) => {
        const { pointsActivity } = get();
        const activity = pointsActivity.find(activity => activity.slug === slug);
        if (activity) {
          set(state => ({
            pointsActivity: pointsActivity.filter(activity => activity.slug !== slug),
            points: state.points - activity.pointsAdded,
          }));
        }
      },

      // Amenity management
      addAmenity: (amenity) => set(state => ({
        amenitiesOption: [...state.amenitiesOption, amenity]
      })),
      removeAmenity: (id) => set(state => ({
        amenitiesOption: state.amenitiesOption.filter(amenity => amenity.id !== id)
      })),
      toggleAmenity: (id) => set(state => ({
        amenitiesOption: state.amenitiesOption.map(amenity =>
          amenity.id === id ? { ...amenity, selected: !amenity.selected } : amenity
        )
      })),

      // Reset state
      reset: () => set({
        propertyFormZustand: initialPropertyForm,
        userHasStartedRWAForm: true,
        ownershipFormZustand: initialOwnershipForm,
        amenitiesOption: [
          { id: 1, name: 'Private Pool', src: '/assets/icons/amenities/pool-ladder.svg', selected: false },
          { id: 2, name: 'Shared Pool', src: '/assets/icons/amenities/shared-pool.svg', selected: false },
          { id: 3, name: 'Kitchen', src: '/assets/icons/amenities/kitchen.svg', selected: false },
          { id: 4, name: 'Carport', src: '/assets/icons/amenities/carport.svg', selected: false },
          { id: 5, name: 'Garage', src: '/assets/icons/amenities/garage.svg', selected: false },
          { id: 6, name: 'Bathtub', src: '/assets/icons/amenities/bathtub.svg', selected: false },
          { id: 7, name: 'Shower', src: '/assets/icons/amenities/shower.svg', selected: false },
          { id: 8, name: 'Jacuzzi', src: '/assets/icons/amenities/jacuzzi.svg', selected: false },
          { id: 9, name: '24H Security', src: '/assets/icons/amenities/24-hours-protection.svg', selected: false },
          { id: 10, name: 'CCTV', src: '/assets/icons/amenities/cctv.svg', selected: false },
          { id: 11, name: 'Laundry', src: '/assets/icons/amenities/laundry.svg', selected: false },
          { id: 12, name: 'Smart TV', src: '/assets/icons/amenities/smart-tv.svg', selected: false },
        ],
        hasSelectedOptions: {
          ownerType: false,
          propertyType: false,
          furnishingType: false,
          numberOfBedrooms: false,
          numberOfBathrooms: false
        },
        points: 0,
        pointsActivity: []
      }),
      resetAmenities: () => set({
        amenitiesOption: [
          { id: 1, name: 'Private Pool', src: '/assets/icons/amenities/pool-ladder.svg', selected: false },
          { id: 2, name: 'Shared Pool', src: '/assets/icons/amenities/shared-pool.svg', selected: false },
          { id: 3, name: 'Kitchen', src: '/assets/icons/amenities/kitchen.svg', selected: false },
          { id: 4, name: 'Carport', src: '/assets/icons/amenities/carport.svg', selected: false },
          { id: 5, name: 'Garage', src: '/assets/icons/amenities/garage.svg', selected: false },
          { id: 6, name: 'Bathtub', src: '/assets/icons/amenities/bathtub.svg', selected: false },
          { id: 7, name: 'Shower', src: '/assets/icons/amenities/shower.svg', selected: false },
          { id: 8, name: 'Jacuzzi', src: '/assets/icons/amenities/jacuzzi.svg', selected: false },
          { id: 9, name: '24H Security', src: '/assets/icons/amenities/24-hours-protection.svg', selected: false },
          { id: 10, name: 'CCTV', src: '/assets/icons/amenities/cctv.svg', selected: false },
          { id: 11, name: 'Laundry', src: '/assets/icons/amenities/laundry.svg', selected: false },
          { id: 12, name: 'Smart TV', src: '/assets/icons/amenities/smart-tv.svg', selected: false },
        ],
      })
    }),
    {
      name: 'form-store',
    }
  )
);
