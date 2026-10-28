'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div>
            <h3 className="text-lg font-bold mb-4">Art Museum</h3>
            <p className="text-gray-400 text-sm">
              Discover our collections.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-gray-400 hover:text-white transition-colors">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="text-gray-400 hover:text-white transition-colors">
                  Artworks
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-400 hover:text-white transition-colors">
                  Book
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 123 Rue de l&apos;Art, Paris</li>
              <li>📞 +33 1 23 45 67 89</li>
              <li>✉️ contact@musee-art.fr</li>
              <li className="pt-2">
                Open Tuesday to Sunday<br />
                10am - 6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Art Museum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}