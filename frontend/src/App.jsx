import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SubmitPage } from "./pages/SubmitPage";
import { DashboardPage } from "./pages/DashboardPage";
import { IdeaDetailPage } from "./pages/IdeaDetailPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SubmitPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ideas/:id" element={<IdeaDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
