import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import  { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, {isLoading}] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  //Redirect to homepage if logged in already
  useEffect(() => {
    if(userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page
    try {
      //makes the post request to backend using usersApiSlice
      const res = await login({username, password}).unwrap();
      //Set to state and localstorage
      dispatch(setCredentials({...res})); 
      toast.success("Logged in!");
      navigate('/');
    } catch (err) {
        const errorMessage = err?.data?.message || err.error || 'Login failed';
        toast.error(errorMessage);
        console.log(err);
    }
  }
  return (
    <div className="bg-slate-700 min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-600 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Login
        </h1>
        
        {/* Login Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Username Input */}
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={ username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {isLoading && <Spinner />}
          
          {/* Sign In Button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </form>
        
        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-300 mt-6">
          New to BookTrack?{' '}
          <Link to={'/register'} className="text-blue-400 hover:text-blue-300 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage