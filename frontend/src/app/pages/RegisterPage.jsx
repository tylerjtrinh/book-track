import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [register, {isLoading}] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
      if(userInfo) {
        navigate('/');
      }
  }, [navigate, userInfo])

  const submitHandler = async (e) => {
    e.preventDefault(); 
    if(password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    try {
      //post request to backend
      const res = await register({username, email, password}).unwrap();
      dispatch(setCredentials({...res}));
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
        const errorMessage = err?.data?.error || err?.data?.message || err.error || 'Registration failed';
        toast.error(errorMessage);
        console.log(err);
    }
  }
  return (
    <div className="bg-slate-700 min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-600 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Register
        </h1>
        
        {/* Register Form*/}
        <form onSubmit={submitHandler} className="space-y-6">

          {/* Username Input */}
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Confirm Password Input */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-500 border border-slate-400 rounded-lg px-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Register Button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-300 mt-6">
          Already have an account?{' '}
          <Link to={'/login'} className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
        
      </div>
    </div>
  )
}

export default RegisterPage