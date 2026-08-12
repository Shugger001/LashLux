import { GalleryManager } from "@/components/admin/gallery-manager";
import { getAdminGallery } from "@/lib/admin-data";

export default async function GalleryPage() {
  const items = await getAdminGallery();
  return <GalleryManager initialItems={items} />;
}
