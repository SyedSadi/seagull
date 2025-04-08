export const ImageUploader = async (image) => {
  // File validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (image.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(image.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG and WEBP are allowed.");
  }
  
  const formData = new FormData();
  formData.append("image", image);

  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.data.url;
    } else {
      console.error("Upload failed:", data);
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};