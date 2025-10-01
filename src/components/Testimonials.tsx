
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Direct Support Professional",
      location: "Sacramento, CA",
      rating: 5,
      text: "ShiftLink has transformed my career. I can now find quality shifts that match my schedule and skills. The GPS clock-in feature gives agencies confidence, and I love the transparent payment system.",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Agency Director",
      location: "Compassionate Care Agency",
      rating: 5,
      text: "We've reduced our staffing gaps by 80% since using ShiftLink. The credential verification system saves us hours of paperwork, and we only work with qualified, vetted professionals.",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "CPR/First Aid Trainer",
      location: "LifeSaver Training Institute",
      rating: 5,
      text: "The integrated training platform is fantastic. I can offer courses directly through ShiftLink, and DSPs can immediately update their credentials. It's streamlined everything for my business.",
      avatar: "ER"
    },
    {
      id: 4,
      name: "James Washington",
      role: "County Board Administrator",
      location: "Alameda County",
      rating: 5,
      text: "ShiftLink provides the oversight and compliance tracking we need. The analytics dashboard helps us monitor local healthcare staffing patterns and ensure quality standards are maintained.",
      avatar: "JW"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h3>
          <p className="text-xl text-gray-600">Real stories from healthcare professionals across California</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="w-6 h-6 text-medical-blue opacity-20 absolute -top-2 -left-1" />
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">
                    {testimonial.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">Join thousands of satisfied users</p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-blue">15,000+</div>
              <div>Active DSPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-medical-green">850+</div>
              <div>Partner Agencies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">120+</div>
              <div>Certified Trainers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25</div>
              <div>County Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
