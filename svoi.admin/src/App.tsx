import { Navigate, Route, Routes } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { AdminShell } from "@/layout/AdminShell";
import { BookingsPage } from "@/pages/BookingsPage";
import { GalleryPage } from "@/pages/GalleryPage";
import { LoginPage } from "@/pages/LoginPage";
import { MediaPage } from "@/pages/MediaPage";
import { MenuPage } from "@/pages/MenuPage";
import { NavigationPage } from "@/pages/NavigationPage";
import { SectionEditorPage } from "@/pages/SectionEditorPage";
import { SectionsPage } from "@/pages/SectionsPage";
import { VenuePage } from "@/pages/VenuePage";
import { session } from "@/shared/session";

const Guard = observer(function Guard() {
  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <AdminShell />;
});

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Guard />}>
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/sections" element={<SectionsPage />} />
        <Route path="/sections/:id" element={<SectionEditorPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/media" element={<MediaPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/bookings" replace />} />
    </Routes>
  );
}
