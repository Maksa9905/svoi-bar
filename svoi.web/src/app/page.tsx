import { HomePage } from "@/views/home";
import { pageMetadata, siteDescription } from "@/shared/config/seo";

export const metadata = pageMetadata({
  description: siteDescription,
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
