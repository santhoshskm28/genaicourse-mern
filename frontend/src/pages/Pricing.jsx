import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaCrown, FaRocket } from 'react-icons/fa';

const Pricing = () => {
    const plans = [
        {
            name: 'Initiate',
            price: '$0',
            period: 'forever',
            description: 'Begin your neural synchronization',
            features: [
                'Access to 3 base modules',
                'Core data materials',
                'General community terminal',
                'Basic sync tracking',
                'Standard certification'
            ],
            limitations: [
                'Limited clearance levels',
                'No priority uplift',
                'Basic neural paths'
            ],
            buttonText: 'Initialize Sync',
            buttonVariant: 'secondary',
            icon: <FaStar className="text-amber-500" />,
            popular: false
        },
        {
            name: 'Specialist',
            price: '$29',
            period: 'per course',
            description: 'Advanced data for serious engineers',
            features: [
                'Full academy access',
                'Advanced neural materials',
                'Priority uplift support',
                'Custom learning matrices',
                'Quantifiable data resources',
                'Real-time sync analytics',
                'Offline node access',
                'Verified certification',
                'Live mentor synchronization'
            ],
            limitations: [],
            buttonText: 'Uplift to Specialist',
            buttonVariant: 'primary',
            icon: <FaCrown className="text-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.2)]" />,
            popular: true
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: 'per course',
            description: 'Full-court solutions for neural teams',
            features: [
                'Everything in Specialist',
                'Unlimited team nodes',
                'Private module creation',
                'Global nexus dashboard',
                'Full API clearance',
                'White-label synchronization',
                'Dedicated neural manager',
                'Custom system integrations',
                'High-priority signal help',
                'Uptime SLA protocol'
            ],
            limitations: [],
            buttonText: 'Contact Command',
            buttonVariant: 'secondary',
            icon: <FaRocket className="text-blue-500" />,
            popular: false
        }
    ];

    return (
        <div className="section section-pt bg-[var(--bg-main)] min-h-screen">
            <div className="container">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
                    >
                        Access Clearance Plans
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight text-brand">
                        Power Your <br />
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Potential</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Select your synchronization level and gain access to the infinite knowledge of the GenAI Nexus.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-32 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className={`glass-card p-10 flex flex-col group relative bg-white border border-gray-200 shadow-xl ${plan.popular ? 'border-violet-500/30' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-10 block">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                    {plan.icon}
                                </div>
                                <h3 className="text-3xl font-black text-brand mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-5xl font-black text-brand tracking-tighter">{plan.price}</span>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{plan.price !== '$0' ? ` / ${plan.period}` : ' free'}</span>
                                </div>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="text-emerald-600 text-[10px]" />
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">{feature}</span>
                                    </div>
                                ))}
                                {plan.limitations.map((limitation, limitationIndex) => (
                                    <div key={limitationIndex} className="flex items-center gap-4 opacity-40">
                                        <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-gray-400 text-xs font-black">×</span>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">{limitation}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                                className={`btn-premium w-full !py-4 ${plan.buttonVariant === 'primary' ? 'btn-primary' : 'bg-white border border-gray-200 text-brand hover:bg-gray-50'
                                    }`}
                            >
                                {plan.buttonText}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Block */}
                <div className="py-32 border-t border-gray-200">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-brand mb-4">Neural Query Lab</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs font-heading">Commonly Synchronized Queries</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <FAQItem question="Can I modify clearange levels?" answer="Synchronizations can be reconfigured at any point. Changes optimize instantly to your matrix." />
                        <FAQItem question="Protocol for data reversals?" answer="A 30-day neural reversal window is active for Specialist and Enterprise nodes." />
                        <FAQItem question="Simulated training access?" answer="Initiate clearance provides 14 cycles of simulation before permanent node binding." />
                        <FAQItem question="Global credit clearance?" answer="Academy accepts all primary credit arrays and encrypted Specialist transfers." />
                    </div>
                </div>

                {/* Bottom Hub */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-16 text-center border border-gray-200 bg-white shadow-xl"
                >
                    <h2 className="text-4xl font-black text-brand mb-6">Forge Your Career Hub</h2>
                    <p className="text-gray-500 mb-10 max-w-2xl mx-auto font-medium">Join 12,000+ engineers currently synchronizing with the Nexus. The future of intelligence is decentralized.</p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/register" className="btn-premium btn-primary !px-12">
                            Initialize Free Node
                        </Link>
                        <Link to="/courses" className="btn-premium bg-white border border-gray-200 text-brand hover:bg-gray-50 !px-12">
                            Explore Neural Lessons
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }) => (
    <div className="group">
        <h3 className="text-lg font-bold text-brand mb-3 group-hover:text-accent transition-colors uppercase tracking-tight">{question}</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed">{answer}</p>
    </div>
);

export default Pricing;