// app/page.tsx
import {
  FaBuilding,
  FaUsers,
  FaShieldAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaCheck,
  FaStar,
} from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <FaBuilding className="text-blue-600 text-2xl md:text-3xl transition-transform group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <Link
                href="/"
                className="font-bold text-xl md:text-2xl text-gray-900 hover:text-blue-600 transition-colors"
              >
                ResidencyPro
              </Link>
            </div>

            {/* Login Buttons */}
            <div className="flex gap-3 md:gap-4">
              <a
                href="/adminLogin"
                className="border-2 border-blue-600 text-blue-600 text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium hover:bg-blue-600 hover:text-white"
              >
                Admin Login
              </a>
              <a
                href="/residentLogin"
                className="bg-blue-600 text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium hover:bg-blue-700"
              >
                Resident Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <main className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-24">
          {/* Decorative background elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8 text-blue-700 text-sm font-medium">
              <FaStar className="text-orange-400" />
              <span>Trusted by 500+ societies</span>
            </div>

            {/* Enhanced Heading */}
            <h1 className="font-bold text-gray-900 text-4xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Modern{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Residency
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
              </span>
              <br />
              Management System
            </h1>

            {/* Enhanced Description */}
            <p className="text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-10">
              Streamline your society management with our comprehensive
              platform. Handle residents, payments, complaints, and events all
              in one place with
              <span className="text-blue-600 font-semibold">
                {" "}
                advanced automation
              </span>{" "}
              and
              <span className="text-indigo-600 font-semibold">
                {" "}
                real-time insights
              </span>
              .
            </p>

            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/createAccount"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex items-center gap-2"
              >
                Create Society Account
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/demo"
                className="text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors flex items-center gap-2"
              >
                Watch Demo
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
              </Link>
            </div>
            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck className="text-green-500" />
                <span>Free migration</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Powerful tools designed specifically for modern residential
              societies
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mx-auto">
                  <FaUsers className="text-xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Resident Management
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Comprehensive resident profiles with family details, vehicle
                information, and automated onboarding processes
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mx-auto">
                  <FaShieldAlt className="text-xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Smart Payments
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Automated billing, payment tracking, digital receipts, and
                integrated payment gateways with reminders
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mx-auto">
                  <FaCalendarAlt className="text-xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Event Management
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Community hall booking, event scheduling, automated
                notifications, and capacity management with calendar integration
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white mx-auto">
                  <FaBuilding className="text-xl" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Smart Complaints
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                AI-powered complaint categorization, photo/video evidence,
                real-time tracking, and automated escalation system
              </p>
            </div>
          </div>

          {/* Additional Features Preview */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">And many more features...</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                Security Management
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                Visitor Tracking
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                Notice Board
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                Financial Reports
              </span>
              <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                Mobile App
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaBuilding className="text-blue-600 text-xl" />
            <span className="font-bold text-lg text-gray-900">
              ResidencyPro
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2025 ResidencyPro. Making society management simple and efficient.
          </p>
        </div>
      </footer>
    </div>
  );
}
