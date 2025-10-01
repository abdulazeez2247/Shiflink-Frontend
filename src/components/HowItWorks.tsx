
import { Users, Search, Calendar, CheckCircle, Shield, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      icon: Users,
      title: "Create Your Profile",
      description: "Sign up and complete your professional profile with credentials, certifications, and specializations.",
      userType: "For DSPs & Agencies"
    },
    {
      icon: Shield,
      title: "Verification Process", 
      description: "Our team verifies all credentials, background checks, and certifications to ensure quality and compliance.",
      userType: "Security First"
    },
    {
      icon: Search,
      title: "Smart Matching",
      description: "Our AI algorithm matches DSPs with suitable shifts based on location, skills, availability, and preferences.",
      userType: "Intelligent System"
    },
    {
      icon: Calendar,
      title: "Book & Confirm",
      description: "Browse available shifts, apply instantly, and receive confirmation with all shift details and requirements.",
      userType: "Easy Scheduling"
    },
    {
      icon: CheckCircle,
      title: "GPS Clock-In/Out",
      description: "Use our secure GPS-enabled time tracking system for accurate attendance and location verification.",
      userType: "Precise Tracking"
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "After each shift, both parties rate the experience, building trust and improving future matches.",
      userType: "Quality Assurance"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">How ShiftLink Works</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process connects healthcare professionals with agencies efficiently and securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-medical-blue transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-medical-green rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-medical-blue text-sm font-medium rounded-full">
                      {step.userType}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Connection line for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-medical-blue to-medical-green opacity-30"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h4>
            <p className="text-gray-600 mb-6">Join the platform that's revolutionizing healthcare staffing in California</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-medical-green" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-medical-green" />
                <span>Instant verification</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-medical-green" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
