import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { UserIcon } from './icons/UserIcon';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '',
    phoneNumber: '',
    className: '',
    board: '',
    schoolName: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Pre-fill with Auth data
        let data = {
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          phoneNumber: '',
          className: '',
          board: '',
          schoolName: ''
        };

        // Fetch additional data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          data = { ...data, ...firestoreData };
        }

        setFormData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      // 1. Update Firebase Auth Profile (DisplayName and PhotoURL)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName: formData.displayName,
            photoURL: formData.photoURL
        });
      }

      // 2. Update Firestore (All fields including academic info)
      await setDoc(doc(db, "users", user.uid), {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
        phoneNumber: formData.phoneNumber,
        className: formData.className,
        board: formData.board,
        schoolName: formData.schoolName
      }, { merge: true });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Your Profile</h2>
        <p className="text-gray-500 mt-1">Manage your personal and academic information</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md">
        {message && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-green-500 mb-4">
                    {formData.photoURL ? (
                        <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                         <UserIcon className="w-full h-full text-gray-400 p-4" />
                    )}
                </div>
                 <div className="w-full max-w-md">
                    <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                    <input
                        type="text"
                        id="photoURL"
                        name="photoURL"
                        value={formData.photoURL}
                        onChange={handleInputChange}
                        placeholder="https://example.com/my-photo.jpg"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Info</h3>
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Academic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Info</h3>
                    <div>
                        <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class / Grade</label>
                        <input
                            type="text"
                            id="className"
                            name="className"
                            value={formData.className}
                            onChange={handleInputChange}
                            placeholder="e.g. 10th Grade"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="board" className="block text-sm font-medium text-gray-700">Board / University</label>
                        <input
                            type="text"
                            id="board"
                            name="board"
                            value={formData.board}
                            onChange={handleInputChange}
                            placeholder="e.g. CBSE"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">School / College Name</label>
                        <input
                            type="text"
                            id="schoolName"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;