import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <Header>
      <main>
        <Outlet />
      </main>
    </Header>
  );
}

export default App;
