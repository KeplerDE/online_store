import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST function to upload an image
export async function POST(req) {
  try {
    const { image } = await req.json();
    const result = await cloudinary.uploader.upload(image);

    return NextResponse.json({
      public_id: result.public_id,
      secure_url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.error("Image upload failed", 500);
  }
}

// PUT function to delete an image
export async function PUT(req) {
  try {
    const { public_id } = await req.json();
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.error("Image deletion failed", 500);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.error("Image deletion failed", 500);
  }
}
