import './App.css';
import IssueDetails from './pages/reportissuedetail';
import ReportIssue from './pages/reportissueform';
import "leaflet/dist/leaflet.css";
function App() {
  return (
   <div>
    <ReportIssue/>
    <IssueDetails/>
   </div>
  );
}

export default App;
