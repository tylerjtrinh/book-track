import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

const NotFoundPage = () => {
return (
    <section className="bg-slate-700 min-h-screen text-center flex flex-col items-center h-96">
      <FaExclamationTriangle className="text-gray-400 text-6xl mb-4 mt-20" />
      <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="text-gray-200 text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        className="bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >Go Back
        </Link>
    </section>
  )
}

export default NotFoundPage