import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import profileImg from "../assets/profile.jpg";
import mediumLogo from "../assets/medium-logo.png";

export default function ProfileCard() {
  const navigate = useNavigate();

  // ---------- State for interests ----------
  const [interests, setInterests] = useState([".NET", "JAVA", "Angular", "ReactJS", "NodeJS", "Python", "Django", "Machine Learning", "Data Science", "DevOps", "Cloud Computing", "Cybersecurity", "Blockchain", "AI", "Web Development"]);
  const [newInterest, setNewInterest] = useState("");

  // ---------- State for social profiles ----------
  const [selectedPlatform, setSelectedPlatform] = useState("Medium");
  const [mediumUrl, setMediumUrl] = useState("");
  const [savedMediumUrl, setSavedMediumUrl] = useState("");

  const handleAddInterest = () => {
    const trimmed = newInterest.trim();
    //trimmed="*"+trimmed;
    if (!trimmed) return;
    // avoid duplicates (optional)
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setNewInterest("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddInterest();
    }
  };

  const handleSubmitSocialUrl = (e) => {
    e.preventDefault();
    const trimmed = mediumUrl.trim();
    if (!trimmed) {
      alert("Please enter a valid URL");
      return;
    }
    console.log(`${selectedPlatform} URL submitted:`, trimmed);
    setSavedMediumUrl(trimmed);
    setMediumUrl("");
  };

  return (
    <div className="wrapper">
      <div className="profile">
        {/* Header */}
        <div className="profile-image">
          <img
            src={profileImg}
            alt="Profile"
            className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border border-green-400 avatar-img flex-shrink-0"
          />
          <div className="name">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Ashutosh Kumar Shaw
            </h1>
            <p className="Designation">Specialist Programmer</p>
          </div>
        </div>

        {/* My Posts */}
        <div className="px-6 py-4 font-semibold text-gray-700 border-r border-green-300 flex items-center gap-3 badge bg-gradient-to-r from-green-50 to-transparent hover:bg-green-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Posts</h2>
          <button onClick={() => navigate('/myposts')} className="text-l sm:text-2l font-light text-gray-70 add-post-btn hover:scale-10">+</button>
        </div>

        {/* Social Profiles Section */}
        <div className="px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Social Profiles</h2>
          
          <form onSubmit={handleSubmitSocialUrl} className="space-y-4">
            {/* Platform Dropdown */}
            <div className="form-group">
              <label htmlFor="platform" className="block text-sm font-semibold text-gray-700 mb-2">
                Select Platform
              </label>
              <select
                id="platform"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full border border-green-400 rounded-lg px-4 py-2 outline-none text-base focus:ring-2 focus:ring-green-300 bg-white"
              >
                <option value="Medium">Medium</option>
              </select>
            </div>

            {/* URL Input */}
            <div className="form-group">
              <label htmlFor="socialUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                {selectedPlatform} Profile URL
              </label>
              <input
                id="socialUrl"
                type="url"
                value={mediumUrl}
                onChange={(e) => setMediumUrl(e.target.value)}
                placeholder={`https://medium.com/@your-profile`}
                className="w-full border border-green-400 rounded-lg px-4 py-3 sm:py-2 outline-none text-base focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 sm:py-2 rounded-lg border border-green-400 font-semibold text-base bg-green-50 hover:bg-green-100 transition-colors"
            >
              Add Social Profile
            </button>
          </form>

          {/* Display Saved Medium Profile */}
          {savedMediumUrl && (
            <div className="mt-6 pt-6 border-t border-green-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Profiles</h3>
              <a
                href={savedMediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border border-green-300 rounded-xl overflow-hidden post-link hover:shadow-md transition-all bg-white"
              >
                <div className="px-6 py-4 font-semibold text-gray-700 border-r border-green-300 flex items-center gap-3 badge bg-gradient-to-r from-green-50 to-transparent hover:bg-green-100">
                  <img src={mediumLogo} alt="Medium" className="w-7 h-7 icon" />
                  <div className="flex flex-col">
                    <span className="text-lg">Medium</span>
                    <span className="text-xs text-gray-600">{savedMediumUrl}</span>
                  </div>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Interested Area */}
        <div className="interests">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Interested Area
          </h2>
          
        </div>

        <div className="add-button">
          {/* Input + Add button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 form-group interests-form">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new interest"
              className="flex-1 border border-green-400 rounded-lg px-4 py-3 sm:py-2 outline-none text-base focus:ring-2 focus:ring-green-300"
            />
            <button
              onClick={handleAddInterest}
              className="px-6 py-3 sm:py-2 rounded-lg border border-green-400 font-semibold add-btn text-base whitespace-nowrap"
            >
              Add
            </button>
          </div>

          {/* Interest tags */}
          <div className="flex flex-wrap gap-3 tags-wrapper tags">
            {interests.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 border border-green-400 rounded-full text-gray-700 font-semibold tag text-base hover:bg-green-50 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
