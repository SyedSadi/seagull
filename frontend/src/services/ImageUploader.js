export const ImageUploader = async (image) => {
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