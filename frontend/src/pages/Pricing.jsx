import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaStar, FaCrown, FaRocket } from 'react-icons/fa';

const Pricing = () => {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Perfect for trying out our platform',
            features: [
                'Access to 3 free courses',
                'Basic course materials',
                'Community forum access',
                'Progress tracking',
                'Certificate of completion'
            ],
            limitations: [
                'Limited course selection',
                'No premium support',
                'Basic learning paths'
            ],
            buttonText: 'Get Started Free',
            buttonVariant: 'secondary',
            icon: <FaStar className="text-yellow-500" />,
            popular: false
        },
        {
            name: 'Pro',
            price: '$29',
            period: 'per month',
            description: 'Ideal for serious learners and professionals',
            features: [
                'Access to all courses',
                'Advanced course materials',
                'Priority support',
                'Custom learning paths',
                'Downloadable resources',
                'Advanced progress analytics',
                'Offline access',
                'Certificate of completion',
                'Monthly live sessions'
            ],
            limitations: [],
            buttonText: 'Start Pro Trial',
            buttonVariant: 'primary',
            icon: <FaCrown className="text-purple-500" />,
            popular: true
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: 'per month',
            description: 'Complete solution for teams and organizations',
            features: [
                'Everything in Pro',
                'Unlimited team members',
                'Custom course creation',
                'Advanced analytics dashboard',
                'API access',
                'White-label solution',
                'Dedicated account manager',
                'Custom integrations',
                'Priority phone support',
                'SLA guarantee'
            ],
            limitations: [],
            buttonText: 'Contact Sales',
            buttonVariant: 'secondary',
            icon: <FaRocket className="text-blue-500" />,
            popular: false
        }
    ];

    return (
        <div className="section min-h-screen bg-slate-900">
            <div className="container">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Simple, Transparent <span className="text-gradient">Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the perfect plan for your learning journey. No hidden fees, no surprises.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative card p-8 bg-slate-800 border-none ${plan.popular ? 'ring-2 ring-primary shadow-2xl scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-2">
                                    <span className="text-4xl font-black">{plan.price}</span>
                                    <span className="text-gray-400">/{plan.period}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center gap-3">
                                        <FaCheck className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                                {plan.limitations.map((limitation, limitationIndex) => (
                                    <div key={limitationIndex} className="flex items-center gap-3">
                                        <span className="text-red-500 flex-shrink-0">✗</span>
                                        <span className="text-sm text-gray-500">{limitation}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                                className={`btn ${plan.buttonVariant === 'primary' ? 'btn-primary' : 'btn-secondary'
                                    } w-full text-center`}
                            >
                                {plan.buttonText}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="text-left">
                            <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
                            <p className="text-gray-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
                            <p className="text-gray-400 text-sm">We offer a 30-day money-back guarantee for Pro and Enterprise plans.</p>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                            <p className="text-gray-400 text-sm">Yes, Pro plan comes with a 14-day free trial. No credit card required.</p>
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-16 p-8 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                    <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
                    <p className="text-gray-400 mb-6">Join thousands of learners who are advancing their careers with GenAI Course.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn btn-primary">
                            Start Free Trial
                        </Link>
                        <Link to="/courses" className="btn btn-secondary">
                            Browse Courses
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;