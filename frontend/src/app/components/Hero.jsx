import React from 'react'
import { NavLink } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="bg-slate-700 border-b border-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Your Personal Book Management System
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-4 leading-relaxed">
            Manage your reading list, discover NYT Best Sellers, and track your reading journey with our database.
          </p>
          <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
            Built with Google Books integration and real-time bestseller updates.
          </p>
          <NavLink 
            to="/login" 
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default Hero