import { useState, useEffect } from 'react';
import { setCredentials } from '../slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserProfileMutation, useUpdateUserPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [activeTab, setActiveTab] = useState('profile'); 

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdateUserPasswordMutation();

  useEffect(() => {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email])

  const submitProfileHandler = async (e) => {
    e.preventDefault(); 

    if (isUpdatingProfile) return;

    try {
        // Check if username or email has values to update
        const hasProfileUpdates = (username && username.trim() !== '') || (email && email.trim() !== '');
        
        if (hasProfileUpdates) {
            // Only send fields that have values
            const profileData = {};
            if (username && username.trim() !== '') {
                profileData.username = username;
            }
            if (email && email.trim() !== '') {
                profileData.email = email;
            }
            
            const profileRes = await updateProfile(profileData).unwrap();
            
            // Update Redux state with new profile info
            dispatch(setCredentials(profileRes));
            toast.success('Profile updated successfully!');
        } else {
            toast.info('No changes to update');
        }
               
    } catch (error) {
        const errorMessage = error?.data?.error || error?.data?.message || error.error || 'Update failed';
        toast.error(errorMessage);
        console.log(error);
    }
  }

  const submitPasswordHandler = async (e) => {
    e.preventDefault(); 

    if (isUpdatingPassword) return;

    try {
        // Only update password if one was entered
        if (password && password.trim() !== '') {
            if(password !== confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }
            await updatePassword({
                password
            }).unwrap();

            toast.success('Password updated successfully!');
            // Clear password fields after successful update
            setPassword('');
            setConfirmPassword('');
        } else {
            toast.info('Please enter a new password');
        }
               
    } catch (error) {
        const errorMessage = error?.data?.error || error?.data?.message || error.error || 'Update failed';
        toast.error(errorMessage);
        console.log(error);
    }
  }
  return (
    <div className="bg-slate-700 min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-600 rounded-lg shadow-lg p-0 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-0 pt-8 px-8">
          Account Settings
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-500 mt-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-500'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`cursor-pointer flex-1 py-3 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'password'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-500'
                : 'text-slate-300 hover:text-white hover:bg-slate-500'
            }`}
          >
            Password
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
            {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={submitProfileHandler} className="space-y-6">
              {/* Username Input */}
              <div>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Enter new email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Update Profile Button */}
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}
            {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={submitPasswordHandler} className="space-y-6">
              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Update Password Button */}
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage