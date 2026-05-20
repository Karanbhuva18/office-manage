import MainLayout from "./layout/MainLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./utils/routes";
import SignUp from "./Pages/SignUp";
import LoginPage from "./Pages/LoginPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<LoginPage />} />
        {routes.map((route) => {
          const Component = route.element;

          return (
            <Route
              key={route.path}
              path={route.path.slice(1)}
              element={<Component />}
            />
          );
        })}
      </Route>
    </Routes>
  );
};

export default App;
