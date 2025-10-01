
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-medical-blue">ShiftLink</h1>
            </div>
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Home Health ShiftLink ("ShiftLink", "Platform", "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
              <p className="text-gray-700 leading-relaxed">
                ShiftLink is a web-based platform that connects certified home healthcare agencies with qualified Direct Support Professionals (DSPs), while facilitating interactions with credential trainers and county board administrators. The platform provides matching services, credential management, secure messaging, and compliance tracking.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Roles and Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Direct Support Professionals (DSPs)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Must maintain current and valid certifications</li>
                    <li>Must provide accurate availability and location information</li>
                    <li>Must comply with all GPS clock-in/out requirements</li>
                    <li>Must maintain professional conduct with clients and agencies</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Healthcare Agencies</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Must be properly licensed and certified healthcare providers</li>
                    <li>Must provide accurate shift details and requirements</li>
                    <li>Must pay all platform fees and DSP compensation promptly</li>
                    <li>Must comply with all applicable healthcare regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-l-4 border-red-500 pl-6 bg-red-50 p-4 rounded-r-lg">
              <h2 className="text-xl font-semibold text-red-800 mb-4">4. Anti-Circumvention Policy</h2>
              <div className="space-y-3 text-red-700">
                <p className="font-medium">
                  This is a critical policy that all users must understand and accept:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Prohibition:</strong> Users are strictly prohibited from using ShiftLink to make initial contact and then conducting business outside the platform to avoid fees.
                  </li>
                  <li>
                    <strong>Buyout Fee:</strong> If an agency hires a DSP they met through ShiftLink for direct employment or ongoing services outside the platform within 12 months of initial contact, the agency must pay a buyout fee of $1,000 USD.
                  </li>
                  <li>
                    <strong>Detection:</strong> We employ various methods to detect circumvention, including but not limited to user reporting, activity monitoring, and external verification.
                  </li>
                  <li>
                    <strong>Enforcement:</strong> Violation of this policy may result in immediate account suspension, legal action, and collection of all applicable fees and damages.
                  </li>
                </ul>
                <p className="font-medium mt-4">
                  By using ShiftLink, you acknowledge that this policy is fair and necessary for the platform's sustainability and agree to comply fully.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Platform Commission:</strong> ShiftLink retains a commission of 10-20% on all transactions processed through the platform.
                </p>
                <p>
                  <strong>Payment Processing:</strong> All payments are processed securely through our integrated payment systems (Stripe/Square).
                </p>
                <p>
                  <strong>Refund Policy:</strong> Refunds are handled on a case-by-case basis in accordance with our dispute resolution procedures.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Security and Privacy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We implement industry-standard security measures to protect user data, including end-to-end encryption for sensitive information and secure document storage with 6-year retention for compliance purposes.
                </p>
                <p>
                  User contact information is protected and only shared between parties after a booking is confirmed through the platform.
                </p>
                <p>
                  GPS tracking data is collected for EVV (Electronic Visit Verification) compliance and is accessible by relevant county boards as required by Ohio state law and federal regulations.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Compliance and Legal Requirements</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  All users must comply with applicable federal, state, and local laws regarding healthcare services, including but not limited to HIPAA, EVV requirements, Ohio Department of Developmental Disabilities (DODD) regulations, and professional licensing requirements.
                </p>
                <p>
                  ShiftLink maintains logs and documentation as required for regulatory compliance and audit purposes in accordance with Ohio state requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Account Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                ShiftLink reserves the right to suspend or terminate user accounts for violations of these terms, fraudulent activity, or behavior that compromises the safety and integrity of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                ShiftLink serves as a platform to connect healthcare professionals and agencies. We are not responsible for the quality of care provided, employment disputes, or issues arising from the healthcare services delivered.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                ShiftLink reserves the right to modify these terms at any time. Users will be notified of significant changes and continued use of the platform constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@shiftlink.com.
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> June 2, 2025
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Effective Date:</strong> June 2, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
