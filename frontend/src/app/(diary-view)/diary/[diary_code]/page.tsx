import { generateMetadata } from "./diary-metadata";
import DiaryPageClient from "./diary-page-client";

export { generateMetadata };

export default function Page() {
  return <DiaryPageClient />;
}
