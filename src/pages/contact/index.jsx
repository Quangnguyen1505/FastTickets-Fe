'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <Layout title={"Contact"}>
      <Header />
      <main className="w-full mt-12 md:mt-[5.5rem] bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 mb-12">
            We&apos;re always ready to support you. Send us a message or reach out directly for the fastest assistance!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Cinema Information</h2>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>123 Cinema Street, District 1, Ho Chi Minh City</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Phone:</p>
                    <p>(028) 9999 8888</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>support@rapchieuphim.vn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-red-500 text-xl mt-1">🎬</span>
                  <div>
                    <p className="font-medium">Opening Hours:</p>
                    <p>Monday - Sunday: 9:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-blue-200 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Send a Message</h2>
              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-white transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}
