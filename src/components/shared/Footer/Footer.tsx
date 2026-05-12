import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { name: 'Flight Booking', href: '/flights' },
            { name: 'Hotel Reservation', href: '/hotels' },
            { name: 'Tour Packages', href: '/packages' },
            { name: 'Travel Insurance', href: '/insurance' },
        ],
        destinations: [
            { name: 'Bali, Indonesia', href: '/bali' },
            { name: 'Santorini, Greece', href: '/santorini' },
            { name: 'Paris, France', href: '/paris' },
            { name: 'Kyoto, Japan', href: '/kyoto' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Contact Us', href: '/contact' },
        ]
    };

    return (
        <footer className="bg-base-200 text-base-content/70 border-t border-base-content/5">

            {/* Main Footer Links */}
            <div className="section-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
                {/* Brand Section */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-base-content">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Aura<span className="text-primary"> Trip</span></span>
                    </Link>
                    <p className="opacity-70 leading-relaxed">
                        Discover the worlds most beautiful destinations with Aura Trip. We provide premium travel experiences tailored to your dreams.
                    </p>
                    <div className="flex gap-4">
                        {['twitter', 'facebook', 'instagram', 'youtube'].map((social) => (
                            <button key={social} className="btn btn-ghost btn-circle btn-sm bg-base-300 hover:bg-primary hover:text-white transition-all duration-300">
                                <span className="sr-only">{social}</span>
                                <div className="w-5 h-5 bg-current opacity-70"></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Links Groups */}
                <div>
                    <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider">Services</h4>
                    <ul className="space-y-4">
                        {footerLinks.services.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="hover:text-primary transition-colors duration-200">{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider">Destinations</h4>
                    <ul className="space-y-4">
                        {footerLinks.destinations.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="hover:text-primary transition-colors duration-200">{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-base-content font-bold text-lg mb-6 uppercase tracking-wider">Support</h4>
                    <ul className="space-y-4">
                        {footerLinks.support.map((link) => (
                            <li key={link.name}>
                                <Link href={link.href} className="hover:text-primary transition-colors duration-200">{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-base-content/10 bg-base-300/30">
                <div className="section-container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-50">
                    <p>© {currentYear} Aura Trip Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-base-content transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-base-content transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-base-content transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;