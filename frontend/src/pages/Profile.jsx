import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "../styles/Profile.css";
import { addProfileSource, fetchProfile } from '@/store/slices/profileSlice';
import { ArrowUpRight, ExternalLink, Hash, Link2, Mail } from 'lucide-react';
import getInitials from '@/utils/getInitials';

const getSafeUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export default function ProfileCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    isAddingSource,
    addSourceError,
    addSourceSuccess,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const profileName = [profileData?.firstName, profileData?.lastName]
    .filter(Boolean)
    .join(' ') || 'Your profile';
  const profileInitials = getInitials(profileName) || 'P';
  const jobs = Array.isArray(profileData?.posts?.data) ? profileData.posts.data : [];

  // ---------- State for social profiles ----------
  const [selectedPlatform, setSelectedPlatform] = useState("Medium");
  const [mediumUrl, setMediumUrl] = useState("");

  const handleSubmitSocialUrl = async (e) => {
    e.preventDefault();
    const baseUrl = getSafeUrl(mediumUrl.trim());
    if (!baseUrl) {
      alert('Please enter a valid HTTP or HTTPS URL.');
      return;
    }

    try {
      await dispatch(addProfileSource({ source: selectedPlatform, baseUrl })).unwrap();
      setMediumUrl('');
      await dispatch(fetchProfile()).unwrap();
    } catch {
      // The request error is displayed from the profile slice.
    }
  };

  return (
    <div className="wrapper">
      <div className="profile">
        {/* Header */}
        <div className="profile-image">
          <div className="profile-identity">
            <button
              type="button"
              className="profile-identity-trigger"
              onClick={() => navigate('/myposts')}
              aria-label={`View posts by ${profileName}`}
              title="View my posts"
            >
              <span className="profile-avatar-frame">
                <span className="profile-avatar-initials" aria-hidden="true">{profileInitials}</span>
              </span>
              <span className="profile-identity-copy">
                <span className="profile-identity-kicker">YOUR PROFILE</span>
                <span className="profile-name-row">
                  <span className="profile-name">{profileName}</span>
                  <ArrowUpRight className="profile-name-arrow" size={19} aria-hidden="true" />
                </span>
              </span>
            </button>
            <div className="profile-identity-details" aria-label="Profile details">
              <span className="profile-identity-detail">
                <Mail size={15} aria-hidden="true" />
                {profileData?.email || 'PostIQ member'}
              </span>
              {profileData?.referralCode && (
                <span className="profile-identity-detail profile-identity-detail--code">
                  <Hash size={15} aria-hidden="true" />
                  Referral code <strong>{profileData.referralCode}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {isProfileLoading && <p role="status" className="profile-data-message">Loading profile data...</p>}
        {profileError && <p role="alert" className="profile-data-message profile-data-message--error">{profileError}</p>}

        {/* Sources from ProfileController */}
        <section className="profile-sources" aria-labelledby="profile-sources-title">
          <div className="profile-sources__header">
            <div>
              <p className="profile-sources__eyebrow">Your network</p>
              <h2 id="profile-sources-title">Connected Sources</h2>
            </div>
            <span className="profile-sources__count">
              {jobs.length} {jobs.length === 1 ? 'source' : 'sources'}
            </span>
          </div>
          {!isProfileLoading && !profileError && jobs.length === 0 && (
            <div className="profile-sources__empty">
              <span className="profile-sources__empty-icon" aria-hidden="true"><Link2 size={19} /></span>
              <div>
                <strong>No connected sources</strong>
                <p>Your connected publishers will appear here.</p>
              </div>
            </div>
          )}
          {jobs.length > 0 && (
            <ul className="profile-source-list">
              {jobs.map((job, index) => {
                const safeUrl = getSafeUrl(job.baseUrl);
                return (
                  <li className="profile-source-item" key={`${job.source}-${job.baseUrl}-${index}`}>
                    <span className="profile-source-item__icon" aria-hidden="true"><Link2 size={17} /></span>
                    <div className="profile-source-item__details">
                      <strong>{job.source || 'Source'}</strong>
                      <span className="profile-source-item__url" title={job.baseUrl}>{job.baseUrl}</span>
                    </div>
                    {safeUrl && (
                      <a
                        className="profile-source-item__open"
                        href={safeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${job.source || 'source'} in a new tab`}
                        title="Open source"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

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
                disabled={isAddingSource}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAddingSource || !mediumUrl.trim()}
              className="px-6 py-3 sm:py-2 rounded-lg border border-green-400 font-semibold text-base bg-green-50 hover:bg-green-100 transition-colors"
            >
              {isAddingSource ? 'Adding...' : 'Add Social Profile'}
            </button>
          </form>
          {addSourceError && <p role="alert" className="profile-data-message profile-data-message--error">{addSourceError}</p>}
          {addSourceSuccess && <p role="status" className="profile-data-message">Source connected.</p>}

        </div>

      </div>
    </div>
  );
}
