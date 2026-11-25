import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Cpu, Activity, Clock } from 'lucide-react';

export const MovementEngineering: React.FC = () => {
  const movements = [
    {
      type: 'Automatic Self-Winding',
      icon: RotateCw,
      frequency: '28,800 VPH (4 Hz)',
      powerReserve: '42 Hours',
      description: 'Harnesses kinetic wrist energy through an oscillating tungsten rotor. Smooth continuous seconds sweep.',
      link: '/shop?movementType=Automatic',
    },
    {
      type: 'Mechanical Manual-Wind',
      icon: Clock,
      frequency: '21,600 / 28,800 VPH',
      powerReserve: '56 Hours',
      description: 'The purest expression of traditional horology. Daily manual winding establishes an intimate ritual with time.',
      link: '/shop?movementType=Mechanical',
    },
    {
      type: 'Meca-Quartz Chronograph',
      icon: Activity,
      frequency: '1/5 Second Mechanical Sweep',
      powerReserve: '36 Months Battery',
      description: 'Combines quartz-crystal timekeeping stability with mechanical chronograph click levers and instant reset.',
      link: '/shop?movementType=Chronograph',
    },
    {
      type: 'High-Precision Swiss Quartz',
      icon: Cpu,
      frequency: '32,768 Hz',
      powerReserve: '60 Months',
      description: 'Ultra-thin Ronda movements delivering unerring ±10 seconds per month accuracy within a 6.8mm case profile.',
      link: '/shop?movementType=Quartz',
    },
  ];

  return (
    <section className="py-24 border-t border-platinum">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Internal Engineering</span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
            Movement & Calibres
          </h2>
          <p className="text-sm text-graphite font-light leading-relaxed">
            We celebrate distinct engineering philosophies. Whether self-winding kinetic energy or sub-second chronograph levers, discover the heart of your timepiece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movements.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-8 bg-pure/85 border border-platinum rounded-sm flex flex-col justify-between hover:border-gold hover:-translate-y-2 hover:shadow-luxe-hover transition-all duration-500 group space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-sm bg-pure border border-platinum flex items-center justify-center text-charcoal group-hover:text-gold transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif-luxury text-xl text-charcoal">{m.type}</h3>
                  <p className="text-xs text-graphite font-light leading-relaxed">{m.description}</p>
                </div>

                <div className="pt-4 border-t border-platinum space-y-2 text-xs">
                  <div className="flex justify-between text-silver">
                    <span>Oscillation</span>
                    <span className="text-charcoal font-medium">{m.frequency}</span>
                  </div>
                  <div className="flex justify-between text-silver">
                    <span>Reserve</span>
                    <span className="text-charcoal font-medium">{m.powerReserve}</span>
                  </div>
                  <Link
                    to={m.link}
                    className="block pt-3 text-[11px] uppercase tracking-wider text-charcoal group-hover:text-gold underline underline-offset-4"
                  >
                    View Models
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MovementEngineering;
