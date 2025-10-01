
import { TrendingUp, Clock, Users, MapPin, Award, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const PlatformStats = () => {
  const stats = [
    {
      icon: Users,
      value: "15,000+",
      label: "Active DSPs",
      growth: "+23% this month",
      color: "text-blue-600"
    },
    {
      icon: MapPin,
      value: "850+",
      label: "Partner Agencies",
      growth: "+15% this month",
      color: "text-green-600"
    },
    {
      icon: Calendar,
      value: "45,000+",
      label: "Shifts Completed",
      growth: "+31% this month",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      value: "98.5%",
      label: "On-Time Rate",
      growth: "+2% improvement",
      color: "text-orange-600"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "Average Rating",
      growth: "Consistent quality",
      color: "text-yellow-600"
    },
    {
      icon: TrendingUp,
      value: "$2.8M+",
      label: "Paid to DSPs",
      growth: "+45% this quarter",
      color: "text-indigo-600"
    }
  ];

  const regionalStats = [
    { region: "Sacramento County", dsps: "2,847", agencies: "156", shifts: "8,920" },
    { region: "Los Angeles County", dsps: "4,231", agencies: "203", shifts: "12,450" },
    { region: "San Diego County", dsps: "1,892", agencies: "127", shifts: "5,670" },
    { region: "Alameda County", dsps: "1,654", agencies: "98", shifts: "4,890" },
    { region: "Orange County", dsps: "2,156", agencies: "134", shifts: "6,780" },
    { region: "Other Counties", dsps: "2,220", agencies: "132", shifts: "6,290" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform by the Numbers</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time statistics showcasing the impact and growth of our healthcare staffing platform
          </p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-medical-blue">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600 font-medium">{stat.growth}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Regional Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">Regional Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Region</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Active DSPs</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Partner Agencies</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Monthly Shifts</th>
                </tr>
              </thead>
              <tbody>
                {regionalStats.map((region, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{region.region}</td>
                    <td className="py-4 px-4 text-center text-medical-blue font-semibold">{region.dsps}</td>
                    <td className="py-4 px-4 text-center text-medical-green font-semibold">{region.agencies}</td>
                    <td className="py-4 px-4 text-center text-purple-600 font-semibold">{region.shifts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-medical-blue to-blue-600 text-white">
            <CardContent className="p-8">
              <h5 className="text-xl font-bold mb-4">Platform Growth</h5>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Year-over-Year Growth</span>
                  <span className="text-2xl font-bold">+287%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>New DSPs Monthly</span>
                  <span className="text-2xl font-bold">1,200+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Agency Retention Rate</span>
                  <span className="text-2xl font-bold">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-medical-green to-green-600 text-white">
            <CardContent className="p-8">
              <h5 className="text-xl font-bold mb-4">Quality Metrics</h5>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Shift Fill Rate</span>
                  <span className="text-2xl font-bold">96.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Same-Day Bookings</span>
                  <span className="text-2xl font-bold">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Customer Satisfaction</span>
                  <span className="text-2xl font-bold">4.9/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
