import dayjs from "dayjs";

// function to trim name, only return in this format firstletter, 4 asterick, last letters. eg: y***_
export function trimName(name) {

    if(!name) return null;
    if (name.length < 2) {
      return name; // If name is too short, return it as is
    }
  
    const firstLetter = name[0];
    const lastLetter = name[name.length - 1];
    const asterisks = '****'; // Four asterisks
  
    return `${firstLetter}${asterisks}${lastLetter}`;
  }
  
  // Function to trim address, only return first 6 letter, ..., and 4 last letter
export function trimAddress(address) {
    if(!address) return null;
    if (address.length <= 10) {
      return address; // If address is too short, return it as is
    }
  
    const firstPart = address.substring(0, 6);
    const lastPart = address.slice(-4); // Last 4 characters
    const ellipses = '...';
  
    return `${firstPart}${ellipses}${lastPart}`;
  }

export function formatTimestamp(timestamp) {
    return dayjs(timestamp).format("MMMM D, YYYY, h:mm A");
  }
  