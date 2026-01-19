import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const services = [
  {
    title: 'Home Furniture',
    description: 'High-quality and stylish home furniture designed for comfort, durability, and beauty.',
    images: ['/image/sofa_coach.jpeg', '/image/bed-sofa.jpeg', '/image/shelf.jpeg'],
  },
  {
    title: 'Office Furniture',
    description: 'Professional office furniture solutions to improve productivity and workplace comfort.',
    images: ['/image/for-office.jpg', '/image/office-furniture.jpg', '/image/office-set-furniture.jpg'],
  },
  {
    title: 'Selling Timber',
    description: 'Quality timber and wood materials suitable for furniture making and construction.',
    images: ['/image/timber.jpg', '/image/raw-timber.jpg', '/image/timber_shop.jpg'],
  },
  {
    title: 'Job Agent (Dalali wa Kazi)',
    description: 'Reliable job placement services connecting workers with hotels, bungalows, and various job opportunities.',
    images: ['/image/agent.jpg', '/image/job-agent.jpg', '/image/middle-ment-agent.jpg'],
  },
  {
    title: 'Custom Service',
    description: 'Custom-made furniture and services tailored to your specific needs, space, and style.',
    images: ['/image/sofa-bed.jpeg', '/image/office-setup.jpg', '/image/bed-sofa.jpeg'],
  },
];

export function OurServices() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline tracking-tight sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-muted-foreground">Complete solutions for home, office, and custom needs</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-3 grid-rows-2 gap-1 h-48">
                  <div className="col-span-2 row-span-2 relative">
                    <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
                  </div>
                  <div className="col-span-1 row-span-1 relative">
                    <Image src={service.images[1]} alt={service.title} fill className="object-cover" />
                  </div>
                  <div className="col-span-1 row-span-1 relative">
                     <Image src={service.images[2]} alt={service.title} fill className="object-cover" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold font-body mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
