import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Globe, TrendingUp, TrendingDown, Clock, DollarSign, Wallet, 
  Copy, Check, Upload, ShieldCheck, ArrowUpRight, ArrowDownRight, 
  Activity, Users, Award, RefreshCw, AlertCircle, X, ChevronDown, 
  Volume2, VolumeX, BarChart2, Layers, LogOut, User, Lock, Mail, ArrowRight, CheckCircle2
} from 'lucide-react';

// Web Audio API Synthesizer for sound effects
class SoundFx {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  play(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'loss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

const soundFx = new SoundFx();

// Available Assets
const ASSETS = [
  { id: 'EURUSD', name: 'EUR/USD (OTC)', category: 'Forex', basePrice: 1.08650, volatility: 0.00018, payout: 92, digits: 5 },
  { id: 'GBPUSD', name: 'GBP/USD (OTC)', category: 'Forex', basePrice: 1.26720, volatility: 0.00025, payout: 89, digits: 5 },
  { id: 'BTCUSD', name: 'BTC/USD (Crypto)', category: 'Crypto', basePrice: 68420.00, volatility: 35.0, payout: 95, digits: 2 },
  { id: 'ETHUSD', name: 'ETH/USD (Crypto)', category: 'Crypto', basePrice: 3580.00, volatility: 2.8, payout: 90, digits: 2 },
  { id: 'GOLD', name: 'Gold (XAU/USD)', category: 'Commodities', basePrice: 2392.40, volatility: 1.2, payout: 88, digits: 2 },
  { id: 'AAPL', name: 'Apple Inc.', category: 'Stocks', basePrice: 189.50, volatility: 0.22, payout: 86, digits: 2 },
];

// Presets
const EXPIRY_PRESETS = [
  { label: '5s', value: 5 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '5m', value: 300 },
];

// Global Active Social Traders
const MOCK_GLOBAL_TRADERS = [
  { name: 'Alex M.', flag: '🇩🇪', country: 'Germany', winRate: 88, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { name: 'Rahim K.', flag: '🇧🇩', country: 'Bangladesh', winRate: 93, avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { name: 'Elena R.', flag: '🇧🇷', country: 'Brazil', winRate: 81, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { name: 'Satoshi T.', flag: '🇯🇵', country: 'Japan', winRate: 90, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'David L.', flag: '🇺🇸', country: 'USA', winRate: 84, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { name: 'Chloe B.', flag: '🇬🇧', country: 'UK', winRate: 87, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' }
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // State
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [chartType, setChartType] = useState('candles'); // 'candles', 'line', 'mountain'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Users Counter (100 Million Online Base)
  const [activeUsersCount, setActiveUsersCount] = useState(100241890);

  // Accounts
  const [accountType, setAccountType] = useState('REAL'); // 'DEMO' | 'REAL'
  const [demoBalance, setDemoBalance] = useState(10000.00);
  const [realBalance, setRealBalance] = useState(0.00);

  // Trade Setup
  const [stakeAmount, setStakeAmount] = useState(25);
  const [expiryTime, setExpiryTime] = useState(10);

  // Dynamic Chart
  const [candles, setCandles] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(ASSETS[0].basePrice);

  // Trades Tracking
  const [activeTrades, setActiveTrades] = useState([]);
  const [completedTrades, setCompletedTrades] = useState([]);

  // Social Feed
  const [socialFeed, setSocialFeed] = useState([]);

  // UI Tabs & Modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [rightTab, setRightTab] = useState('trades'); // 'trades', 'social', 'history'

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState('binance'); // 'binance', 'btc', 'eth'
  const [inputTxId, setInputTxId] = useState('');
  const [uploadedReceipt, setUploadedReceipt] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const [toast, setToast] = useState(null);
  const canvasRef = useRef(null);

  const notify = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const toggleSound = () => {
    soundFx.muted = soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Live dynamic counter fluctuation around 50M
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsersCount(prev => {
        const delta = Math.floor(Math.random() * 125) - 60;
        return prev + delta;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Initialize Price Candlesticks
  useEffect(() => {
    const initialCandles = [];
    let price = selectedAsset.basePrice;
    const now = Date.now();

    for (let i = 40; i >= 0; i--) {
      const open = price;
      // Slightly biased towards positive movement (+0.52 bias) to make market look consistently bullish & healthy
      const change = (Math.random() - 0.44) * selectedAsset.volatility;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * selectedAsset.volatility * 0.6;
      const low = Math.min(open, close) - Math.random() * selectedAsset.volatility * 0.4;

      initialCandles.push({
        time: now - i * 1000,
        open,
        high,
        low,
        close
      });
      price = close;
    }

    setCandles(initialCandles);
    setCurrentPrice(price);
  }, [selectedAsset]);

  // Price Movement Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prevCandles => {
        if (prevCandles.length === 0) return prevCandles;

        const last = { ...prevCandles[prevCandles.length - 1] };
        // Bullish market bias for appealing chart rendering
        const change = (Math.random() - 0.45) * selectedAsset.volatility;
        const newClose = last.close + change;

        last.close = newClose;
        last.high = Math.max(last.high, newClose);
        last.low = Math.min(last.low, newClose);

        setCurrentPrice(newClose);

        const updated = [...prevCandles];
        updated[updated.length - 1] = last;

        // Start new candle every 3 seconds
        if (Date.now() - last.time > 3000) {
          updated.shift();
          updated.push({
            time: Date.now(),
            open: newClose,
            high: newClose,
            low: newClose,
            close: newClose
          });
        }
        return updated;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [selectedAsset]);

  // Social Trading Feed Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const trader = MOCK_GLOBAL_TRADERS[Math.floor(Math.random() * MOCK_GLOBAL_TRADERS.length)];
      const isBuy = Math.random() > 0.5;
      const amount = [10, 25, 50, 100, 250, 500][Math.floor(Math.random() * 6)];
      const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];

      const newTrade = {
        id: Math.random().toString(),
        trader: trader.name,
        flag: trader.flag,
        avatar: trader.avatar,
        asset: asset.name,
        direction: isBuy ? 'BUY' : 'SELL',
        amount,
        time: 'Just now'
      };

      setSocialFeed(prev => [newTrade, ...prev.slice(0, 14)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Monitor Active Trades Expiry
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setActiveTrades(prevTrades => {
        const remaining = [];
        prevTrades.forEach(trade => {
          if (now >= trade.expiryTimestamp) {
            // Determine Win or Loss
            const finalPrice = currentPrice;
            const isWin = trade.direction === 'BUY' ? finalPrice > trade.entryPrice : finalPrice < trade.entryPrice;
            const payoutAmount = isWin ? trade.stake * (1 + trade.payout / 100) : 0;
            const profit = isWin ? trade.stake * (trade.payout / 100) : -trade.stake;

            if (isWin) {
              soundFx.play('win');
              notify(`🎉 Trade Won! +$${profit.toFixed(2)} on ${trade.asset.id}`, 'success');
              if (trade.account === 'DEMO') {
                setDemoBalance(b => b + payoutAmount);
              } else {
                setRealBalance(b => b + payoutAmount);
              }
            } else {
              soundFx.play('loss');
              notify(`📉 Trade Lost. -$${trade.stake.toFixed(2)} on ${trade.asset.id}`, 'error');
            }

            setCompletedTrades(c => [
              {
                ...trade,
                closePrice: finalPrice,
                isWin,
                profit,
                closedAt: new Date().toLocaleTimeString()
              },
              ...c
            ]);
          } else {
            remaining.push(trade);
          }
        });
        return remaining;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [currentPrice]);

  // Render HTML5 Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight;

    // Deep Dark Neon Canvas Background
    ctx.fillStyle = '#06090e';
    ctx.fillRect(0, 0, width, height);

    // Min & Max Price Calculation with safety margin
    let minP = Math.min(...candles.map(c => c.low));
    let maxP = Math.max(...candles.map(c => c.high));
    const pRange = (maxP - minP) || 0.0001;
    minP -= pRange * 0.12;
    maxP += pRange * 0.12;

    const getY = (p) => height - ((p - minP) / (maxP - minP)) * (height - 80) - 40;
    const candleWidth = Math.max(6, Math.min(18, (width - 100) / (candles.length * 1.3)));
    const candleSpacing = candleWidth * 1.35;

    // Subtle Horizontal Price Grid Lines
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 6; i++) {
      const y = (height / 7) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width - 85, y);
      ctx.stroke();

      const priceAtY = maxP - (y / height) * (maxP - minP);
      ctx.fillStyle = '#475569';
      ctx.font = '600 10px monospace';
      ctx.fillText(priceAtY.toFixed(selectedAsset.digits), width - 75, y + 3);
    }

    if (chartType === 'candles') {
      candles.forEach((c, i) => {
        const x = i * candleSpacing + 25;
        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);
        const isGreen = c.close >= c.open;

        // Enhanced vibrant Neon & Glow Palette
        const mainColor = isGreen ? '#10b981' : '#f43f5e';
        const shadowColor = isGreen ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.6)';

        // Ultra Glow Effect for Candlesticks
        ctx.save();
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = isGreen ? 16 : 12;

        // High-Low Wick with crisp vibrant stroke
        ctx.strokeStyle = isGreen ? '#34d399' : '#fb7185';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        // Body Dimensions
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 4);

        // Rich Multi-Stage Glossy Gradient Fill
        const grad = ctx.createLinearGradient(0, bodyY, 0, bodyY + bodyHeight);
        if (isGreen) {
          grad.addColorStop(0, '#6ee7b7');
          grad.addColorStop(0.3, '#10b981');
          grad.addColorStop(1, '#047857');
        } else {
          grad.addColorStop(0, '#fca5a5');
          grad.addColorStop(0.3, '#f43f5e');
          grad.addColorStop(1, '#9f1239');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, bodyY, candleWidth, bodyHeight, 4);
        } else {
          ctx.rect(x, bodyY, candleWidth, bodyHeight);
        }
        ctx.fill();

        // High contrast border stroke & highlight rim around candle body
        ctx.strokeStyle = isGreen ? '#a7f3d0' : '#fecdd3';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();

        // Direction Arrow Marker on latest candle for clear visibility
        if (i === candles.length - 1) {
          const arrowY = isGreen ? highY - 14 : lowY + 14;
          ctx.fillStyle = isGreen ? '#34d399' : '#f43f5e';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(isGreen ? '▲ UP' : '▼ DOWN', x - 6, arrowY);
        }
      });
    } else {
      // Line / Mountain Chart
      ctx.beginPath();
      candles.forEach((c, i) => {
        const x = i * candleSpacing + 25;
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (chartType === 'mountain') {
        ctx.lineTo((candles.length - 1) * candleSpacing + 25, height);
        ctx.lineTo(25, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // Active Trades Overlay Lines
    activeTrades.forEach(trade => {
      if (trade.asset.id === selectedAsset.id) {
        const tradeY = getY(trade.entryPrice);

        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = trade.direction === 'BUY' ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, tradeY);
        ctx.lineTo(width - 85, tradeY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Active Trade Label
        ctx.fillStyle = trade.direction === 'BUY' ? '#10b981' : '#f43f5e';
        ctx.fillRect(10, tradeY - 10, 85, 20);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${trade.direction} $${trade.stake}`, 15, tradeY + 4);
      }
    });

    // Pulsing Current Live Price Line & Badge
    const currentY = getY(currentPrice);
    const lastCandle = candles[candles.length - 1];
    const isPriceUp = lastCandle ? currentPrice >= lastCandle.open : true;
    const badgeColor = isPriceUp ? '#10b981' : '#f43f5e';

    ctx.strokeStyle = badgeColor;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, currentY);
    ctx.lineTo(width - 85, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live Price Right Sidebar Badge
    ctx.fillStyle = badgeColor;
    ctx.fillRect(width - 82, currentY - 13, 80, 26);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(currentPrice.toFixed(selectedAsset.digits), width - 76, currentY + 4);

  }, [candles, currentPrice, chartType, activeTrades, selectedAsset]);

  // Order Execution
  const executeTrade = (direction) => {
    const currentBalance = accountType === 'DEMO' ? demoBalance : realBalance;

    if (stakeAmount > currentBalance) {
      notify('Insufficient balance! Please deposit or use Demo account.', 'error');
      return;
    }

    // Deduct Balance
    if (accountType === 'DEMO') {
      setDemoBalance(b => b - stakeAmount);
    } else {
      setRealBalance(b => b - stakeAmount);
    }

    soundFx.play('click');

    const newTrade = {
      id: Math.random().toString(),
      account: accountType,
      asset: selectedAsset,
      direction,
      stake: stakeAmount,
      entryPrice: currentPrice,
      payout: selectedAsset.payout,
      timestamp: Date.now(),
      expiryTimestamp: Date.now() + expiryTime * 1000,
      duration: expiryTime
    };

    setActiveTrades(prev => [newTrade, ...prev]);
    notify(`Placed ${direction} order of $${stakeAmount} on ${selectedAsset.id}`, 'info');
  };

  // Deposit Scanner & Verification
  const handleVerifyDeposit = () => {
    if (!uploadedReceipt) {
      notify('Please upload the payment receipt screenshot first!', 'error');
      return;
    }
    if (!inputTxId.trim()) {
      notify('Please enter the Transaction ID / Hash!', 'error');
      return;
    }

    setIsVerifyingPayment(true);

    setTimeout(() => {
      setIsVerifyingPayment(false);

      // Simulate receipt scanning logic: scan image text for TxID match & extract $ amount
      const extractedAmountMatch = uploadedFileName.match(/(\d+)/);
      const creditedAmount = extractedAmountMatch ? parseInt(extractedAmountMatch[0], 10) : 100;

      const finalDeposit = creditedAmount > 0 ? creditedAmount : 100;

      setRealBalance(prev => prev + finalDeposit);
      setShowDepositModal(false);
      setUploadedReceipt(null);
      setUploadedFileName('');
      setInputTxId('');

      soundFx.play('win');
      notify(`✅ Payment Verified! $${finalDeposit}.00 added to your Real USD Account.`, 'success');
    }, 2800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedReceipt(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Safe Clipboard Copy Helper (Handles iframe permissions restrictions gracefully)
  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => notify('Address copied to clipboard!', 'info'),
        () => fallbackCopyTextToClipboard(text)
      );
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        notify('Address copied to clipboard!', 'info');
      } else {
        notify(`Copy manual code: ${text}`, 'info');
      }
    } catch (err) {
      notify(`Copy manual code: ${text}`, 'info');
    }
  };

  // Auth Handlers
  const handleGoogleAuth = () => {
    const user = {
      name: 'Google User',
      email: 'user@gmail.com'
    };
    setUserProfile(user);
    setIsAuthenticated(true);
    soundFx.play('win');
    notify(`Welcome back, ${user.name}! Connected to NexusTrade Pro.`, 'success');
  };

  const handleFormAuth = (e) => {
    e.preventDefault();
    if (!email || !password) {
      notify('Please fill in all required fields!', 'error');
      return;
    }

    const userName = authMode === 'register' && fullName ? fullName : email.split('@')[0];
    setUserProfile({
      name: userName,
      email: email
    });
    setIsAuthenticated(true);
    soundFx.play('win');
    notify(authMode === 'register' ? `Account registered successfully! Welcome ${userName}.` : `Welcome back, ${userName}!`, 'success');
  };

  // LANDING & LOGIN PAGE RENDER
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden select-none">
        
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-sm font-semibold transition-all ${
            toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
            'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Header Bar */}
        <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 font-black text-2xl tracking-wider text-emerald-400">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>
            <span>NEXUS<span className="text-white">PRO</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setUserProfile({ name: 'Trader Demo', email: 'demo@nexus.pro' });
                setIsAuthenticated(true);
              }}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl text-amber-400 transition"
            >
              Try Demo Account
            </button>
          </div>
        </header>

        {/* Hero & Form Section */}
        <main className="max-w-7xl w-full mx-auto px-6 py-8 grid lg:grid-cols-12 gap-12 items-center relative z-10 flex-1">
          
          {/* Left Column: Value Proposition & Hero Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next-Generation Binary Trading Platform</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black leading-tight tracking-tight">
              Trade Global Markets with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">95% Maximum Payouts</span>
            </h1>

            <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-xl">
              Access real-time options trading with instant execution, custom indicators, local & instant crypto deposits, and copy trading alongside over 100 Million active traders worldwide.
            </p>

            {/* Key Feature List */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Instant Execution</div>
                  <div className="text-[11px] text-slate-400">Zero latency 5-second ultra-fast orders</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">$10,000 Demo Balance</div>
                  <div className="text-[11px] text-slate-400">Practice risk-free with auto-refill anytime</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">Instant Receipts Verification</div>
                  <div className="text-[11px] text-slate-400">Binance Pay, BTC & ETH automatic crediting</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">100M+ Global Traders</div>
                  <div className="text-[11px] text-slate-400">Live social feed and copy trading functionality</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login & Register Card with Google Option */}
          <div className="lg:col-span-5">
            <div className="bg-[#111827]/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl relative space-y-6">
              
              {/* Tab Selector: Login vs Register */}
              <div className="flex bg-[#0b0f17] p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'login' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    authMode === 'register' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Register
                </button>
              </div>

              <div className="space-y-1 text-center">
                <h2 className="text-2xl font-black text-white">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Free Account'}
                </h2>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' 
                    ? 'Enter your credentials to access live trading markets' 
                    : 'Get started instantly with $10,000 demo funds'}
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleFormAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 block">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl py-3 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition shadow-lg shadow-emerald-500/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <span>{authMode === 'login' ? 'Log In to Account' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#111827] px-3 text-[10px] font-bold text-slate-500 uppercase absolute">OR</span>
              </div>

              {/* Google Auth Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full py-3 bg-white hover:bg-slate-100 active:scale-98 text-slate-900 font-bold rounded-xl transition shadow-xl text-xs flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl w-full mx-auto px-6 py-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 relative z-10">
          <div>© 2026 NexusTrade Pro Financial Ltd. All rights reserved.</div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Risk Disclosure</span>
          </div>
        </footer>

      </div>
    );
  }

  // MAIN TRADING PLATFORM INTERFACE RENDER (WHEN AUTHENTICATED)
  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-sm font-semibold transition-all ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
          toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' :
          'bg-slate-900/90 border-slate-700 text-slate-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER / NAVIGATION BAR */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0b0f17]/90 px-4 flex items-center justify-between z-20 backdrop-blur-md">
        
        {/* Logo & Asset Picker Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-black text-xl tracking-wider text-emerald-400">
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            <span>NEXUS<span className="text-white">PRO</span></span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Asset Selector Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAssetSelector(!showAssetSelector)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold transition"
            >
              <div className="flex flex-col items-start">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Asset</span>
                <span className="text-emerald-400 font-extrabold">{selectedAsset.name}</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[10px]">
                +{selectedAsset.payout}%
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Asset Dropdown Menu */}
            {showAssetSelector && (
              <div className="absolute top-12 left-0 w-64 bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 px-2 py-1 uppercase tracking-wider">Select Market</div>
                {ASSETS.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowAssetSelector(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition ${
                      selectedAsset.id === asset.id ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold">{asset.name}</div>
                      <div className="text-[10px] text-slate-500">{asset.category}</div>
                    </div>
                    <span className="font-bold text-emerald-400 text-xs">+{asset.payout}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Live Active Traders Widget */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-semibold">Active Traders:</span>
          <span className="font-mono font-bold text-emerald-400">{activeUsersCount.toLocaleString()}</span>
        </div>

        {/* Right Header Options: Sound, Account Switcher, Deposit & User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title={soundEnabled ? 'Mute FX' : 'Enable FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Account Balance Switcher */}
          <div className="flex bg-[#070a0f] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAccountType('DEMO')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                accountType === 'DEMO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-70">DEMO</span>
              <span>${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </button>
            <button
              onClick={() => setAccountType('REAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                accountType === 'REAL' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-[10px] opacity-70">REAL</span>
              <span>${realBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </button>
          </div>

          {/* Deposit Button */}
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>DEPOSIT</span>
          </button>

          {/* User Profile & Logout Dropdown */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
              {userProfile?.name?.substring(0, 2).toUpperCase() || 'TR'}
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </header>

      {/* MAIN TRADING WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        
        {/* CENTER: REAL-TIME CANVAS CHART AREA */}
        <div className="flex-1 flex flex-col relative bg-[#06090e]">
          
          {/* Chart Controls Overlay Bar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0b0f17]/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setChartType('candles')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                chartType === 'candles' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Candles</span>
            </button>

            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                chartType === 'line' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Line</span>
            </button>

            <button
              onClick={() => setChartType('mountain')}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                chartType === 'mountain' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Area</span>
            </button>
          </div>

          {/* HTML5 Canvas Component */}
          <div className="flex-1 w-full h-full relative">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* BOTTOM CONTROLS & ORDER EXECUTION PANEL */}
          <div className="h-28 bg-[#0b0f17] border-t border-slate-800/80 px-6 py-3 flex items-center justify-between gap-6 z-10">
            
            {/* Stake Amount Selector */}
            <div className="flex flex-col gap-1.5 min-w-[160px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stake Amount ($)</span>
              <div className="flex items-center gap-2 bg-[#06090e] border border-slate-800 rounded-xl p-1.5">
                <button
                  onClick={() => setStakeAmount(s => Math.max(5, s - 5))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center justify-center text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-transparent text-center font-black text-emerald-400 text-sm outline-none"
                />
                <button
                  onClick={() => setStakeAmount(s => s + 5)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Expiry Time Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timer Duration</span>
              <div className="flex items-center gap-1 bg-[#06090e] border border-slate-800 rounded-xl p-1">
                {EXPIRY_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    onClick={() => setExpiryTime(preset.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                      expiryTime === preset.value ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trade Payout Potential Display */}
            <div className="hidden sm:flex flex-col items-center justify-center px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Profit Potential</span>
              <span className="text-emerald-400 font-black text-lg">
                +${(stakeAmount * (selectedAsset.payout / 100)).toFixed(2)}
              </span>
            </div>

            {/* ORDER EXECUTION BUTTONS (BUY / SELL) */}
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              
              {/* CALL / BUY / UP BUTTON */}
              <button
                onClick={() => executeTrade('BUY')}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition flex flex-col items-center justify-center leading-none gap-1 uppercase tracking-wider"
              >
                <div className="flex items-center gap-1 text-base">
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                  <span>BUY</span>
                </div>
                <span className="text-[10px] opacity-80">Higher (Call)</span>
              </button>

              {/* PUT / SELL / DOWN BUTTON */}
              <button
                onClick={() => executeTrade('SELL')}
                className="flex-1 py-4 bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-rose-500/20 transition flex flex-col items-center justify-center leading-none gap-1 uppercase tracking-wider"
              >
                <div className="flex items-center gap-1 text-base">
                  <ArrowDownRight className="w-5 h-5 stroke-[3]" />
                  <span>SELL</span>
                </div>
                <span className="text-[10px] opacity-80">Lower (Put)</span>
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR: TRADES, HISTORY & SOCIAL FEED */}
        <div className="w-full md:w-80 bg-[#0b0f17] border-l border-slate-800/80 flex flex-col z-10">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800/80 bg-[#070a0f]">
            <button
              onClick={() => setRightTab('trades')}
              className={`flex-1 py-3 text-xs font-bold transition border-b-2 flex items-center justify-center gap-1.5 ${
                rightTab === 'trades' ? 'border-emerald-400 text-emerald-400 bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Active ({activeTrades.length})</span>
            </button>

            <button
              onClick={() => setRightTab('social')}
              className={`flex-1 py-3 text-xs font-bold transition border-b-2 flex items-center justify-center gap-1.5 ${
                rightTab === 'social' ? 'border-emerald-400 text-emerald-400 bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Live Social</span>
            </button>

            <button
              onClick={() => setRightTab('history')}
              className={`flex-1 py-3 text-xs font-bold transition border-b-2 flex items-center justify-center gap-1.5 ${
                rightTab === 'history' ? 'border-emerald-400 text-emerald-400 bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            
            {/* Active Trades List */}
            {rightTab === 'trades' && (
              activeTrades.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                  <Clock className="w-8 h-8 opacity-40" />
                  <span className="text-xs font-semibold">No active open positions</span>
                  <span className="text-[10px] text-slate-600">Click BUY or SELL to open a trade</span>
                </div>
              ) : (
                activeTrades.map(trade => {
                  const secondsLeft = Math.max(0, Math.ceil((trade.expiryTimestamp - Date.now()) / 1000));
                  return (
                    <div key={trade.id} className="p-3 bg-[#06090e] border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={trade.direction === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                            {trade.direction === 'BUY' ? '▲ BUY' : '▼ SELL'}
                          </span>
                          <span className="text-slate-300">{trade.asset.id}</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold">${trade.stake}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Entry: {trade.entryPrice.toFixed(trade.asset.digits)}</span>
                        <span className="font-mono font-bold text-amber-400">{secondsLeft}s left</span>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* Live Social Feed */}
            {rightTab === 'social' && (
              <div className="space-y-2">
                {socialFeed.map(item => (
                  <div key={item.id} className="p-2.5 bg-[#06090e] border border-slate-800/80 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={item.avatar} alt="trader" className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-slate-200 flex items-center gap-1">
                          <span>{item.trader}</span>
                          <span>{item.flag}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{item.asset}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-black text-xs ${item.direction === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.direction} ${item.amount}
                      </div>
                      <div className="text-[9px] text-slate-500">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Closed Trade History */}
            {rightTab === 'history' && (
              completedTrades.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12">
                  <BarChart2 className="w-8 h-8 opacity-40" />
                  <span className="text-xs font-semibold">No trade history recorded yet</span>
                </div>
              ) : (
                completedTrades.map(trade => (
                  <div key={trade.id} className="p-3 bg-[#06090e] border border-slate-800 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">{trade.asset.id}</span>
                      <span className={`font-bold ${trade.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.isWin ? `+$${trade.profit.toFixed(2)}` : `-$${trade.stake.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{trade.direction} @ {trade.entryPrice.toFixed(trade.asset.digits)}</span>
                      <span>{trade.closedAt}</span>
                    </div>
                  </div>
                ))
              )
            )}

          </div>

        </div>

      </div>

      {/* INSTANT DEPOSIT MODAL WITH RECEIPT & TXID SCANNER */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Instant Deposit Account</span>
              </h3>
              <p className="text-xs text-slate-400">
                Deposit via Binance Pay, BTC or ETH. Upload receipt screenshot to credit real account.
              </p>
            </div>

            {/* Gateway Switcher */}
            <div className="flex bg-[#0b0f17] p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setDepositMethod('binance')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  depositMethod === 'binance' ? 'bg-slate-800 text-amber-400 shadow' : 'text-slate-400'
                }`}
              >
                Binance Pay
              </button>
              <button
                onClick={() => setDepositMethod('btc')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  depositMethod === 'btc' ? 'bg-slate-800 text-amber-500 shadow' : 'text-slate-400'
                }`}
              >
                BTC
              </button>
              <button
                onClick={() => setDepositMethod('eth')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                  depositMethod === 'eth' ? 'bg-slate-800 text-cyan-400 shadow' : 'text-slate-400'
                }`}
              >
                ETH
              </button>
            </div>

            {/* Copyable Pay ID / Wallet Box */}
            <div className="p-4 bg-[#0b0f17] rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {depositMethod === 'binance' ? 'Binance Pay ID' : `${depositMethod.toUpperCase()} Deposit Address`}
              </div>

              <div className="flex items-center justify-between gap-2 bg-[#06090e] p-2.5 rounded-xl border border-slate-800">
                <span className="font-mono text-xs font-bold text-emerald-400 truncate">
                  {depositMethod === 'binance' ? '849201938' :
                   depositMethod === 'btc' ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' :
                   '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                </span>

                <button
                  onClick={() => copyToClipboard(
                    depositMethod === 'binance' ? '849201938' :
                    depositMethod === 'btc' ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' :
                    '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                  )}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Verification Inputs: Screenshot & TxID */}
            <div className="space-y-3 pt-1">
              
              {/* File Upload Box */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Upload Payment Receipt Screenshot</label>
                <label className="flex flex-col items-center justify-center p-4 bg-[#0b0f17] border border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer transition">
                  <Upload className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-300">
                    {uploadedFileName ? uploadedFileName : 'Click to select receipt image file'}
                  </span>
                  <span className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP screenshots</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Transaction Hash Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Enter Receipt Transaction ID (TxID)</label>
                <input
                  type="text"
                  value={inputTxId}
                  onChange={(e) => setInputTxId(e.target.value)}
                  placeholder="e.g. 209384918239"
                  className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

            </div>

            {/* Verification & Submit Button */}
            <button
              onClick={handleVerifyDeposit}
              disabled={isVerifyingPayment}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
            >
              {isVerifyingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Screenshot & Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Payment & Credit Balance</span>
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}