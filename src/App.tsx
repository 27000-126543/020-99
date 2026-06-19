import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { CasePage } from "@/pages/CasePage";
import { ResultPage } from "@/pages/ResultPage";
import { TeacherPage } from "@/pages/TeacherPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case/:id" element={<CasePage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
      </Routes>
    </Router>
  );
}
