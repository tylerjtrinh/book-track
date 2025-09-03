import {useState} from 'react';
import {Link} from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = () => {
    
  }
  return (
    <div className="bg-slate-700 min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-600 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Login Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Login
        </h1>
        
        {/* Login Form */}
        <form onSubmit={submitHandler} className="space-y-6">
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