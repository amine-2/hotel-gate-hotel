export function getRoomTypeImagePath(url) {
  if (!url) return null;

  try {
    const marker = "/storage/v1/object/public/room-types-imgs/";

    const index = url.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      url.slice(index + marker.length)
    );
  } catch (error) {
    console.error("getRoomTypeImagePath:", error);
    return null;
  }
}