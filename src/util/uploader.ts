export const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Create this in Cloudinary settings
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/6d207e02198a847aa98d0a2a901485a5/image/upload`,
      { method: 'POST', body: formData }
    );
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};