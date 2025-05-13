'use client'

import { useMemo, useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { Mail, Phone, MapPin } from 'lucide-react'
import { createContactMessage } from '@/utils/https/contact'
import toast from 'react-hot-toast'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export default function ContactPage() {
  const { t } = useTranslation('common')
  const controller = useMemo(() => new AbortController(), [])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Form data:', formData)
      const res = await createContactMessage(formData, controller)
      if (res.data.code === 200) {
        toast.success(
          `Bạn đã gửi tin nhắn thành công`
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })
      }
    } catch (error) {
      toast.error(
        `Gửi tin nhắn thất bại`
      );
      console.log('Error:', error)
    }
  }
  return (
    <Layout title="Contact">
      <Header />
      <main className="w-full mt-12 md:mt-[5.5rem] bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">{t("contact.title")}</h1>
          <p className="text-center text-gray-600 mb-12">
            {t("contact.description")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">{t("contact.left_column.title")}</h2>
              <div className="space-y-6 text-gray-700">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">{t("contact.left_column.address")}</p>
                    <p>123 Cinema Street, District 1, Ho Chi Minh City</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">{t("contact.left_column.phone")}</p>
                    <p>(028) 9999 8888</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="font-medium">{t("contact.left_column.email")}</p>
                    <p>support@rapchieuphim.vn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-red-500 text-xl mt-1">🎬</span>
                  <div>
                    <p className="font-medium">{t("contact.left_column.working_time")}</p>
                    <p>Monday - Sunday: 9:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-blue-200 p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">{t("contact.right_column.title")}</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">{t("contact.right_column.name")}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">{t("contact.right_column.email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@gmail.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">{t("contact.right_column.phone")}</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+84 0344055404"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">{t("contact.right_column.message")}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("contact.right_column.placeholder_message")}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold text-white transition duration-300"
                >
                  {t("contact.right_column.button")}
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

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };  
}