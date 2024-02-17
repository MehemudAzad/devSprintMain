import { Link } from "react-router-dom";

const Submission = ({ submission }) => {
  const { id, file_name, name} = submission;

  const handleDownload = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5003/submission-download/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download file:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    
      <a href="#" onClick={handleDownload}>
      <div className="shadow-lg py-6 px-4 my-4 border-l-8 border-indigo-500 bg-indigo-50">
        <h3 className="text-2xl">{id}. {file_name}</h3>
        <p className="text-md text-indigo-600">added by {name}</p>
      </div>
      </a>
    
  );
};


export default Submission;