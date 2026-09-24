import { useState, FormEvent } from 'react';
import { CreditCard, Smartphone, DollarSign, X, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { playFeedback } from '../utils/audio';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'pt' | 'en' | 'es';
}

const localLabels = {
  pt: {
    alertTitle: 'Quer ir para o Premium? Pague 2.99€',
    payNow: 'Pagar agora',
    cancel: 'Cancelar',
    title: 'ÁREA PREMIUM 👑',
    subtitle: 'Ativação vitalícia sem anúncios ou limites',
    chooseMethod: 'Escolha o método de pagamento:',
    cardNumber: 'Número do Cartão (Visa/Mastercard)',
    cardExpiry: 'Validade (MM/AA)',
    cardCvv: 'CVV',
    phoneLabel: 'Número de Telemóvel MBWay',
    paypalText: 'Ao escolher PayPal, será redirecionado para concluir de forma segura.',
    paypalLinkText: 'Ir para paypal.com',
    payButtonText: 'Pagar 2.99€',
    successTitle: 'Premium Ativado! 🎉',
    successDesc: 'Obrigado pelo seu apoio. Todas as funcionalidades premium foram desbloqueadas.',
    close: 'Fechar',
    requiredField: 'Campo obrigatório',
    validating: 'A processar pagamento...',
  },
  en: {
    alertTitle: 'Do you want to go Premium? Pay €2.99',
    payNow: 'Pay now',
    cancel: 'Cancel',
    title: 'PREMIUM AREA 👑',
    subtitle: 'Lifetime activation with no ads or limits',
    chooseMethod: 'Choose payment method:',
    cardNumber: 'Card Number (Visa/Mastercard)',
    cardExpiry: 'Expiry (MM/YY)',
    cardCvv: 'CVV',
    phoneLabel: 'MBWay Phone Number',
    paypalText: 'By choosing PayPal, you will be redirected to complete securely.',
    paypalLinkText: 'Go to paypal.com',
    payButtonText: 'Pay 2.99€',
    successTitle: 'Premium Activated! 🎉',
    successDesc: 'Thank you for your support. All premium features have been unlocked.',
    close: 'Close',
    requiredField: 'Required field',
    validating: 'Processing payment...',
  },
  es: {
    alertTitle: '¿Quieres hacerte Premium? Paga 2.99€',
    payNow: 'Pagar ahora',
    cancel: 'Cancelar',
    title: 'ÁREA PREMIUM 👑',
    subtitle: 'Activación de por vida sin anuncios ni límites',
    chooseMethod: 'Elija método de pago:',
    cardNumber: 'Número de Tarjeta (Visa/Mastercard)',
    cardExpiry: 'Fecha de caducidad (MM/AA)',
    cardCvv: 'CVV',
    phoneLabel: 'Número de Teléfono MBWay',
    paypalText: 'Al elegir PayPal, será redirigido para completar de forma segura.',
    paypalLinkText: 'Ir a paypal.com',
    payButtonText: 'Pagar 2.99€',
    successTitle: '¡Premium Activado! 🎉',
    successDesc: 'Gracias por su apoyo. Todas las funciones premium han sido desbloqueadas.',
    close: 'Cerrar',
    requiredField: 'Campo obligatorio',
    validating: 'Procesando pago...',
  }
};

export default function PremiumModal({ isOpen, onClose, language }: PremiumModalProps) {
  const [step, setStep] = useState<'alert' | 'payment-options' | 'success'>('alert');
  const [method, setMethod] = useState<'card' | 'mbway' | 'paypal'>('card');
  
  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [phone, setPhone] = useState('');
  
  // Validation tracking
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const labels = localLabels[language] || localLabels.pt;

  const handlePayNowClick = () => {
    playFeedback();
    setStep('payment-options');
  };

  const handleCancelClick = () => {
    playFeedback();
    onClose();
    // reset
    setStep('alert');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setPhone('');
    setErrorMsg(null);
  };

  const handlePaySubmit = (e: FormEvent) => {
    e.preventDefault();
    playFeedback();
    setErrorMsg(null);

    // Validation
    if (method === 'card') {
      if (!cardNumber || cardNumber.trim().length < 12) {
        setErrorMsg(labels.requiredField + ' (Cartão Inválido)');
        return;
      }
      if (!expiry || !cvv) {
        setErrorMsg(labels.requiredField);
        return;
      }
    } else if (method === 'mbway') {
      if (!phone || phone.trim().length < 9) {
        setErrorMsg(labels.requiredField + ' (Número Telemóvel Inválido)');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment transaction
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      playFeedback();
    }, 1500);
  };

  const selectMethod = (m: 'card' | 'mbway' | 'paypal') => {
    playFeedback();
    setMethod(m);
    setErrorMsg(null);
  };

  const openPaypalDotCom = () => {
    playFeedback();
    window.open('https://www.paypal.com', '_blank', 'noreferrer,noopener');
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
      <div 
        className="w-full max-w-md bg-[#000000] text-white border-2 border-zinc-800 rounded-3xl p-6 shadow-2xl relative flex flex-col justify-between my-8 min-h-[400px] transition-all animate-in zoom-in-95 duration-250"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Header Close Arrow */}
        <button
          onClick={handleCancelClick}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white rounded-full transition-transform active:scale-90"
          aria-label={labels.close}
        >
          <X className="w-6 h-6" />
        </button>

        {/* STEP 1: Confirmation Alert Dialog */}
        {step === 'alert' && (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-5xl animate-pulse">
              👑
            </div>
            
            <div className="space-y-2 px-2">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-snug">
                {labels.alertTitle}
              </h2>
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                {labels.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
              <button
                id="btn-alert-pay-now"
                onClick={handlePayNowClick}
                className="w-full h-14 bg-white text-black font-extrabold text-base rounded-full hover:bg-zinc-200 transition-transform active:scale-95 cursor-pointer flex items-center justify-center uppercase tracking-wide"
              >
                {labels.payNow}
              </button>
              
              <button
                id="btn-alert-cancel"
                onClick={handleCancelClick}
                className="w-full h-12 bg-transparent text-zinc-400 font-bold text-sm rounded-full hover:text-white transition-colors cursor-pointer flex items-center justify-center uppercase"
              >
                {labels.cancel}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 3-Option Payment Selector Screen */}
        {step === 'payment-options' && (
          <div className="flex-grow flex flex-col justify-between py-2">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-left mt-2">
                <span className="text-[10px] text-[#ff0000] font-black uppercase tracking-widest block mb-1">PROMOÇÃO DE HOJE</span>
                <h3 className="text-xl font-black uppercase tracking-tight">{labels.title}</h3>
                <p className="text-zinc-400 text-xs leading-normal">{labels.chooseMethod}</p>
              </div>

              {/* 3 Payment Tabs Options */}
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-900 pb-4">
                {/* 1. Visa/Mastercard */}
                <button
                  type="button"
                  onClick={() => selectMethod('card')}
                  className={`py-3.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border font-bold text-[11px] uppercase tracking-wide cursor-pointer ${
                    method === 'card'
                      ? 'bg-zinc-900 border-white text-white'
                      : 'bg-[#000000] border-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span>Visa/MC</span>
                </button>

                {/* 2. MBWay */}
                <button
                  type="button"
                  onClick={() => selectMethod('mbway')}
                  className={`py-3.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border font-bold text-[11px] uppercase tracking-wide cursor-pointer ${
                    method === 'mbway'
                      ? 'bg-zinc-900 border-white text-white'
                      : 'bg-[#000000] border-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 shrink-0" />
                  <span>MBWay</span>
                </button>

                {/* 3. PayPal */}
                <button
                  type="button"
                  onClick={() => selectMethod('paypal')}
                  className={`py-3.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border font-bold text-[11px] uppercase tracking-wide cursor-pointer ${
                    method === 'paypal'
                      ? 'bg-zinc-900 border-white text-white'
                      : 'bg-[#000000] border-zinc-900 text-zinc-500 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-5 h-5 shrink-0" />
                  <span>PayPal</span>
                </button>
              </div>

              {/* Dynamic Sub-forms based on active method */}
              <form onSubmit={handlePaySubmit} className="space-y-4 pt-2">
                {errorMsg && (
                  <div className="text-xs text-[#ff0000] font-black uppercase tracking-wide bg-[#ff0000]/10 p-2 text-center rounded-lg border border-[#ff0000]/30">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Visa/Mastercard Form */}
                {method === 'card' && (
                  <div className="space-y-3 animation-fade-in text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{labels.cardNumber}</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-base p-3 rounded-lg focus:border-white focus:ring-1 focus:ring-white outline-none active:bg-zinc-950"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{labels.cardExpiry}</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/AA"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-base p-3 rounded-lg focus:border-white focus:ring-1 focus:ring-white outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{labels.cardCvv}</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-base p-3 rounded-lg focus:border-white focus:ring-1 focus:ring-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* MBWay Form */}
                {method === 'mbway' && (
                  <div className="space-y-3 animation-fade-in text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{labels.phoneLabel}</label>
                      <input
                        type="tel"
                        required
                        maxLength={13}
                        placeholder="912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-base p-3 rounded-lg focus:border-white focus:ring-1 focus:ring-white outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Link info */}
                {method === 'paypal' && (
                  <div className="space-y-3 text-center py-4 bg-zinc-950 rounded-xl border border-zinc-900">
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-normal px-2">
                      {labels.paypalText}
                    </p>
                    <button
                      type="button"
                      onClick={openPaypalDotCom}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 border border-zinc-700 font-bold hover:bg-zinc-800 text-xs rounded-lg transition-transform active:scale-95 cursor-pointer max-w-max"
                    >
                      <span>{labels.paypalLinkText}</span>
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                )}

                {/* Strict Red Payment Button: #ff0000 */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-[#ff0000] text-white font-black text-base uppercase rounded-full hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  style={{ backgroundColor: '#ff0000' }}
                >
                  {isProcessing ? (
                    <span className="text-xs uppercase font-bold tracking-widest">{labels.validating}</span>
                  ) : (
                    <span>{labels.payButtonText}</span>
                  )}
                </button>
              </form>
            </div>
            
            <button
              onClick={handleCancelClick}
              className="text-center text-xs font-semibold text-zinc-500 hover:text-white uppercase mt-4 transition-colors tracking-wide cursor-pointer py-2"
            >
              {labels.cancel}
            </button>
          </div>
        )}

        {/* STEP 3: Successful Transaction Overlay */}
        {step === 'success' && (
          <div className="flex-grow flex flex-col items-center justify-center text-center py-6 space-y-4">
            <CheckCircle className="w-20 h-20 text-[#1DB954] animate-bounce" />
            <h2 className="text-2xl font-black uppercase text-white tracking-wide">
              {labels.successTitle}
            </h2>
            <p className="text-zinc-400 text-xs max-w-xs mx-auto leading-relaxed">
              {labels.successDesc}
            </p>
            
            <button
              id="premium-complete-done-btn"
              onClick={handleCancelClick}
              className="w-full h-14 bg-white text-black font-extrabold text-base rounded-full hover:bg-zinc-200 transition-transform active:scale-95 mt-6 uppercase tracking-wide cursor-pointer"
            >
              {labels.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
