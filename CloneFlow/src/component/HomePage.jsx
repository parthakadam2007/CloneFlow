import React from 'react';
import { 
  Bot, Calendar, Mail, Menu, X, ArrowRight, CheckCircle, Star, Users, 
  Zap, Shield, Globe, TrendingUp, Clock, MessageSquare, Sparkles,
  Play, Award, Target, BarChart3, Rocket, ChevronDown, Eye
} from 'lucide-react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import logo from '../assets/CloneFlow.svg';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const features = [
    {
      icon: <Mail />,
      title: "AI Email Generation",
      description: "Generate professional, contextually relevant emails in seconds. Our AI understands tone, purpose, and recipient preferences to craft perfect messages.",
      benefits: ["Smart tone adaptation", "Multi-language support", "Template customization", "A/B testing integration"],
      gradient: "email-icon"
    },
    {
      icon: <Bot />,
      title: "Intelligent Chatbot",
      description: "Deploy conversational AI that handles customer inquiries, provides support, and engages users with natural, human-like interactions.",
      benefits: ["24/7 availability", "Context-aware responses", "Seamless handoffs", "Multi-platform integration"],
      gradient: "chatbot-icon"
    },
    {
      icon: <Calendar />,
      title: "Smart Calendar Assistant",
      description: "Let AI manage your schedule intelligently. Automatically coordinate meetings, find optimal time slots, and handle rescheduling with ease.",
      benefits: ["Conflict resolution", "Priority scheduling", "Time zone management", "Meeting optimization"],
      gradient: "calendar-icon"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star /> },
    { number: "2M+", label: "Emails Automated", icon: <Mail /> },
    { number: "500K+", label: "Hours Saved", icon: <Clock /> }
  ];

  const testimonials = [
    {
      text: "CloneFlow has transformed our customer service. The AI chatbot handles 80% of inquiries automatically, allowing our team to focus on complex issues.",
      author: "Sarah Johnson",
      title: "Head of Customer Success",
      company: "TechCorp",
      avatar: "SJ"
    },
    {
      text: "The email generation feature saves me hours every day. The AI perfectly captures my writing style and handles all my routine communications.",
      author: "Michael Chen",
      title: "Marketing Director",
      company: "StartupXYZ",
      avatar: "MC"
    },
    {
      text: "Scheduling meetings across time zones used to be a nightmare. CloneFlow's calendar assistant makes it effortless and error-free.",
      author: "Emily Rodriguez",
      title: "Operations Manager",
      company: "GlobalTech",
      avatar: "ER"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "Up to 1,000 AI emails/month",
        "Basic chatbot functionality",
        "Calendar integration",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10,000 AI emails/month",
        "Advanced chatbot with NLP",
        "Smart calendar assistant",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Team collaboration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited AI emails",
        "Enterprise chatbot suite",
        "Advanced calendar management",
        "24/7 dedicated support",
        "Custom AI training",
        "White-label options",
        "SLA guarantee"
      ],
      popular: false
    }
  ];

  const integrations = [
    { name: "Gmail", logo: "📧" },
    { name: "Outlook", logo: "📮" },
    { name: "Slack", logo: "💬" },
    { name: "Teams", logo: "👥" },
    { name: "Zoom", logo: "📹" },
    { name: "Salesforce", logo: "☁️" },
    { name: "HubSpot", logo: "🎯" },
    { name: "Zapier", logo: "⚡" }
  ];

  return (
    <div className="app-home">
      {/* Header */}
      <header className="header-home">
        <div className="container-home">
          <div className="nav-brand">
            <img src={logo} alt="" />
            {/* <span className="brand-name">CloneFlow</span> */}
          </div>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#integrations" className="nav-link">Integrations</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <a href="#contact" className="nav-link">Contact</a>
            <Link to="/" className="btn btn-primary">Get Started</Link>
          </nav>

          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="floating-elements">
            <div className="floating-element element-1"><Mail /></div>
            <div className="floating-element element-2"><Bot /></div>
            <div className="floating-element element-3"><Calendar /></div>
            <div className="floating-element element-4"><Sparkles /></div>
          </div>
        </div>
        <div className="container-home">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles className="badge-icon" />
              <span>Powered by Advanced AI Technology</span>
            </div>
            <h1 className="hero-title">
              Transform Your Workflow with
              <span className="gradient-text"> AI-Powered Automation</span>
            </h1>
            <p className="hero-description">
              CloneFlow revolutionizes your productivity with intelligent AI agents that handle emails, 
              conversations, and scheduling seamlessly. Experience the future of automated workflow management 
              with enterprise-grade security and reliability.
            </p>
            <div className="hero-actions">
              <Link to='/'>
              <button className="btn btn-primary btn-large pulse-animation">
                Start
                <ArrowRight className="btn-icon" />
              </button>
              </Link>
              <button className="btn btn-secondary btn-large">
                <Play className="btn-icon" />
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container-home">
          <div className="section-header">
            <div className="section-badge">
              <Zap className="badge-icon" />
              <span>Powerful Features</span>
            </div>
            <h2 className="section-title">Powered by Advanced AI</h2>
            <p className="section-description">
              Our intelligent agents work 24/7 to streamline your communication and scheduling with 
              cutting-edge artificial intelligence technology
            </p>
          </div>

          <div className="features-showcase">
            <div className="features-tabs">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`tab-button ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className={`tab-icon ${feature.gradient}`}>
                    {feature.icon}
                  </div>
                  <span>{feature.title}</span>
                </button>
              ))}
            </div>
            
            <div className="feature-content">
              <div className="feature-demo">
                <div className="demo-window">
                  <div className="demo-header">
                    <div className="demo-controls">
                      <span className="control red"></span>
                      <span className="control yellow"></span>
                      <span className="control green"></span>
                    </div>
                    <span className="demo-title">{features[activeTab].title}</span>
                  </div>
                  <div className="demo-content">
                    <div className="demo-animation">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p>AI is generating your content...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="feature-details">
                <h3 className="feature-title">{features[activeTab].title}</h3>
                <p className="feature-description">{features[activeTab].description}</p>
                <ul className="feature-list">
                  {features[activeTab].benefits.map((benefit, index) => (
                    <li key={index}>
                      <CheckCircle className="check-icon" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary">
                  Try {features[activeTab].title}
                  <ArrowRight className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {/* <section className="benefits">
        <div className="container-home">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon productivity-icon">
                <TrendingUp />
              </div>
              <h3 className="benefit-title">10x Productivity</h3>
              <p className="benefit-description">
                Automate repetitive tasks and focus on what matters most. Our users report 10x improvement in productivity.
              </p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon security-icon">
                <Shield />
              </div>
              <h3 className="benefit-title">Enterprise Security</h3>
              <p className="benefit-description">
                Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards ensure your data is always protected.
              </p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon global-icon">
                <Globe />
              </div>
              <h3 className="benefit-title">Global Scale</h3>
              <p className="benefit-description">
                Available in 50+ languages with 99.9% uptime. Serve customers worldwide with localized AI responses.
              </p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon analytics-icon">
                <BarChart3 />
              </div>
              <h3 className="benefit-title">Smart Analytics</h3>
              <p className="benefit-description">
                Get actionable insights with detailed analytics and reporting to optimize your workflow performance.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      {/* <section id="pricing" className="pricing">
        <div className="container-home">
          <div className="section-header">
            <div className="section-badge">
              <Target className="badge-icon" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-description">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && (
                  <div className="popular-badge">
                    <Award className="badge-icon" />
                    Most Popular
                  </div>
                )}
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <CheckCircle className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-large plan-button`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Integrations Section */}
      {/* <section id="integrations" className="integrations">
        <div className="container-home">
          <div className="section-header">
            <h2 className="section-title">Seamless Integrations</h2>
            <p className="section-description">
              Connect with your favorite tools and platforms
            </p>
          </div>
          
          <div className="integrations-grid">
            {integrations.map((integration, index) => (
              <div key={index} className="integration-card">
                <div className="integration-logo">{integration.logo}</div>
                <span className="integration-name">{integration.name}</span>
              </div>
            ))}
          </div>
          
          <div className="integrations-cta">
            <p>Don't see your tool? We integrate with 500+ applications.</p>
            <button className="btn btn-secondary">View All Integrations</button>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section id="testimonials" className="testimonials">
        <div className="container-home">
          <div className="section-header">
            <div className="section-badge">
              <MessageSquare className="badge-icon" />
              <span>Customer Stories</span>
            </div>
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-description">
              See how companies worldwide are transforming their workflows with CloneFlow
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-title">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="cta">
        <div className="container-home">
          <div className="cta-content">
            <div className="cta-icon">
              <Rocket />
            </div>
            <h2 className="cta-title">Ready to Automate Your Workflow?</h2>
            <p className="cta-description">
              Join thousands of professionals who trust CloneFlow to handle their AI automation needs. 
              Start your free trial today and experience the future of productivity.
            </p>
            <div className="cta-actions">
              <button className="btn btn-white btn-large pulse-animation">
                Start Free Trial
                <ArrowRight className="btn-icon" />
              </button>
              <button className="btn btn-secondary btn-large">
                Schedule Demo
              </button>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <CheckCircle className="feature-icon" />
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <CheckCircle className="feature-icon" />
                <span>14-day free trial</span>
              </div>
              <div className="cta-feature">
                <CheckCircle className="feature-icon" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <div className="container-home">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="nav-brand">
                <Bot className="logo-icon" />
                <span className="brand-name">CloneFlow</span>
              </div>
              <p className="footer-description">
                Empowering businesses with intelligent AI automation for seamless workflow management. 
                Transform your productivity with cutting-edge artificial intelligence.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">GitHub</a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Product</h4>
                <a href="#" className="footer-link">Features</a>
                <a href="#" className="footer-link">Pricing</a>
                <a href="#" className="footer-link">API</a>
                <a href="#" className="footer-link">Integrations</a>
                <a href="#" className="footer-link">Security</a>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Company</h4>
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Blog</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Press</a>
                <a href="#" className="footer-link">Contact</a>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Resources</h4>
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Documentation</a>
                <a href="#" className="footer-link">Tutorials</a>
                <a href="#" className="footer-link">Community</a>
                <a href="#" className="footer-link">Status</a>
              </div>

              <div className="footer-column">
                <h4 className="footer-title">Legal</h4>
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Cookie Policy</a>
                <a href="#" className="footer-link">GDPR</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 CloneFlow. All rights reserved.</p>
            <div className="footer-legal">
              <span>Made with ❤️ for productivity</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;