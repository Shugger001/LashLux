import { ContentPageSkeleton } from "@/components/ui/page-skeletons";

export default function Loading() {
  return (
    <ContentPageSkeleton
      cards={8}
      columns="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    />
  );
}
