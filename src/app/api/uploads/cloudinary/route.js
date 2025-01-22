"use server";
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto-js";
import https from "https";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUD_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_KEY;
const CLOUD_API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_API_SECRET;

// export async function GET(request) {
//     try {
//         const url = new URL(request.url);
//         const publicId = url.searchParams.get('publicId');

//       const response = await axios.get(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/${public_id}`,
//         {
//           auth: {
//             username: API_KEY,
//             password: API_SECRET
//           }
//         }
//       );

//       return NextResponse.json(response.data);
//     } catch (error) {
//       console.error('Error fetching file details:', error);
//       return NextResponse.json({
//         statusCode: 500,
//         message: 'An error occurred while fetching file details.'
//       });
//     }
//   }

// POST method
// export async function POST(request) {
//     // Create a new instance of formidable
//     const form = new formidable.IncomingForm();

//     // Parse the incoming form data
//     form.parse(request, async (err, fields, files) => {
//       if (err) {
//         return NextResponse.json({ statusCode: 500, message: 'Error parsing form data.' });
//       }

//       // Get the uploaded file
//       const file = files.file[0]; // Assuming single file upload

//       if (!file) {
//         return NextResponse.json({ statusCode: 400, message: 'No file provided.' });
//       }

//       // Determine the upload preset and endpoint based on file type
//       const isPdf = file.mimetype === 'application/pdf';
//       const uploadPreset = isPdf ? 'propex_pdf' : 'propex';
//       const uploadEndpoint = isPdf
//         ? `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/raw/upload`
//         : `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`;

//       try {
//         // Prepare the form data to send to Cloudinary
//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(file.filepath)); // Read file from temp path
//         formData.append('upload_preset', uploadPreset);

//         const response = await axios.post(uploadEndpoint, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });

//         console.log(response.data, '< repsonse')

//         const { secure_url, public_id } = response.data;

//         return NextResponse.json({ secure_url, public_id });
//       } catch (error) {
//         console.error('Error uploading file:', error);

//         if (error.response && error.response.data.error.message.includes('File size too large')) {
//           return NextResponse.json({
//             statusCode: 500,
//             message: 'File size is too large. Maximum allowed size is 10MB.'
//           });
//         }

//         return NextResponse.json({
//           statusCode: 500,
//           message: 'Error uploading file to Cloudinary.'
//         });
//       }
//     });
//   }

export async function DELETE(request) {
  try {
    // Extract the publicId from the request body
    const { publicId } = await request.json();
    console.log(publicId);

    // Generate the timestamp
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate the signature
    const signature = generateSignature(publicId, timestamp);

    // Prepare form data for the request
    const formData = new URLSearchParams();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("api_key", CLOUD_API_KEY);
    formData.append("timestamp", timestamp);

    // Make the delete request to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      formData,
      new https.Agent({ rejectUnauthorized: false })
    );

    return NextResponse.json({ data: response.data });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({
      statusCode: 500,
      message: "An error occurred while deleting the file.",
    });
  }
}

function generateSignature(publicId, timestamp) {
  // Create the string to sign
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUD_API_SECRET}`;

  // Generate the signature
  const signature = crypto.SHA256(stringToSign).toString(crypto.enc.Hex);
  return signature;
}
