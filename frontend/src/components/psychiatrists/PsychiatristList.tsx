import { useEffect, useState } from 'react';
import BookMark from '@/assets/bookmark.svg'
import Message from '@/assets/message.svg'
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchUser, signInWithGoogle } from '../../../firebase/firebase';
import { useRouter } from 'next/router';
import { LoginPopup } from '../LoginPopup';
import { IPsychiatrist, IUser } from '@/schema';
import okb_colors from "@/colors";
import { fetchAllUsers, updateUser } from '../../../firebase/fetchData';

interface PsychiatristListProps {
  results: IPsychiatrist[];
}

const PsychiatristList: React.FC<PsychiatristListProps> = ({ results }) => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);


  // Get all users from the database
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchUsers: IUser[] = await fetchAllUsers();
        setUsers(fetchUsers);
      } catch (err: any) {
        console.error(err.message);
      }
    }
    fetchData();
  }, []);

  const handleSendMessage = (event: React.MouseEvent) => {
    if (!user) {
      event.preventDefault();
      setShowPopup(true);
    }
  };

  const handleSave = async (event: React.MouseEvent, psychiatrist) => {
    if (!user) {
      event.preventDefault();
      setShowPopup(true);
    } else {
      try {
        const fetchUsers: IUser[] = await fetchAllUsers();
        const currentUser = fetchUsers[0];


        // Check if the psychiatrist is already saved
        if (!currentUser.savedPsychiatrists.includes(`${psychiatrist.firstName} ${psychiatrist.lastName}`)) {
          // If not saved, add the psychiatrist to the savedPsychiatrists array
          currentUser.savedPsychiatrists.push(`${psychiatrist.firstName} ${psychiatrist.lastName}`);

          // Save the updated user data
          // Assuming you have a function to update user data, e.g., updateUser
          await updateUser('3DTG4Slk3KnwVAf6UjMG', currentUser.savedPsychiatrists); // This is only dummy data

          // You can also update the local state to trigger a re-render
          setUsers(prevUsers => prevUsers.map(u => (u.uid === user.uid ? currentUser : u)));
        }

      } catch (error) {
        console.error('Error saving psychiatrist');
      }
    }
  };

  // Redirects to a professional's profile page and passes their first name and last name as query parameters
  function handleGoToProfProfile(psychiatrist: IPsychiatrist) {
    router.push({
      pathname: `/${user?.uid}/prof_profile`,
      query: { firstName: psychiatrist.firstName, lastName: psychiatrist.lastName }
    })
  }

  const signInWithGoogleAndRedirect = async (onClose: () => void) => {
    await signInWithGoogle();
    router.push('/messages'); // Moved this line before the closing of the popup
    setShowPopup(false);
    onClose();
  };

  return (
    <div className={`psychiatrist-list flex flex-col items-start gap-6`}>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} signInWithGoogleAndRedirect={signInWithGoogleAndRedirect} />}
      {results.map((psychiatrist) => (
        <div key={psychiatrist.uid} className="psychiatrist" onClick={() => handleGoToProfProfile(psychiatrist)}>
          {/* Display the psychiatrist's information here */}
          <div className={`card card-side flex flex-row justify-center items-center gap-2.5 rounded-lg bg-[${okb_colors.white}] shadow-[0_0px_5px_0px_rgb(0,0,0,0.15)] items-start gap-x-6 bg-base-100 grid-cols-5 hover:brightness-90 p-6 self-stretch`}>
            <div className={`col-span-1 flex items-center justify-center`}>
              <figure>
                <img src="https://lh3.googleusercontent.com/a/AGNmyxZobZdPI78Xzk3dOtXciW5fAE3Wn-QIZYlJTdk_=s96-c" alt="Profile Pic" className={`rounded-full w-32 h-32 object-cover`} />
              </figure>
            </div>
            <div className={`flex flex-col items-start gap-4 flex-1 w-full h-auto`}>
              {/* Grid (to enable easier organization of columns) w/ psychiatrist name + buttons */}
              <div className={`flex justify-between items-start self-stretch`}>
                <div className={`flex flex-col items-start gap-2`}>
                  <h2 className={`card-title col-span-2 text-[${okb_colors.black}] text-[24px] font-semibold not-italic`}>{psychiatrist.firstName} {psychiatrist.lastName}</h2>
                  <p className={`text-[${okb_colors.black}] text-[16px] font-semibold`}>{psychiatrist.position} at {psychiatrist.location}</p>
                </div>
                <div className={`flex justify-end items-center gap-4`}>
                  <button className={`btn flex py-2 px-4 justify-center items-center gap-3 rounded-lg bg-[#195BA5] text-[${okb_colors.white}] text-[16px] flex`} onClick={(event) => handleSave(event, psychiatrist)}>
                    <BookMark />
                    <div>Save</div>
                  </button>
                  <Link href="/messages">
                    <div
                      className={`btn flex py-2 px-4 justify-center items-center gap-3 rounded-lg bg-[${okb_colors.okb_blue}] text-[${okb_colors.white}] text-[16px] flex`}
                      onClick={handleSendMessage}
                    >
                      <Message />
                      <div>Message</div>
                    </div>
                  </Link>
                </div>
              </div>
              {/* Additional psychiatrist info */}
              <div className={`self-stretch`}>
                <p className={`text-[${okb_colors.dark_gray}] text-[12px] font-normal`}>{psychiatrist.description}</p>
              </div>
            </div>
          </div>
        </div >
      ))
      }
    </div >
  );
};

export default PsychiatristList;