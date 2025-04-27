import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-pink-50 flex flex-1 text-gray-700 py-6 border-t border-pink-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-pink-600">LoveMate 💖</h4>
        </div>
        <div className="flex justify-center flex-wrap gap-4 text-sm mb-3">
          <a href="#" className="hover:text-pink-500">Privacy Policy</a>
          <a href="#" className="hover:text-pink-500">Terms of Service</a>
          <a href="#" className="hover:text-pink-500">Support</a>
          <a href="#" className="hover:text-pink-500">About</a>
        </div>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} LoveMate. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
