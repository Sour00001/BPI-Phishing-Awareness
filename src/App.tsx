/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Bell, EyeOff, Eye, QrCode, HandCoins, LogIn, ShieldAlert, Clock, LogOut, ArrowLeft, ZapOff, Upload, PiggyBank, LineChart, Coins, Banknote, Home, Car, Store, CreditCard, BadgeCheck, Shield, Zap, Accessibility, Bike, Landmark, HandHeart, RefreshCcw, Send, CircleDollarSign, Circle, PhoneCall, MessageSquare, Info, ArrowUpRight, HelpCircle, Phone, Globe, Rocket, FileText, X, Check, Trash2 } from 'lucide-react';

const ServiceItem = ({ icon, title, subtitle, hasBorder = true, onClick }: { icon: React.ReactNode, title: string, subtitle?: string, hasBorder?: boolean, onClick?: () => void }) => (
  <div 
    className={`flex items-start gap-4 px-4 py-4 ${hasBorder ? 'border-b border-gray-100' : ''} ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
    onClick={onClick}
  >
    <div className="text-[#5A6872] mt-0.5 shrink-0">{icon}</div>
    <div>
      <h3 className="text-[#2C404A] font-medium text-[15px] leading-tight">{title}</h3>
      {subtitle && <p className="text-gray-400 text-[13px] mt-1.5 leading-snug">{subtitle}</p>}
    </div>
  </div>
);

const QRScanner = ({ onClose, onGenerateQR }: { onClose: () => void, onGenerateQR: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied or not available.");
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans absolute inset-0 z-50">
      {/* Top Bar */}
      <div className="bg-white h-14 flex items-center justify-between px-4 shrink-0">
        <button onClick={onClose} className="p-2 text-[#2C404A] -ml-2">
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>
        <h1 className="text-[#2C404A] font-semibold text-[17px]">Scan QR</h1>
        <button className="p-2 text-gray-500 -mr-2">
          <ZapOff size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Camera Area */}
      <div className="flex-grow relative overflow-hidden flex items-center justify-center bg-black">
        {error ? (
          <div className="text-white text-center p-4 z-20">
            <p>{error}</p>
            <p className="text-sm text-gray-400 mt-2">Please allow camera permissions in your browser.</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Cutout Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-64 h-64 border-2 border-white/50 rounded-xl shadow-[0_0_0_4000px_rgba(0,0,0,0.85)]"></div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="bg-black p-6 flex gap-4 pb-8 shrink-0">
        <button className="flex-1 bg-white text-[#2C404A] py-3.5 rounded-md font-semibold flex items-center justify-center gap-2 text-sm">
          <Upload size={18} strokeWidth={2} />
          Upload QR
        </button>
        <button 
          onClick={onGenerateQR}
          className="flex-1 bg-white text-[#2C404A] py-3.5 rounded-md font-semibold flex items-center justify-center gap-2 text-sm"
        >
          <QrCode size={18} strokeWidth={2} />
          Generate QR
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [showForgotScreen, setShowForgotScreen] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [showAboutApp, setShowAboutApp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGenerateQRToast, setShowGenerateQRToast] = useState(false);
  const [showAccessRequiredToast, setShowAccessRequiredToast] = useState(false);
  const [currentTab, setCurrentTab] = useState<'login' | 'services'>('login');
  

  const fetchAuditLogs = () => {
    fetch('/api/admin/audit')
      .then(res => res.json())
      .then(data => setAuditLogs(data))
      .catch(err => console.error("Failed to fetch audit logs", err));
  };

  useEffect(() => {
    if (loggedInUser === 'admin') {
      fetchAuditLogs();
    }
  }, [loggedInUser]);

  const handleDeleteLogs = async (ids: number[]) => {
    try {
      const response = await fetch('/api/admin/audit', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (response.ok) {
        fetchAuditLogs();
        setSelectedLogs([]);
      } else {
        console.error("Failed to delete logs");
      }
    } catch (error) {
      console.error("Network error while deleting logs", error);
    }
  };

  const toggleSelectLog = (id: number) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogs.length === auditLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(auditLogs.map(log => log.id));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'An error occurred' });
      } else {
        setMessage({ type: 'success', text: data.message });
        if (isLogin) {
          setLoggedInUser(data.username);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setMessage(null);
          }, 2000);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setMessage(null);
  };

  const isFormValid = username.length > 0 && password.length > 0;

  if (showQRScanner) {
    return (
      <QRScanner 
        onClose={() => setShowQRScanner(false)} 
        onGenerateQR={() => {
          setShowQRScanner(false);
          setCurrentTab('login');
          setShowGenerateQRToast(true);
          // Auto-hide toast after 5 seconds
          setTimeout(() => setShowGenerateQRToast(false), 5000);
        }}
      />
    );
  }

  // Contact Us View
  if (showContactUs) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-white shrink-0">
          <button onClick={() => setShowContactUs(false)} className="p-2 text-[#2C404A] -ml-2">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="text-[#2C404A] font-semibold text-[17px]">Contact Us</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex-grow overflow-y-auto pb-8">
          {/* Illustration */}
          <div className="flex justify-center py-10">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Confetti/Sparkles */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E8F5E9]" style={{ top: '20%', left: '10%' }}></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E3F2FD]" style={{ top: '15%', right: '20%' }}></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#E8F5E9]" style={{ top: '40%', right: '10%' }}></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FFF9C4]" style={{ bottom: '30%', left: '15%' }}></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#FFEBEE]" style={{ bottom: '20%', left: '25%' }}></div>
              
              <div className="absolute top-[10%] right-[30%] w-3 h-3 rounded-full border border-[#FFF59D]"></div>

              {/* Phone outline */}
              <div className="w-24 h-44 border-[3px] border-[#2C404A] rounded-[14px] bg-[#F8FAFB] relative z-10">
                {/* Screen reflection */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden rounded-[11px]">
                  <div className="absolute -top-10 -right-10 w-20 h-60 bg-white opacity-40 transform rotate-12"></div>
                </div>
              </div>

              {/* Red Speech Bubble */}
              <div className="absolute top-8 right-6 z-20 transform rotate-12">
                <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4 L60 14 L50 40 L16 34 L12 46 L8 32 L2 4 Z" fill="#E57373" />
                  <line x1="16" y1="18" x2="48" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="14" y1="24" x2="36" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Blue Phone Circle */}
              <div className="absolute bottom-12 left-8 z-20 w-14 h-14 bg-[#E3F2FD] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <Phone size={20} className="text-[#1E88E5] fill-[#1E88E5]" />
              </div>
            </div>
          </div>

          {/* List Items */}
          <div className="px-4">
            <div className="border-t border-gray-100">
              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <MessageSquare size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Send us a message</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <HelpCircle size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Go to Help & Support</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="py-5 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <Phone size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Call our hotline</span>
                </div>
                
                <div className="pl-10 pr-2 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#5A6872] text-[13px] mb-1">Philippines</p>
                      <p className="text-[#2C404A] font-semibold text-[15px]">(+632) 889-10000</p>
                    </div>
                    <button className="flex items-center gap-2 text-[#00A5A5] font-medium text-[14px]">
                      <Phone size={18} strokeWidth={2} />
                      Call
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#5A6872] text-[13px] mb-1">Domestic Toll-Free</p>
                      <p className="text-[#2C404A] font-semibold text-[15px]">1-800-188-89100</p>
                    </div>
                    <button className="flex items-center gap-2 text-[#00A5A5] font-medium text-[14px]">
                      <Phone size={18} strokeWidth={2} />
                      Call
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Globe size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">View int'l toll-free numbers</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="flex items-center justify-between py-5 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Landmark size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Visit our branches</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // About the app View
  if (showAboutApp) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 h-14 shrink-0">
          <button onClick={() => setShowAboutApp(false)} className="p-2 text-[#2C404A] -ml-2">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <h1 className="text-[#2C404A] font-semibold text-[17px]">About the app</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="flex-grow overflow-y-auto">
          {/* List Items */}
          <div className="px-4 mt-4">
            <div className="border-t border-gray-100">
              <div className="flex items-start justify-between py-5 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <Rocket size={22} strokeWidth={1.5} className="text-[#5A6872] mt-0.5" />
                  <div>
                    <span className="text-[#2C404A] font-medium text-[15px] block leading-tight">Version</span>
                    <span className="text-gray-400 text-[13px] mt-1.5 block leading-snug">v16.1 (161) nubia Z2464N (15)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Shield size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Security features</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <HelpCircle size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">FAQs</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="flex items-center justify-between py-5 border-b border-gray-100 cursor-pointer">
                <div className="flex items-center gap-4">
                  <FileText size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Terms & Conditions</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>

              <div className="flex items-center justify-between py-5 cursor-pointer">
                <div className="flex items-center gap-4">
                  <FileText size={22} strokeWidth={1.5} className="text-[#5A6872]" />
                  <span className="text-[#2C404A] font-medium text-[15px]">Data Privacy Policy</span>
                </div>
                <ArrowUpRight size={20} strokeWidth={1.5} className="text-[#5A6872]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lock Screen View
  if (showLockScreen) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans p-6">
        <div className="flex-grow flex flex-col items-center justify-center pt-8 pb-8">
          {/* Illustration */}
          <div className="w-full max-w-sm mb-10 flex justify-center">
            <svg viewBox="0 0 240 200" className="w-full h-48 max-w-[240px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sparkles */}
              <circle cx="40" cy="40" r="2" fill="#75CDB0" />
              <circle cx="200" cy="80" r="2" fill="#75CDB0" />
              <circle cx="60" cy="160" r="2" fill="#75CDB0" />
              <circle cx="180" cy="150" r="2" fill="#75CDB0" />
              
              {/* Shield */}
              <path d="M100 20 L40 45 V95 C40 145 65 175 100 195 C135 175 160 145 160 95 V45 L100 20 Z" fill="#75CDB0" opacity="0.8"/>
              <path d="M100 20 L40 45 V95 C40 145 65 175 100 195 C135 175 160 145 160 95 V45 L100 20 Z" fill="#88D8C0" opacity="0.4"/>
              
              {/* Lock inside shield */}
              <rect x="82" y="85" width="36" height="28" rx="4" fill="#00A5A5"/>
              <path d="M88 85 V75 C88 65 112 65 112 75 V85" stroke="#00A5A5" strokeWidth="5" strokeLinecap="round"/>
              <rect x="98" y="95" width="4" height="8" rx="2" fill="white"/>
              
              {/* Person */}
              {/* Head */}
              <circle cx="170" cy="50" r="12" fill="#2C404A"/>
              {/* Body */}
              <path d="M155 70 C155 65 160 60 170 60 C180 60 185 65 185 70 L190 120 L150 120 L155 70 Z" fill="#D84A4B"/>
              {/* Legs */}
              <path d="M160 120 L155 180" stroke="#F3C6C8" strokeWidth="10" strokeLinecap="round"/>
              <path d="M180 120 L185 180" stroke="#F3C6C8" strokeWidth="10" strokeLinecap="round"/>
              {/* Shoes */}
              <path d="M145 180 H160" stroke="#2C404A" strokeWidth="8" strokeLinecap="round"/>
              <path d="M175 180 H190" stroke="#2C404A" strokeWidth="8" strokeLinecap="round"/>
              {/* Arm holding key */}
              <path d="M160 75 L125 85" stroke="#D84A4B" strokeWidth="8" strokeLinecap="round"/>
              {/* Arm on hip */}
              <path d="M185 75 L195 90 L185 105" stroke="#D84A4B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Key */}
              <path d="M125 85 L105 85" stroke="#F1C40F" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="128" cy="85" r="5" fill="#F1C40F"/>
              <path d="M115 85 V92 M108 85 V92" stroke="#F1C40F" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          
          <div className="w-full max-w-sm">
            <h2 className="text-[22px] font-bold text-[#2C404A] leading-tight mb-4">
              Secure your compromised<br/>device or account
            </h2>
            <p className="text-[#5A6872] text-[15px] leading-relaxed mb-6">
              This will permanently block all your login and online banking transactions on your compromised device or account.
            </p>
            <p className="text-[#5A6872] text-[15px] leading-relaxed mb-8">
              To access online banking again, contact your branch or call our hotline.
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col gap-3 mt-auto pb-2">
          <button 
            onClick={() => {
              alert('Account blocked successfully. Please contact your branch.');
              setShowLockScreen(false);
            }}
            className="w-full bg-[#D84A4B] hover:bg-[#C63A3B] text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Yes, block now
          </button>
          <button 
            onClick={() => setShowLockScreen(false)}
            className="w-full bg-white border border-gray-300 text-[#2C404A] font-semibold py-3.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  // Forgot Password Screen View
  if (showForgotScreen) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans p-6">
        <div className="flex-grow flex flex-col items-center justify-center pt-8 pb-8">
          {/* Illustration */}
          <div className="w-full max-w-sm mb-10 flex justify-center">
            <svg viewBox="0 0 240 200" className="w-full h-48 max-w-[240px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Phone */}
              <rect x="100" y="20" width="70" height="130" rx="8" fill="#F4F7F9" stroke="#2C404A" strokeWidth="4" transform="rotate(5 135 85)"/>
              
              {/* Phone Screen Elements */}
              <g transform="rotate(5 135 85)">
                {/* Inputs */}
                <rect x="110" y="60" width="12" height="12" fill="#E2E8F0"/>
                <rect x="125" y="60" width="12" height="12" fill="#E2E8F0"/>
                <rect x="140" y="60" width="12" height="12" fill="#E2E8F0"/>
                <rect x="155" y="60" width="12" height="12" fill="#E2E8F0"/>
                {/* Button */}
                <rect x="120" y="85" width="30" height="8" fill="#D84A4B"/>
              </g>

              {/* Password Tooltip */}
              <path d="M140 30 L200 30 L200 50 L145 50 L140 60 L140 30 Z" fill="#F1C40F"/>
              {/* Lock in tooltip */}
              <rect x="145" y="38" width="6" height="5" rx="1" fill="#2C404A"/>
              <path d="M146 38 V35 C146 33 150 33 150 35 V38" stroke="#2C404A" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Password dots */}
              <circle cx="160" cy="40" r="1" fill="#2C404A"/>
              <circle cx="165" cy="40" r="1" fill="#2C404A"/>
              <circle cx="170" cy="40" r="1" fill="#2C404A"/>
              <circle cx="175" cy="40" r="1" fill="#2C404A"/>
              <circle cx="180" cy="40" r="1" fill="#2C404A"/>
              <circle cx="185" cy="40" r="1" fill="#2C404A"/>
              <circle cx="190" cy="40" r="1" fill="#2C404A"/>

              {/* Person */}
              {/* Head */}
              <circle cx="95" cy="65" r="10" fill="#2C404A"/>
              {/* Body */}
              <path d="M85 80 C85 75 90 70 95 70 C100 70 105 75 105 80 L110 120 L80 120 L85 80 Z" fill="#D84A4B"/>
              {/* Legs */}
              <path d="M85 120 L80 170" stroke="#F3C6C8" strokeWidth="8" strokeLinecap="round"/>
              <path d="M100 120 L105 170" stroke="#F3C6C8" strokeWidth="8" strokeLinecap="round"/>
              {/* Shoes */}
              <path d="M75 170 H85" stroke="#2C404A" strokeWidth="6" strokeLinecap="round"/>
              <path d="M100 170 H110" stroke="#2C404A" strokeWidth="6" strokeLinecap="round"/>
              {/* Arm pointing */}
              <path d="M90 85 L125 95" stroke="#D84A4B" strokeWidth="6" strokeLinecap="round"/>
              {/* Arm on hip */}
              <path d="M105 85 L115 95 L105 110" stroke="#D84A4B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="w-full max-w-sm">
            <h2 className="text-[22px] font-bold text-[#2C404A] leading-tight mb-4">
              Forgot password
            </h2>
            <p className="text-[#5A6872] text-[15px] leading-relaxed mb-8">
              Your password can only be changed via BPI. By clicking the button below, you will be redirected to the Forgot Password page in your browser.
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto flex flex-col gap-3 mt-auto pb-2">
          <button 
            onClick={() => {
              alert('Redirecting to BPI Forgot Password page...');
              setShowForgotScreen(false);
            }}
            className="w-full bg-[#D84A4B] hover:bg-[#C63A3B] text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Take me there
          </button>
          <button 
            onClick={() => setShowForgotScreen(false)}
            className="w-full bg-white border border-gray-300 text-[#2C404A] font-semibold py-3.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  if (loggedInUser === 'admin') {
    return (
      <div className="fixed inset-0 bg-[#F5F7F9] flex flex-col font-sans text-gray-900 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-5 flex justify-between items-center shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-red-50 p-2 md:p-2.5 rounded-xl">
              <ShieldAlert className="text-[#E31837] w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-0.5 font-medium">System Audit Trail & Security Logs</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 md:p-3 text-gray-500 hover:text-[#E31837] hover:bg-red-50 rounded-full transition-all"
            title="Log Out"
          >
            <LogOut className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={2} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-hidden p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
          

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden flex-grow">
            {/* Table Toolbar/Header */}
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-2 md:gap-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-800">
                  <span className="hidden sm:inline">Recent Login Attempts</span>
                  <span className="sm:hidden">Recent Logins</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                {selectedLogs.length > 0 && (
                  <button
                    onClick={() => handleDeleteLogs(selectedLogs)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-2.5 md:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    title="Delete Selected"
                  >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">Delete Selected</span>
                    <span>({selectedLogs.length})</span>
                  </button>
                )}
                <div className="text-xs md:text-sm text-gray-500 font-medium bg-gray-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg border border-gray-100 whitespace-nowrap">
                  <span className="hidden md:inline">Total Records: </span>
                  <span className="md:hidden">Total: </span>
                  {auditLogs.length}
                </div>
              </div>
            </div>
            
            <div className="overflow-auto flex-grow bg-white">
              {/* Desktop Table View */}
              <table className="w-full text-left text-gray-700 relative border-collapse hidden md:table">
                <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold border-b border-gray-200 w-12">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#E31837] focus:ring-[#E31837]"
                        checked={auditLogs.length > 0 && selectedLogs.length === auditLogs.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-gray-200 w-1/3">Timestamp (UTC)</th>
                    <th className="px-6 py-4 font-semibold border-b border-gray-200 w-1/3">User Identifier</th>
                    <th className="px-6 py-4 font-semibold border-b border-gray-200 w-1/3">Authentication Payload</th>
                    <th className="px-6 py-4 font-semibold border-b border-gray-200 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className={`hover:bg-blue-50/50 transition-colors group ${selectedLogs.includes(log.id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#E31837] focus:ring-[#E31837]"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => toggleSelectLog(log.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-gray-100 rounded-md group-hover:bg-white transition-colors">
                            <Clock size={14} className="text-gray-500" />
                          </div>
                          <span className="font-medium">{new Date(log.login_time + 'Z').toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs border border-gray-200 shrink-0">
                            {log.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 truncate">{log.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-600 group-hover:bg-white transition-colors max-w-full overflow-hidden">
                          <span className="opacity-50 shrink-0">pwd:</span>
                          <span className="text-[#00A5A5] font-semibold truncate">{log.password_attempt}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteLogs([log.id])}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <ShieldAlert size={48} className="mb-4 opacity-20" />
                          <p className="text-lg font-medium text-gray-500">No login attempts recorded</p>
                          <p className="text-sm mt-1">System logs will appear here when users attempt to authenticate.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Mobile List View */}
              <div className="md:hidden flex flex-col divide-y divide-gray-100">
                {auditLogs.length > 0 && (
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#E31837] focus:ring-[#E31837]"
                      checked={selectedLogs.length === auditLogs.length}
                      onChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium text-gray-600">Select All</span>
                  </div>
                )}
                {auditLogs.map((log) => (
                  <div key={log.id} className={`p-4 hover:bg-blue-50/50 transition-colors ${selectedLogs.includes(log.id) ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3 overflow-hidden pr-2">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#E31837] focus:ring-[#E31837] shrink-0"
                          checked={selectedLogs.includes(log.id)}
                          onChange={() => toggleSelectLog(log.id)}
                        />
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm border border-gray-200 shrink-0">
                          {log.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-semibold text-gray-900 truncate">{log.username}</div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Clock size={12} className="shrink-0" />
                            <span className="truncate">{new Date(log.login_time + 'Z').toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteLogs([log.id])}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-2 ml-7">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider shrink-0">Password</span>
                      <span className="font-mono text-xs text-[#00A5A5] font-semibold truncate">{log.password_attempt}</span>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="p-10 text-center text-gray-400">
                    <ShieldAlert size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="font-medium text-gray-500">No login attempts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In User View (Non-Admin)
  if (loggedInUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <h1 className="text-5xl font-extrabold text-[#E31837] tracking-tighter mb-8">BPI</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, {loggedInUser}!</h2>
          <p className="text-gray-500 mb-8">You have successfully logged into your account.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-[#E31837] hover:bg-red-700 text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Log Out
          </button>
        </motion.div>
      </div>
    );
  }

  const handleServiceClick = () => {
    setCurrentTab('login');
    setShowAccessRequiredToast(true);
    setTimeout(() => setShowAccessRequiredToast(false), 5000);
  };

  // Login / Register / Services View
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative pb-24">
      {/* Toast Notification for QR */}
      {showGenerateQRToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute top-4 left-4 right-4 bg-[#F4F9F8] rounded-xl shadow-lg overflow-hidden flex z-[60]"
        >
          {/* Green side bar */}
          <div className="bg-[#38B27E] w-14 flex items-center justify-center shrink-0">
            <Check size={20} color="white" strokeWidth={2} />
          </div>
          
          {/* Content */}
          <div className="flex-grow p-3.5 flex items-start justify-between">
            <div>
              <h3 className="text-[#113349] font-bold text-[14px]">Generate QR Code</h3>
              <p className="text-[#5A6872] text-[13px] mt-0.5">Please log in to continue.</p>
            </div>
            <button 
              onClick={() => setShowGenerateQRToast(false)}
              className="text-[#5A6872] hover:text-gray-900 p-1 -mr-1 -mt-1"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Toast Notification for Access Required */}
      {showAccessRequiredToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute top-4 left-4 right-4 bg-[#F4F9F8] rounded-xl shadow-lg overflow-hidden flex z-[60]"
        >
          {/* Blue side bar */}
          <div className="bg-[#1D9BF0] w-14 flex items-center justify-center shrink-0">
            <Info size={20} color="white" strokeWidth={2} />
          </div>
          
          {/* Content */}
          <div className="flex-grow p-3.5 flex items-start justify-between">
            <div>
              <h3 className="text-[#113349] font-bold text-[14px]">Access is required</h3>
              <p className="text-[#5A6872] text-[13px] mt-0.5">Please log in to continue.</p>
            </div>
            <button 
              onClick={() => setShowAccessRequiredToast(false)}
              className="text-[#5A6872] hover:text-gray-900 p-1 -mr-1 -mt-1"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}

      {currentTab === 'login' ? (
        <>
          {/* Header */}
          <div className="flex justify-end p-6">
            <button 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setShowNotifications(true)}
            >
              <Bell size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Logo */}
          <div className="px-8 pt-2 pb-8">
            <h1 className="text-5xl font-extrabold text-[#E31837] tracking-tighter">BPI</h1>
          </div>

          {/* Form */}
          <div className="px-8 flex-grow flex flex-col">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-md mb-4 text-sm font-medium text-center ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-600 border border-red-100' 
                    : 'bg-teal-50 text-teal-600 border border-teal-100'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F4F5F7] text-gray-900 rounded-md px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-400"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F5F7] text-gray-900 rounded-md pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all placeholder:text-gray-400"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} strokeWidth={1.5} /> : <EyeOff size={20} strokeWidth={1.5} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full font-semibold py-3.5 rounded-md transition-colors mt-2 flex justify-center items-center ${
                  isFormValid 
                    ? 'bg-[#E31837] hover:bg-red-700 text-white' 
                    : 'bg-[#F3C6C8] text-white cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Log in' : 'Register'
                )}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-500">
              {isLogin ? (
                <>
                  Forgot <span className="text-[#00A5A5] cursor-pointer" onClick={() => setShowForgotScreen(true)}>username</span> or <span className="text-[#00A5A5] cursor-pointer" onClick={() => setShowForgotScreen(true)}>password</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-[#00A5A5] cursor-pointer font-medium" onClick={() => { setIsLogin(true); setMessage(null); }}>Log in</span>
                </>
              )}
            </div>

            {/* Bottom Text */}
            <div className="mt-auto mb-8 text-center text-sm text-gray-500">
              Lost/hacked account? Secure it now
              <br />
              <span className="text-[#00A5A5] cursor-pointer" onClick={() => setShowLockScreen(true)}>Lock my access</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-grow bg-[#F9FAFB] p-6 pb-24 overflow-y-auto">
          <h1 className="text-[22px] font-bold text-[#2C404A] mb-4">More services</h1>
          
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#FCE8EA] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Savings, investments, & loans</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem icon={<PiggyBank size={22} strokeWidth={1.5} />} title="Open a deposit account" onClick={handleServiceClick} />
              <ServiceItem icon={<LineChart size={22} strokeWidth={1.5} />} title="Open an investment account" onClick={handleServiceClick} />
              <ServiceItem icon={<Coins size={22} strokeWidth={1.5} />} title="Open a BPI Wealth Builder account" onClick={handleServiceClick} />
              <ServiceItem icon={<Banknote size={22} strokeWidth={1.5} />} title="Apply for a personal loan" onClick={handleServiceClick} />
              <ServiceItem icon={<Home size={22} strokeWidth={1.5} />} title="Apply for a housing loan" onClick={handleServiceClick} />
              <ServiceItem icon={<Car size={22} strokeWidth={1.5} />} title="Apply for an auto loan" onClick={handleServiceClick} />
              <ServiceItem 
                icon={<Store size={22} strokeWidth={1.5} />} 
                title="Buena Mano" 
                subtitle="Browse foreclosed properties and repossessed vehicles for sale" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Home size={22} strokeWidth={1.5} />} 
                title="Housing loan after sales services" 
                subtitle="Get loan certifications, statements and other request forms" 
                onClick={handleServiceClick}
              />
              <ServiceItem icon={<Car size={22} strokeWidth={1.5} />} title="Auto loan after sales services" hasBorder={false} onClick={handleServiceClick} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#F0F7F4] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Cards</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem icon={<CreditCard size={22} strokeWidth={1.5} />} title="Apply for a credit card" onClick={handleServiceClick} />
              <ServiceItem icon={<BadgeCheck size={22} strokeWidth={1.5} />} title="Activate credit card" onClick={handleServiceClick} />
              <ServiceItem 
                icon={
                  <div className="relative">
                    <CreditCard size={22} strokeWidth={1.5} />
                    <div className="absolute -bottom-1 -left-1 bg-white rounded-full">
                      <Coins size={12} strokeWidth={2} />
                    </div>
                  </div>
                } 
                title="Credit card promos" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative">
                    <CreditCard size={22} strokeWidth={1.5} />
                    <div className="absolute -bottom-1 -left-1 bg-white rounded-full">
                      <Coins size={12} strokeWidth={2} />
                    </div>
                  </div>
                } 
                title="Debit card promos" 
                hasBorder={false} 
                onClick={handleServiceClick}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#FFF0E6] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Insurance</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem 
                icon={
                  <div className="text-[#D84A4B] font-bold text-[10px] leading-none flex flex-col items-center justify-center w-[22px] h-[22px] border border-[#D84A4B] rounded-full">
                    AIA
                  </div>
                } 
                title="My AIA" 
                onClick={handleServiceClick}
              />
              <ServiceItem icon={<Shield size={22} strokeWidth={1.5} />} title="Get comprehensive coverage" onClick={handleServiceClick} />
              <ServiceItem 
                icon={
                  <div className="relative flex items-center justify-center w-[22px] h-[22px]">
                    <Shield size={22} strokeWidth={1.5} className="absolute" />
                    <Zap size={10} strokeWidth={2} className="absolute" />
                  </div>
                } 
                title="Get instant coverage" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative flex items-end w-[22px] h-[22px]">
                    <Home size={18} strokeWidth={1.5} className="absolute top-0 left-0" />
                    <Shield size={12} strokeWidth={1.5} className="absolute bottom-0 right-0 bg-white" />
                  </div>
                } 
                title="Get home insurance" 
                onClick={handleServiceClick}
              />
              <ServiceItem icon={<Accessibility size={22} strokeWidth={1.5} />} title="Get accident insurance" onClick={handleServiceClick} />
              <ServiceItem icon={<Bike size={22} strokeWidth={1.5} />} title="Get motor insurance" hasBorder={false} onClick={handleServiceClick} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#F0EDF7] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Payments & wallets</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem 
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h10l-5 8.5L2 4z" fill="#E31837"/>
                    <path d="M22 4H12l5 8.5L22 4z" fill="#00A5A5"/>
                    <path d="M7 12.5h10L12 21l-5-8.5z" fill="#FDB813"/>
                    <path d="M12 4l5 8.5H7L12 4z" fill="#6B21A8"/>
                  </svg>
                } 
                title="VYBE" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Zap size={22} strokeWidth={1.5} />} 
                title="QuickPay" 
                subtitle="Pay bills without enrolling"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Landmark size={22} strokeWidth={1.5} />} 
                title="eGov" 
                subtitle="Pay government fees"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<HandHeart size={22} strokeWidth={1.5} />} 
                title="eDonate" 
                subtitle="Send donations to support charities"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative flex items-center justify-center w-[22px] h-[22px]">
                    <RefreshCcw size={22} strokeWidth={1.5} />
                    <span className="absolute text-[8px] font-bold">₱</span>
                  </div>
                } 
                title="Auto Debit Arrangement" 
                subtitle="Set up recurring payments"
                hasBorder={false} 
                onClick={handleServiceClick}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#FFF8E7] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Remittance & foreign exchange</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem 
                icon={<Banknote size={22} strokeWidth={1.5} />} 
                title="BPI to Cash" 
                subtitle="Send money from your bank account to money partners like Cebuana Lhuillier, LBC, and more"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Send size={22} strokeWidth={1.5} className="transform -translate-y-0.5" />} 
                title="Outward Remittance" 
                subtitle="Send money to international bank accounts"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Banknote size={22} strokeWidth={1.5} />} 
                title="BPI Remit" 
                subtitle="Send money from your US bank account to any BPI account (Powered by Meridian)"
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative w-[24px] h-[24px]">
                    <div className="absolute top-0 left-0 bg-white rounded-full flex items-center justify-center w-[16px] h-[16px] border-[1.5px] border-[#5A6872] z-10">
                      <span className="text-[9px] font-bold leading-none text-[#5A6872]">₱</span>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full flex items-center justify-center w-[16px] h-[16px] border-[1.5px] border-[#5A6872]">
                      <span className="text-[9px] font-bold leading-none text-[#5A6872]">$</span>
                    </div>
                  </div>
                } 
                title="Buy US Dollar" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative w-[24px] h-[24px]">
                    <div className="absolute top-0 left-0 bg-white rounded-full flex items-center justify-center w-[16px] h-[16px] border-[1.5px] border-[#5A6872] z-10">
                      <span className="text-[9px] font-bold leading-none text-[#5A6872]">$</span>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full flex items-center justify-center w-[16px] h-[16px] border-[1.5px] border-[#5A6872]">
                      <span className="text-[9px] font-bold leading-none text-[#5A6872]">₱</span>
                    </div>
                  </div>
                } 
                title="Sell US Dollar" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={
                  <div className="relative flex items-center justify-center w-[22px] h-[22px]">
                    <RefreshCcw size={22} strokeWidth={1.5} />
                    <span className="absolute text-[8px] font-bold">₱</span>
                  </div>
                } 
                title="Forex rates" 
                hasBorder={false} 
                onClick={handleServiceClick}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
            {/* Section Header */}
            <div className="bg-[#F0F7FA] px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-[#2C404A] font-semibold text-[15px]">Information & support</h2>
            </div>
            
            {/* List Items */}
            <div className="flex flex-col">
              <ServiceItem 
                icon={
                  <div className="relative">
                    <MessageSquare size={22} strokeWidth={1.5} />
                    <PhoneCall size={10} strokeWidth={2} className="absolute bottom-0 right-0 bg-white" />
                  </div>
                } 
                title="Contact us" 
                onClick={() => setShowContactUs(true)}
              />
              <ServiceItem 
                icon={
                  <div className="relative">
                    <MessageSquare size={22} strokeWidth={1.5} />
                    <PhoneCall size={10} strokeWidth={2} className="absolute bottom-0 right-0 bg-white" />
                  </div>
                } 
                title="Let's chat" 
                onClick={handleServiceClick}
              />
              <ServiceItem 
                icon={<Info size={22} strokeWidth={1.5} />} 
                title="About the app" 
                hasBorder={false} 
                onClick={() => setShowAboutApp(true)}
              />
            </div>
          </div>

          <div className="px-4 text-center text-[13px] text-gray-500 mb-4">
            By using this service, you confirm that you have read, understood and that you accept our <span className="underline decoration-gray-400 underline-offset-2">Terms & Conditions</span>.
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-[72px] bg-white flex justify-between items-center px-10 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-10">
        <button 
          onClick={() => setCurrentTab('login')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'login' ? 'text-[#E31837]' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
        >
          <LogIn size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Login</span>
        </button>

        {/* Center FAB */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button 
            onClick={() => setShowQRScanner(true)}
            className="w-16 h-16 bg-[#D84A4B] rounded-full border-4 border-white flex items-center justify-center shadow-sm hover:bg-[#C63A3B] transition-colors"
          >
            <QrCode size={28} color="white" strokeWidth={1.5} />
          </button>
        </div>

        <button 
          onClick={() => setCurrentTab('services')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'services' ? 'text-[#E31837]' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
        >
          <HandCoins size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">More services</span>
        </button>
      </div>

      {/* Notifications Overlay */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotifications(false)}
            className="absolute inset-0 bg-black/50"
          />
          
          {/* Slide-up Panel */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white rounded-t-2xl w-full max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-end pt-4 pr-4 pb-2">
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-[#5A6872] hover:text-gray-900 p-1"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="px-6 pb-12 overflow-y-auto">
              <h2 className="text-[20px] font-bold text-[#113349] mb-5">Notifications</h2>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[#113349] font-bold text-[14px]">Meralco due? We got you!</h3>
                  <span className="text-[#9BA3AF] text-[11px]">18 Nov 2025</span>
                </div>
                <p className="text-[#5A6872] text-[13px] leading-relaxed">
                  Real-time posting, no added fees. Settle your bill today and tap 'Add as Favorites' to save your Meralco account details.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
