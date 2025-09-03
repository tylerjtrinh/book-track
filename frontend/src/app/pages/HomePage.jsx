import Hero from '../components/Hero';
import BookListings from '../components/BookListings';

const HomePage = () => {
  return (
    <div className="bg-slate-700 min-h-screen">
      <Hero />
      <BookListings />
    </div>
  )
}

export default HomePage