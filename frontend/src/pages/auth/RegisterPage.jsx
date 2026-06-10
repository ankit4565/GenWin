'use client';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Globe, User, Phone, MapPin, AlertCircle, Check } from 'lucide-react';
import defaultVideoUrl from '../../assets/VIDEO-2026-05-28-15-17-14.mp4'
import { register, saveAuthTokens } from '../../api/authApi'


/* ─── Google icon SVG ─── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

/* ─── Video Background ─── */
function VideoBackground({ videoUrl }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 1 }} />
      <video
        ref={ref}
        autoPlay loop muted playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}

/* ─── Animated Input ─── */
function FormInput({ icon, type, placeholder, value, onChange, rightSlot, label, hint, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
          {label}
        </label>
        {hint}
      </div>
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${focused ? 'rgba(172,244,164,0.5)' : 'rgba(255,255,255,0.1)'}`,
          transition: 'border-color 0.25s, box-shadow 0.25s',
          boxShadow: focused ? '0 0 0 3px rgba(172,244,164,0.1)' : 'none',
        }}
      >
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: focused ? 'rgba(172,244,164,0.8)' : 'rgba(255,255,255,0.4)', transition: 'color 0.25s' }}>
          {icon}
        </div>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '13px 14px 13px 44px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {rightSlot && (
          <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Toggle ─── */
function Toggle({ checked, onChange }) {
  return (
    <div onClick={onChange} style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer', flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 999,
        background: checked ? '#1b5e20' : 'rgba(255,255,255,0.15)',
        border: checked ? '1px solid rgba(172,244,164,0.4)' : '1px solid rgba(255,255,255,0.12)',
        transition: 'all 0.22s',
      }} />
      <div style={{
        position: 'absolute', top: 3, left: checked ? 20 : 3,
        width: 16, height: 16, borderRadius: 999, background: '#fff',
        transition: 'left 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

/* ─── Password Strength Indicator ─── */
function PasswordStrength({ password }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { level: 1, label: 'Weak', color: 'rgba(239,83,80,0.7)' },
      { level: 2, label: 'Fair', color: 'rgba(251,188,4,0.7)' },
      { level: 3, label: 'Good', color: 'rgba(76,175,80,0.7)' },
      { level: 4, label: 'Strong', color: 'rgba(76,175,80,0.9)' },
    ];
    return levels[strength - 1] || levels[0];
  };

  const strength = getStrength();
  if (!password) return null;

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 8 }}>
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            background: i <= strength.level ? strength.color : 'rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
          }}
        />
      ))}
      <span style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: strength.color, marginLeft: 8 }}>
        {strength.label}
      </span>
    </div>
  );
}

/* ─── Main Register Form ─── */
function RegisterForm({ onSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '' | null,
    password: '',
    confirm_password: '',
    address: '' | null,
    agree_terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirm_password) errors.confirm_password = 'Passwords do not match';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.agree_terms) errors.agree_terms = 'You must agree to terms and conditions';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        address: formData.address,
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Registration failed');
      }

      saveAuthTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      setStatus('success');
      onSubmit?.(response, formData);

      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (err) {
      setStatus('error');
      setError(err?.response?.data?.message || err.message || 'Unable to register');
      setTimeout(() => setStatus('idle'), 1600);
    }
  };

  return (
    <div style={{
      background: 'rgba(10,20,15,0.62)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      border: '1px solid rgba(172,244,164,0.12)',
      borderRadius: 24,
      padding: '40px 40px 36px',
      width: '100%',
      maxWidth: 500,
      boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
      animation: 'cardIn 0.6s cubic-bezier(0.34,1.2,0.64,1) both',
      maxHeight: '90vh',
      overflowY: 'auto',
    }}>

      {/* Logo + title */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18,
          padding: '6px 14px', background: 'rgba(0,69,13,0.35)', borderRadius: 999,
          border: '1px solid rgba(172,244,164,0.2)',
          animation: 'fadeSlideDown 0.5s 0.1s both',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="rgba(172,244,164,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="rgba(172,244,164,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(172,244,164,0.85)', letterSpacing: '0.08em' }}>GenWin</span>
        </div>

        <h2 style={{
          fontFamily: "'Hanken Grotesk', sans-serif",
          fontSize: 32, fontWeight: 700, color: '#fff',
          margin: '0 0 8px',
          letterSpacing: '-0.03em',
          animation: 'fadeSlideDown 0.5s 0.18s both',
          textShadow: '0 0 40px rgba(172,244,164,0.25)',
        }}>
          Join GenWin
        </h2>
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.55)',
          fontFamily: "'DM Sans', sans-serif",
          margin: 0, lineHeight: 1.6,
          animation: 'fadeSlideDown 0.5s 0.24s both',
        }}>
          Create your account to access Bhopal Smart City<br />services and resources.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Full Name */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.3s both' }}>
          <FormInput
            label="Full Name"
            icon={<User size={17} />}
            type="text"
            placeholder="John Doe"
            value={formData.full_name}
            onChange={handleChange}
            name="full_name"
          />
          {fieldErrors.full_name && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.full_name}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.36s both' }}>
          <FormInput
            label="Email Address"
            icon={<Mail size={17} />}
            type="email"
            placeholder="citizen@bhopal-sc.gov.in"
            value={formData.email}
            onChange={handleChange}
            name="email"
          />
          {fieldErrors.email && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.42s both' }}>
          <FormInput
            label="Phone Number"
            icon={<Phone size={17} />}
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            name="phone"
          />
          {fieldErrors.phone && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.phone}
            </div>
          )}
        </div>

        {/* Address */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.48s both' }}>
          <FormInput
            label="Address"
            icon={<MapPin size={17} />}
            type="text"
            placeholder="123 Smart City, Bhopal"
            value={formData.address}
            onChange={handleChange}
            name="address"
          />
          {fieldErrors.address && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.address}
            </div>
          )}
        </div>

        {/* Password */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.54s both' }}>
          <FormInput
            label="Password"
            icon={<Lock size={17} />}
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            name="password"
            rightSlot={
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0, display: 'flex' }}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
          <PasswordStrength password={formData.password} />
          {fieldErrors.password && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ animation: 'fadeSlideUp 0.5s 0.6s both' }}>
          <FormInput
            label="Confirm Password"
            icon={<Lock size={17} />}
            type={showConfirmPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={handleChange}
            name="confirm_password"
            rightSlot={
              <button type="button" onClick={() => setShowConfirmPw(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0, display: 'flex' }}>
                {showConfirmPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            }
          />
          {fieldErrors.confirm_password && (
            <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: 4 }}>
              {fieldErrors.confirm_password}
            </div>
          )}
        </div>

        {error && (
          <div style={{
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid rgba(239,83,80,0.28)',
            background: 'rgba(239,83,80,0.1)',
            color: 'rgba(255,220,220,0.95)',
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            animation: 'fadeSlideUp 0.3s both',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Terms Agreement */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, animation: 'fadeSlideUp 0.5s 0.66s both' }}>
          <input
            type="checkbox"
            checked={formData.agree_terms}
            onChange={handleChange}
            name="agree_terms"
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              cursor: 'pointer',
              accentColor: '#1b5e20',
              marginTop: 2,
            }}
          />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', flex: 1 }}>
            I agree to the{' '}
            <a href="#" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'rgba(172,244,164,0.9)'}
              onMouseLeave={e => e.target.style.color = '#fff'}
            >
              Terms and Conditions
            </a>
            {' '}and{' '}
            <a href="#" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'rgba(172,244,164,0.9)'}
              onMouseLeave={e => e.target.style.color = '#fff'}
            >
              Privacy Policy
            </a>
          </span>
        </div>
        {fieldErrors.agree_terms && (
          <div style={{ fontSize: 12, color: 'rgba(239,83,80,0.9)', marginTop: -8 }}>
            {fieldErrors.agree_terms}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '14px 0',
            borderRadius: 12,
            border: 'none',
            background: status === 'success'
              ? 'rgba(27,94,32,0.9)'
              : 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)',
            color: '#fff',
            fontSize: 15,
            fontFamily: "'Hanken Grotesk', sans-serif",
            fontWeight: 600,
            letterSpacing: '-0.01em',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s',
            boxShadow: status !== 'loading' ? '0 8px 32px rgba(0,69,13,0.45), 0 0 0 1px rgba(172,244,164,0.15) inset' : 'none',
            opacity: status === 'loading' ? 0.7 : 1,
            animation: 'fadeSlideUp 0.5s 0.72s both',
          }}
          onMouseEnter={e => { if (status === 'idle') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,69,13,0.6), 0 0 0 1px rgba(172,244,164,0.25) inset'; } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,69,13,0.45), 0 0 0 1px rgba(172,244,164,0.15) inset'; }}
        >
          {status === 'loading' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Creating Account…
            </>
          ) : status === 'success' ? (
            <>✓ Account Created</>
          ) : (
            <>Create Account <ArrowRight size={17} /></>
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ position: 'relative', margin: '24px 0 18px', display: 'flex', alignItems: 'center', animation: 'fadeSlideUp 0.5s 0.78s both' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        <span style={{ padding: '0 16px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Or Register With
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
      </div>

      {/* Google SSO */}
      <button
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.05)',
          color: '#fff',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'background 0.2s, border-color 0.2s',
          animation: 'fadeSlideUp 0.5s 0.84s both',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Login Link */}
      <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif", animation: 'fadeSlideUp 0.5s 0.9s both' }}>
        Already have an account?{' '}
        <a href="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.color = 'rgba(172,244,164,0.9)'}
          onMouseLeave={e => e.target.style.color = '#fff'}
        >
          Sign In
        </a>
      </p>
    </div>
  );
}

/* ─── Page ─── */
export default function RegisterPage({ videoUrl, onSubmit }) {
  const src = videoUrl || defaultVideoUrl;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        input::placeholder { color: rgba(255,255,255,0.3); }
        input { font-family: 'DM Sans', sans-serif !important; }
        a:focus-visible { outline: 2px solid rgba(172,244,164,0.6); outline-offset: 2px; border-radius: 4px; }
      `}</style>

      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>

        {/* Video BG */}
        <VideoBackground videoUrl={src} />

        {/* Ambient glow behind card */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,69,13,0.35) 0%, transparent 70%)',
          borderRadius: '50%', zIndex: 1, pointerEvents: 'none',
          animation: 'glowPulse 4s ease-in-out infinite',
        }} />

        {/* Top nav */}
        <nav style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '18px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10,
          animation: 'fadeSlideDown 0.5s both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="rgba(172,244,164,0.85)" strokeWidth="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="rgba(172,244,164,0.85)" strokeWidth="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="rgba(172,244,164,0.85)" strokeWidth="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="rgba(172,244,164,0.85)" strokeWidth="1.5"/>
            </svg>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>
              GenWin
            </span>
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 999, padding: '7px 14px',
            color: 'rgba(255,255,255,0.8)', fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em',
            cursor: 'pointer',
          }}>
            <Globe size={14} />
            EN / HI
          </button>
        </nav>

        {/* Card */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 500 }}>
          <RegisterForm onSubmit={onSubmit} />
        </div>

        {/* Footer */}
        <footer style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10,
          animation: 'fadeSlideUp 0.5s 0.96s both',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
            © 2024 Bhopal Smart City Development Corporation Ltd.
          </span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Emergency Contacts', 'Support'].map((l, i) => (
              <a key={l} href="#" style={{
                fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                color: i === 1 ? 'rgba(239,83,80,0.75)' : 'rgba(255,255,255,0.35)',
                textDecoration: 'none',
              }}>
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
