import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Upload, BarChart3, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {process.env.NEXT_PUBLIC_BRAND_NAME}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
                <Link 
                  href="/workspace"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Workspace
                </Link>
              </SignedIn>
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your Data into <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Beautiful Insights</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Upload your CSV or Excel files and let AI generate stunning visualizations in seconds. No coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/workspace"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <Upload size={20} />
                <span>Upload & Visualize Now</span>
              </Link>
              <Link 
                href="#features"
                className="px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
            
            <div className="mt-16 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 shadow-xl">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/visulization-preview.png" 
                  alt="Visualization preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Powerful Features</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Everything you need to understand your data</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Easy Upload</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply drag and drop your CSV or Excel files to get started. Our platform handles the rest.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI analyzes your data and suggests the best visualizations to uncover hidden insights.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Interactive Charts</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create beautiful, interactive charts that make your data come to life.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Data?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of users who are making better decisions with beautiful data visualizations.
            </p>
            <Link 
              href="/workspace"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} Visora. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
