import { ContentPageSkeleton } from "@/components/ui/page-skeletons";

export default function Loading() {
  return (
    <ContentPageSkeleton
      cards={2}
      columns="grid gap-8 lg:grid-cols-2"
    />
  );
}
