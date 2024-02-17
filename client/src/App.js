import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";

function App() {
  return (
    <div className="App bg-indigo-50">
      <RouterProvider router={routes}>
    
      </RouterProvider>
    </div>
  );
}

export default App;
