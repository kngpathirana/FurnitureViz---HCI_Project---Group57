'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Sparkles, Zap, Shield, Layers, Eye, Save, ArrowRight, CheckCircle2, Users, BarChart, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
          <p className="text-gray-600 font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Box className="h-7 w-7 text-orange-600" />
              <div className="absolute -inset-1 bg-orange-600/20 blur-lg -z-10"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">
              FurnitureViz
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-gray-100">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-orange-50 pt-20 pb-32">
       
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-orange-200/50 shadow-sm mb-8">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Transform spaces with professional visualization</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Design Stunning Spaces
              <span className="block mt-2 text-orange-600">
                in 2D & 3D
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              The ultimate furniture visualization platform for designers, retailers, and homeowners. 
              Create professional layouts and see them come to life in stunning 3D.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/register">
                <Button size="lg" className="px-10 py-6 text-lg bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-10 py-6 text-lg border-2 hover:bg-gray-50">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Unlimited designs</span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-8 border-white">
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <Image src="https://content-management-files.canva.com/46b7a9b8-d34e-499c-9e75-505c2eb95524/ai-interior-design_promo-showcase_032x.png?resize-format=auto&resize-quality=70" alt="Hero Image" fill />
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Layers className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2D Design</p>
                  <p className="text-sm text-gray-500">Precise layouts</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3D Preview</p>
                  <p className="text-sm text-gray-500">Real-time rendering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for professionals and enthusiasts alike
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://www.rokform.com/cdn/shop/articles/best-apps-for-interior-design.webp?v=1768118408" 
                alt="Interior Design Features"
                fill
                className="object-cover"
              />
            </div>

            {/* Features Side */}
            <div className="grid grid-cols-1 gap-6">
              {/* Feature 1 */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Intuitive 2D Canvas</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Drag, drop, resize, and rotate furniture with pixel-perfect precision.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Feature 2 */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Stunning 3D Rendering</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Watch your 2D designs transform into photorealistic 3D visualizations instantly.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Feature 3 */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Save className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Cloud Storage</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      All your designs automatically saved and synced. Access them anywhere, anytime.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Feature 4 */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Built with cutting-edge technology for instant updates and smooth performance.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="mb-8 relative inline-block">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg mx-auto">
                  1
                </div>
                <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Account</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sign up for free in seconds. No credit card required, no commitments.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="mb-8 relative inline-block">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg mx-auto">
                  2
                </div>
                <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Design Layout</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Drag and drop furniture on the 2D canvas. Arrange, resize, and perfect your space.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="mb-8 relative inline-block">
                <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg mx-auto">
                  3
                </div>
                <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl -z-10"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">View in 3D</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Switch to 3D mode and see your design come to life with realistic rendering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">20+</div>
              <div className="text-orange-100 text-lg">Furniture Items</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">7</div>
              <div className="text-orange-100 text-lg">Categories</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-orange-100 text-lg">Design Possibilities</div>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">2</div>
              <div className="text-orange-100 text-lg">Powerful View Modes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to transform your designs?
          </h2>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Join designers and retailers who trust FurnitureViz for their visualization needs. 
            Start creating stunning spaces today—completely free.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-12 py-6 text-lg bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Box className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-2xl text-white">FurnitureViz</span>
            </div>
            <p className="text-gray-400 mb-2 text-lg">
              Professional furniture visualization for modern creators
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} FurnitureViz. All rights reserved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
