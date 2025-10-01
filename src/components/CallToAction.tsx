
import { ArrowRight, CheckCircle, Users, Building, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CallToAction = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      icon: Users,
      title: "Direct Support Professionals",
      benefits: ["Flexible scheduling", "Competitive pay", "Skill-based matching"],
      buttonText: "Join as DSP",
      color: "bg-blue-600 hover:bg-blue-700",
      role: "dsp"
    },
    {
      icon: Building,
      title: "Healthcare Agencies",
      benefits: ["Qualified staff", "Reduced gaps", "Compliance tracking"],
      buttonText: "Partner with Us",
      color: "bg-green-600 hover:bg-green-700",
      role: "agency"
    },
    {
      icon: GraduationCap,
      title: "Training Providers",
      benefits: ["Course management", "Direct certification", "Student tracking"],
      buttonText: "Offer Training",
      color: "bg-purple-600 hover:bg-purple-700",
      role: "trainer"
    },
    {
      icon: MapPin,
      title: "County Administrators",
      benefits: ["Oversight tools", "Compliance monitoring", "Analytics dashboard"],
      buttonText: "Get Access",
      color: "bg-orange-600 hover:bg-orange-700",
      role: "county"
    }
  ];

  const handleRoleButtonClick = (role: string) => {
    navigate(`/register?role=${role}`);
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleScheduleDemo = () => {
    navigate('/contact');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main CTA Header */}
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-6">Ready to Transform Healthcare Staffing?</h3>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of healthcare professionals who are already using ShiftLink to build better careers, 
            fill critical staffing needs, and improve patient care across Ohio.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100">Free to join</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100">Quick setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100">24/7 support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-blue-100">Immediate matching</span>
            </div>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {userTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-4">{type.title}</h4>
                  <ul className="space-y-2 mb-6">
                    {type.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-blue-100">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${type.color} text-white`}
                    onClick={() => handleRoleButtonClick(type.role)}
                  >
                    {type.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Urgency Section */}
        <div className="bg-white/10 rounded-xl p-8 border border-white/20 text-center">
          <h4 className="text-2xl font-bold mb-4">Healthcare Staffing Crisis is Real</h4>
          <p className="text-blue-100 mb-6 max-w-4xl mx-auto">
            Ohio faces a critical shortage of qualified healthcare staff. Every day, agencies struggle to fill essential shifts, 
            and qualified DSPs miss opportunities. ShiftLink bridges this gap with intelligent matching and verified credentials.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">-23%</div>
              <p className="text-blue-100 text-sm">Healthcare worker shortage in OH</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">72%</div>
              <p className="text-blue-100 text-sm">Agencies report daily staffing gaps</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">+96%</div>
              <p className="text-blue-100 text-sm">Fill rate with ShiftLink</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-medical-green hover:bg-green-600 text-white px-8 py-3"
              onClick={handleGetStarted}
            >
              Start Today - It's Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
              onClick={handleScheduleDemo}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-16 text-center">
          <p className="text-blue-100 mb-4">Questions? We're here to help.</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="tel:1-800-SHIFTLINK" className="text-white hover:text-blue-300 transition-colors">
              📞 1-800-SHIFTLINK
            </a>
            <a href="mailto:support@shiftlink.com" className="text-white hover:text-blue-300 transition-colors">
              ✉️ support@shiftlink.com
            </a>
            <span className="text-blue-100">💬 Live chat available 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
