"use client"

import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background-100 flex items-center justify-center px-4 sm:px-6">
            <div className="max-w-2xl w-full text-center">
                {/* Animated 404 Text */}
                <div className="relative mb-8">
                    <h1 className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold text-background-300 select-none leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary-100 rounded-full flex items-center justify-center shadow-lg shadow-primary-100/30 animate-pulse">
                            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-200 mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-sm sm:text-base text-primary-300 mb-8 max-w-md mx-auto leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Don&apos;t worry, let&apos;s get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-primary-100 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full 
                        font-semibold text-sm sm:text-base hover:opacity-90 transition-all duration-300 
                        shadow-lg hover:shadow-xl shadow-primary-100/20 w-full sm:w-auto justify-center"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-background-300 text-primary-200 px-6 sm:px-8 py-3 sm:py-4 rounded-full 
                        font-semibold text-sm sm:text-base hover:bg-background-400 transition-all duration-300 
                        border border-background-400 w-full sm:w-auto justify-center cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 flex justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-100 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary-100 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary-100 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    )
}
