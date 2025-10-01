
import { Shield, Lock, FileCheck, Eye, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SecurityCompliance = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Full HIPAA compliance with encrypted data transmission and secure storage protocols.",
      details: "End-to-end encryption"
    },
    {
      icon: Lock,
      title: "Background Checks",
      description: "Comprehensive background verification for all Direct Support Professionals.",
      details: "FBI & DOJ clearance"
    },
    {
      icon: FileCheck,
      title: "Document Verification",
      description: "Real-time verification of certifications, licenses, and training credentials.",
      details: "6-year retention policy"
    },
    {
      icon: Eye,
      title: "GPS Monitoring",
      description: "Secure location tracking for shift verification and safety compliance.",
      details: "Real-time tracking"
    },
    {
      icon: Users,
      title: "Identity Verification",
      description: "Multi-factor authentication and identity verification for all users.",
      details: "Biometric options"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Continuous monitoring and quality checks to maintain high care standards.",
      details: "Regular audits"
    }
  ];

  const certifications = [
    { name: "SOC 2 Type II", status: "Certified" },
    { name: "HIPAA Compliance", status: "Verified" },
    { name: "California State Approved", status: "Licensed" },
    { name: "ISO 27001", status: "Pending" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Security & Compliance</h3>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Your data and privacy are protected by enterprise-grade security measures and healthcare compliance standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                      <p className="text-blue-100 text-sm mb-3 leading-relaxed">{feature.description}</p>
                      <div className="inline-block px-3 py-1 bg-medical-green/20 text-medical-green text-xs font-medium rounded-full">
                        {feature.details}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-bold mb-6">Industry Certifications</h4>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
                  <span className="font-medium">{cert.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cert.status === 'Certified' || cert.status === 'Verified' || cert.status === 'Licensed'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-8 border border-white/20">
            <h4 className="text-2xl font-bold mb-6">Compliance Highlights</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-medical-green mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-2">Healthcare Privacy Protection</h5>
                  <p className="text-blue-100 text-sm">All patient and medical data is encrypted and stored according to HIPAA requirements with regular security audits.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-medical-green mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-2">State Regulatory Compliance</h5>
                  <p className="text-blue-100 text-sm">Fully compliant with California healthcare staffing regulations and county-specific requirements.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileCheck className="w-6 h-6 text-medical-green mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-2">Document Security</h5>
                  <p className="text-blue-100 text-sm">Secure document management with 6-year retention policy and encrypted storage protocols.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
