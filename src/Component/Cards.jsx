import React, { useState,useEffect } from 'react'
import SearchBox from "./SearchBox"


const LinkPreviewCard = ({ data }) => (
  <a href={`${data.url}`} target="_blank" rel="noopener noreferrer" className={`card ${data.domain.split('.')[0]}`}>
    <div className="card-image">
      <img src={data.img} alt="" className="main-image" 
      onError={(e) => e.target.src = "/Lost_Image.png"}
      />
    </div>
    <div className="card-content">
      <h2 className="card-title">{data.title}</h2>
      <p className="card-description">{data.description}</p>
      <div className="card-domain">
        <img src={data.favicon} alt="" className="favicon" />
        <span>{data.domain}</span>
      </div>
    </div>
  </a>
)

export default function Component() {
  const [searchInput,setSearchInput] = useState("");
  const [linkData, setLinkData] = useState([])
  const [inputUrl, setInputUrl] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_HOST || "http://localhost:3000";


  useEffect(() => {
    fetch(`${BASE_URL}/data`)
      .then((response) => response.json())
      .then((data) => {
        setLinkData(data);
      setFilteredData(data);
      }
    )
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  useEffect(() => {
    const lowerSearch = searchInput.toLowerCase();

    const newFilteredData = linkData.filter(({ title, description, domain, tags }) => {
      return (
        title.toLowerCase().includes(lowerSearch) ||
        description.toLowerCase().includes(lowerSearch) ||
        domain.toLowerCase().includes(lowerSearch) ||
        tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    });

    setFilteredData(newFilteredData);
  }, [searchInput, linkData]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputUrl) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/link-preview`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: inputUrl })
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch link preview data");
        }
  
        const newCard = await response.json();
        setLinkData([newCard, ...linkData]);
        setFilteredData([newCard, ...filteredData]); // Add new data to filtered list
        setInputUrl('');
        showToast("Link added successfully!", "success");
      } catch (error) {
        showToast("Failed to add link. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  const showToast = (message, type) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  return (
    <div className="container">
      <h1 className="heading">Bookey</h1>
      {/* <form onSubmit={handleSubmit} className="url-input-form">
        <div className="input-wrapper">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter a URL to preview..."
            required
            className="url-input"
          />
          <div className="input-focus-effect"></div>
        </div>
        <button type="submit" className="submit-button">
          <span className="button-text">Preview</span>
          <span className="button-icon">→</span>
        </button>
      </form> */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
      <SearchBox  searchInput={searchInput}  setSearchInput={setSearchInput}/>
      
      
      <div className="bento-grid">
      <div className="input-card">
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter a URL to preview..."
              required
              className="url-input"
              disabled={isLoading}
            />
            <button type="submit" className="add-button" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : 'Add'}
            </button>
          </form>
        </div>
        {filteredData.map((data, index) => (
          <LinkPreviewCard key={index} data={data} />
        ))}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        :root {
          --color: #E1E1E1;
          --bg-color: #f8f9fa;
          --text-color: #333;
          --card-bg: #ffffff;
          --input-bg: #1a1a1a;
          --input-text: #ffffff;
          --input-placeholder: #888888;
          --button-bg: #4a4a4a;
          --button-text: #ffffff;
          --linkedin-color: #0077b5;
          --github-color: #24292e;
          --youtube-color: #ff0000;
          --google-color: #4285f4;
          --twitter-color: #1da1f2;
          --vercel-color: #000000;
          --success-color: #28a745;
          --error-color: #dc3545;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          margin: 0;
          padding: 0;
          background-color: #f3f3f3;
    background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%, transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%, transparent);
            background-size: 55px 55px;

        
          }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          }

        .heading {
          font-size: 4rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          display: inline-block;
          left: 50%;
          transform: translateX(-50%);
          padding: 10px 20px;
        }

        .heading::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, #ff6b6b33, #4ecdc433, #45b7d133);
          filter: blur(10px);
          z-index: -1;
          border-radius: 10px;
        }

        .url-input-form {
          display: flex;
          margin-bottom: 2rem;
          border-radius: 50px;
          overflow: hidden;
          background: var(--input-bg);
          padding: 5px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .url-input-form::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
          z-index: -1;
          border-radius: 52px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .url-input-form:hover::before {
          opacity: 1;
        }

        .input-wrapper {
          flex-grow: 1;
          position: relative;
          overflow: hidden;
        }

        .url-input {
          width: 100%;
          padding: 12px 20px;
          font-size: 16px;
          border: none;
          outline: none;
          background-color: transparent;
          color: var(--input-text);
          position: relative;
          z-index: 2;
        }

        .url-input::placeholder {
          color: var(--input-placeholder);
        }

        .input-focus-effect {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .url-input:focus + .input-focus-effect {
          transform: translateX(0);
        }

        .submit-button {
          padding: 12px 24px;
          font-size: 16px;
          color: var(--button-text);
          background-color: var(--button-bg);
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .button-text {
          position: relative;
          z-index: 2;
        }

        .button-icon {
          margin-left: 8px;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .submit-button:hover .button-icon {
          transform: translateX(5px);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .input-card {
          background-color: var(--input-bg);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .input-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
          z-index: -1;
          filter: blur(5px);
          opacity: 0.5;
        }

        .url-input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: var(--input-text);
          margin-bottom: 10px;
        }

        .url-input::placeholder {
          color: var(--input-placeholder);
        }

        .add-button {
          position: absolute;
          bottom: 20px;
          right: 20px;
          padding: 8px 16px;
          font-size: 14px;
          background-color: var(--button-bg);
          color: var(--button-text);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-button:hover {
          background-color: #666;
        }
        
        .add-button:hover:not(:disabled) {
          background-color: #666;
        }

        .add-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .card {
          display: flex;
          flex-direction: column;
          background-color: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          height: 200px;
          overflow: hidden;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-description {
          font-size: 14px;
          margin: 0 0 12px 0;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #666;
        }

        .card-domain {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #999;
        }

        .favicon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }

        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.3s ease forwards, fadeOut 0.3s ease 2.7s forwards;
        }

        .toast.success {
          background-color: var(--success-color);
        }

        .toast.error {
          background-color: var(--error-color);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
          }
        }

        /* Domain-specific styles */
        .linkedin { border-left: 4px solid var(--linkedin-color); }
        .github { border-left: 4px solid var(--github-color); }
        .youtube { border-left: 4px solid var(--youtube-color); }
        .docs { border-left: 4px solid var(--google-color); }
        .x { border-left: 4px solid var(--twitter-color); }
        .v0 { border-left: 4px solid var(--vercel-color); }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .heading {
            font-size: 3rem;
          }

          .bento-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .heading {
            font-size: 2.5rem;
          }

          .url-input-form {
            flex-direction: column;
            border-radius: 15px;
          }

          .url-input-form::before {
            border-radius: 17px;
          }

          .submit-button {
            width: 100%;
            border-radius: 10px;
            margin-top: 10px;
          }

          .bento-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}