
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-medical-blue">ShiftLink</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
          <p className="text-gray-600">Last updated: June 3, 2025</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information (name, email, phone number)</li>
              <li>Professional credentials and certifications</li>
              <li>Employment history and preferences</li>
              <li>Location data for shift matching</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Match healthcare professionals with appropriate shifts</li>
              <li>Verify credentials and maintain quality standards</li>
              <li>Process payments and maintain records</li>
              <li>Communicate about shifts, updates, and platform changes</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h3>
            <p className="text-gray-600">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy or as required by law.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h3>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@shiftlink.com" className="text-medical-blue hover:underline">
                privacy@shiftlink.com
              </a>
            </p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-medical-blue hover:text-blue-800 underline font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
