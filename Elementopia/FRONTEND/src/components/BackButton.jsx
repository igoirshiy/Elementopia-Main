import { useNavigate } from "react-router-dom";


const BackButton = ({label = "Back", className = ""}) => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-150 ${className}`}
        >
        <ArrowLeft size={18} className="mr-2"/>
        {label}
        </button>
    );
};

export default BackButton;