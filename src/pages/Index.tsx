
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, MessageCircle, TrendingUp, Sparkles, Zap, Shield, Github, Twitter, Linkedin, Mail, Clock, User, LogOut } from "lucide-react";
import { AuthModal } from "../components/AuthModal";
import { UpgradeModal } from "../components/UpgradeModal";
import { VoiceTracker } from "../components/VoiceTracker";
import { useAuth } from "../contexts/AuthContext";
import { useUsageTracking } from "../hooks/useUsageTracking";
import { useLiveKit } from "../hooks/useLiveKit";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  
  const { currentUser, logout } = useAuth();
  const { 
    sessionTime, 
    dailyUsage, 
    isTimeUp, 
    showUpgradeModal, 
    setShowUpgradeModal,
    remainingMinutes 
  } = useUsageTracking();
  
  const {
    isConnected,
    isSpeaking,
    audioLevel,
    connectToRoom,
    disconnectFromRoom,
    generateToken
  } = useLiveKit();

  useEffect(() => {
    if (isTimeUp && !currentUser) {
      setShowTimeUpModal(true);
      setIsVoiceAgentActive(false);
    }
  }, [isTimeUp, currentUser]);

  const handleStartImproving = async () => {
    if (isTimeUp && !currentUser) {
      setShowTimeUpModal(true);
      return;
    }
    
    if (isTimeUp && currentUser) {
      setShowUpgradeModal(true);
      return;
    }

    setIsVoiceAgentActive(true);
    
    // Connect to LiveKit room
    try {
      const roomName = `communication-practice-${Date.now()}`;
      const participantName = currentUser?.email || 'guest';
      const token = await generateToken(roomName, participantName);
      await connectToRoom(token, roomName);
      
      toast({
        title: "Voice Agent Ready",
        description: "You can now start practicing your communication skills!"
      });
    } catch (error) {
      console.error('Failed to start voice session:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to voice agent. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStopSession = async () => {
    setIsVoiceAgentActive(false);
    await disconnectFromRoom();
    toast({
      title: "Session Ended",
      description: "Your voice practice session has ended."
    });
  };

  const handleTimeUpAction = () => {
    setShowTimeUpModal(false);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You've been logged out successfully."
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isVoiceAgentActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
          <VoiceTracker isActive={isSpeaking} volume={audioLevel} />
          
          <h2 className="text-2xl font-bold text-white mb-4 mt-6">Voice Agent Active</h2>
          <p className="text-gray-300 mb-4">
            {isConnected ? "Connected - Start speaking to practice!" : "Connecting to voice agent..."}
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center text-white">
              <span>Session Time:</span>
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </div>
            <div className="flex justify-between items-center text-white mt-2">
              <span>Remaining Today:</span>
              <span className="font-mono">{remainingMinutes} min</span>
            </div>
          </div>
          
          <Button 
            onClick={handleStopSession}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            End Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CommSkills AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{remainingMinutes} min left</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{remainingMinutes} min left</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Communication Training
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Improve Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Communication Skills
            </span>
            with AI
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Practice real-time with a voice agent and boost your confidence through personalized feedback and AI-powered insights.
          </p>
          
          <Button 
            onClick={handleStartImproving}
            className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl transform transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            disabled={isTimeUp && currentUser}
          >
            <span className="relative z-10 flex items-center">
              {isTimeUp && currentUser ? 'Upgrade to Continue' : 'Start Improving Communication'}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="w-12 h-12" />,
                title: "Select Voice Agent",
                description: "Choose from our AI-powered voice agents tailored to different communication scenarios."
              },
              {
                icon: <MessageCircle className="w-12 h-12" />,
                title: "Practice Conversation",
                description: "Engage in real-time conversations with natural language processing and speech recognition."
              },
              {
                icon: <TrendingUp className="w-12 h-12" />,
                title: "Get Feedback",
                description: "Receive instant, personalized feedback on your communication style and areas for improvement."
              }
            ].map((step, index) => (
              <Card key={index} className="group bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Us
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI-Powered Corrections",
                description: "Advanced machine learning algorithms analyze your speech patterns and provide intelligent suggestions for improvement."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Real-time Conversation",
                description: "Practice with lifelike AI agents that respond naturally and adapt to your communication style."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Privacy First",
                description: "Your conversations are secure and private, with end-to-end encryption and no data retention."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Progress Tracking",
                description: "Monitor your improvement over time with detailed analytics and personalized learning paths."
              }
            ].map((feature, index) => (
              <Card key={index} className="group bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-102 hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="relative z-10 px-6 py-16 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CommSkills AI</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering individuals to communicate with confidence through AI-powered training and personalized feedback.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 CommSkills AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      
      {/* Time Up Modal for Guests */}
      {showTimeUpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Free Time Expired</h3>
            <p className="text-gray-600 mb-6">
              You've used your 10 free minutes for today. Login to get more free time or upgrade for unlimited access.
            </p>
            <div className="flex space-x-4">
              <Button onClick={handleTimeUpAction} className="flex-1">
                Login / Sign Up
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowTimeUpModal(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
