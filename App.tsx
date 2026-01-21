
import React, { useState, useCallback } from 'react';
import { 
  User, Mail, Phone, Briefcase, Grid, FileText, Target, Star, 
  Droplet, Link as LinkIcon, Users, Globe, Clock, DollarSign, 
  MessageSquare, Send, Zap, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { ProjectFormData, DesignType } from './types';
import FormInput from './components/FormInput';
import { optimizeProjectBrief } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    designTypes: [],
    description: '',
    goals: '',
    brandStatus: '',
    brandPersonality: '',
    colors: '',
    references: '',
    audience: '',
    market: '',
    deadline: '',
    budget: '',
    additionalNotes: ''
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDesignType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      designTypes: prev.designTypes.includes(type) 
        ? prev.designTypes.filter(t => t !== type)
        : [...prev.designTypes, type]
    }));
  };

  const handleOptimize = async () => {
    if (!formData.description) {
      alert("يرجى كتابة وصف للمشروع أولاً ليتمكن الذكاء الاصطناعي من تحسينه.");
      return;
    }
    setIsOptimizing(true);
    try {
      const suggestions = await optimizeProjectBrief(formData.description, formData.designTypes);
      setAiSuggestions(suggestions);
    } catch (error) {
      alert("حدث خطأ أثناء محاولة تحسين الطلب. يرجى المحاولة لاحقاً.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestions) return;
    setFormData(prev => ({
      ...prev,
      description: aiSuggestions.improvedDescription,
      brandPersonality: aiSuggestions.brandPersonality,
      colors: aiSuggestions.suggestedColors
    }));
    setAiSuggestions(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div className="relative overflow-x-hidden pb-20 pt-10 px-4 md:px-0">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-200/40 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-200/40 rounded-full blur-[80px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-3xl shadow-xl shadow-indigo-200 mb-8 animate-float">
            <Zap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
            نموذج طلب مشروع تصميم
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            حوّل أفكارك إلى واقع مبهر مع تصاميم احترافية تعكس هويتك الفريدة
          </p>
        </header>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="glass rounded-[40px] p-8 md:p-14 shadow-2xl shadow-indigo-100/50 border border-white">
          
          {/* Section: Client Info */}
          <SectionHeader icon={<User className="text-white w-6 h-6" />} title="معلومات العميل" color="bg-indigo-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput 
              label="الاسم الكامل" name="fullName" value={formData.fullName} 
              onChange={handleInputChange} required placeholder="أدخل اسمك الكامل" icon={<User className="w-5 h-5 text-slate-400" />} 
            />
            <FormInput 
              label="البريد الإلكتروني" name="email" type="email" value={formData.email} 
              onChange={handleInputChange} required placeholder="example@domain.com" icon={<Mail className="w-5 h-5 text-slate-400" />} 
            />
            <FormInput 
              label="رقم الهاتف" name="phone" value={formData.phone} 
              onChange={handleInputChange} placeholder="+966 5X XXX XXXX" icon={<Phone className="w-5 h-5 text-slate-400" />} 
            />
            <FormInput 
              label="اسم الشركة" name="company" value={formData.company} 
              onChange={handleInputChange} placeholder="اسم علامتك التجارية" icon={<Briefcase className="w-5 h-5 text-slate-400" />} 
            />
          </div>

          {/* Section: Project Type */}
          <SectionHeader icon={<Grid className="text-white w-6 h-6" />} title="نوع المشروع" color="bg-cyan-500" />
          <div className="mb-8">
            <label className="block mb-4 font-bold text-slate-700">اختر أنواع التصميم المطلوبة</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(DesignType).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleDesignType(label)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all font-bold text-sm text-right ${
                    formData.designTypes.includes(label)
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-100"
                      : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    formData.designTypes.includes(label) ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {getDesignIcon(label)}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Project Description with AI Assistant */}
          <div className="relative">
            <FormInput 
              as="textarea" label="وصف المشروع بالتفصيل" name="description" value={formData.description} 
              onChange={handleInputChange} required placeholder="اشرح لنا بالتفصيل ما تحتاجه..." icon={<FileText className="w-5 h-5 text-slate-400" />} 
            />
            
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="absolute left-4 bottom-[30px] flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-all shadow-md"
            >
              {isOptimizing ? "جاري التحسين..." : <><Sparkles className="w-3.5 h-3.5" /> تحسين بواسطة الذكاء الاصطناعي</>}
            </button>
          </div>

          {/* AI Suggestions Modal */}
          {aiSuggestions && (
            <div className="my-6 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[2rem] text-white shadow-xl animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-indigo-100" />
                  </div>
                  <h4 className="font-black text-lg">اقتراحات الذكاء الاصطناعي</h4>
                </div>
                <button onClick={() => setAiSuggestions(null)} className="text-white/60 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-sm font-medium leading-relaxed">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                  <p className="text-indigo-200 mb-1 font-bold">الوصف المقترح:</p>
                  <p>{aiSuggestions.improvedDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <p className="text-indigo-200 mb-1 font-bold">الألوان المقترحة:</p>
                    <p>{aiSuggestions.suggestedColors}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                    <p className="text-indigo-200 mb-1 font-bold">الشخصية:</p>
                    <p>{aiSuggestions.brandPersonality}</p>
                  </div>
                </div>
                <div className="bg-amber-400/20 p-4 rounded-xl border border-amber-400/30 flex gap-3">
                  <Zap className="w-5 h-5 text-amber-300 shrink-0" />
                  <p><span className="font-bold text-amber-200">نصيحة الخبراء:</span> {aiSuggestions.proTip}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={applyAiSuggestion}
                  className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> تطبيق الاقتراحات
                </button>
                <button 
                  type="button" 
                  onClick={() => setAiSuggestions(null)}
                  className="bg-transparent border border-white/30 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                >
                  تجاهل
                </button>
              </div>
            </div>
          )}

          <FormInput 
            as="textarea" label="ما الهدف من هذا التصميم؟" name="goals" value={formData.goals} 
            onChange={handleInputChange} placeholder="مثال: جذب العملاء، زيادة المبيعات..." icon={<Target className="w-5 h-5 text-slate-400" />} 
          />

          {/* Section: Brand Identity */}
          <SectionHeader icon={<Star className="text-white w-6 h-6" />} title="الأسلوب والهوية" color="bg-amber-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput 
              as="select" label="هل لديك شعار حالي؟" name="brandStatus" value={formData.brandStatus} onChange={handleInputChange} required icon={<Sparkles className="w-5 h-5 text-slate-400" />}
            >
              <option value="">اختر...</option>
              <option value="none">لا، أحتاج شعار جديد</option>
              <option value="exists">نعم، لدي شعار وأريد استخدامه</option>
              <option value="update">نعم، وأريد تطويره</option>
            </FormInput>
            <FormInput 
              as="select" label="شخصية العلامة التجارية" name="brandPersonality" value={formData.brandPersonality} onChange={handleInputChange} icon={<Star className="w-5 h-5 text-slate-400" />}
            >
              <option value="">اختر الأسلوب...</option>
              <option value="minimal">بسيط وعصري (Minimal)</option>
              <option value="luxury">فاخر وراقي (Luxury)</option>
              <option value="modern">حديث ومتطور (Modern)</option>
              <option value="bold">جريء وقوي (Bold)</option>
              <option value="playful">مرح ومبتكر (Playful)</option>
              <option value="professional">احترافي (Professional)</option>
            </FormInput>
          </div>
          <FormInput 
            label="الألوان المفضلة" name="colors" value={formData.colors} 
            onChange={handleInputChange} placeholder="مثال: أزرق سماوي، ذهبي، #667eea" icon={<Droplet className="w-5 h-5 text-slate-400" />} 
          />
          <FormInput 
            as="textarea" label="روابط مرجعية أو مصادر إلهام" name="references" value={formData.references} 
            onChange={handleInputChange} placeholder="ضع روابط لتصاميم أعجبتك..." icon={<LinkIcon className="w-5 h-5 text-slate-400" />} 
          />

          {/* Section: Audience */}
          <SectionHeader icon={<Users className="text-white w-6 h-6" />} title="الجمهور والسوق" color="bg-emerald-500" />
          <FormInput 
            as="textarea" label="صف جمهورك المستهدف" name="audience" value={formData.audience} 
            onChange={handleInputChange} required placeholder="مثال: شباب من 18-35 سنة..." icon={<Users className="w-5 h-5 text-slate-400" />} 
          />
          <FormInput 
            as="select" label="السوق المستهدف" name="market" value={formData.market} onChange={handleInputChange} icon={<Globe className="w-5 h-5 text-slate-400" />}
          >
            <option value="">اختر السوق...</option>
            <option value="local">محلي (مدينة/منطقة)</option>
            <option value="national">وطني (السعودية)</option>
            <option value="global">عالمي</option>
          </FormInput>

          {/* Section: Timeline */}
          <SectionHeader icon={<Clock className="text-white w-6 h-6" />} title="الجدول الزمني والميزانية" color="bg-violet-500" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput 
              type="date" label="الموعد المطلوب للتسليم" name="deadline" value={formData.deadline} 
              onChange={handleInputChange} required icon={<Clock className="w-5 h-5 text-slate-400" />} 
            />
            <FormInput 
              label="الميزانية المتوقعة" name="budget" value={formData.budget} 
              onChange={handleInputChange} placeholder="مثال: 3000 ريال" icon={<DollarSign className="w-5 h-5 text-slate-400" />} 
            />
          </div>

          <FormInput 
            as="textarea" label="ملاحظات إضافية" name="additionalNotes" value={formData.additionalNotes} 
            onChange={handleInputChange} placeholder="أي معلومات أخرى..." icon={<MessageSquare className="w-5 h-5 text-slate-400" />} 
          />

          {/* Submit Button */}
          <div className="mt-12">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-black text-xl py-6 rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all flex items-center justify-center gap-4 group"
            >
              {isSubmitting ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>إرسال الطلب الآن</span>
                  <Send className="w-6 h-6 group-hover:translate-x-[-5px] group-hover:translate-y-[-5px] transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-400 font-bold text-sm">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة التصميم الذكي
        </footer>
      </div>

      {/* Success Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 max-w-lg w-full text-center shadow-3xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">تم الإرسال بنجاح!</h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              شكراً لثقتك بنا! تم استلام طلبك وسيقوم فريقنا بمراجعته والتواصل معك خلال 24 ساعة لمناقشة التفاصيل وبدء الإبداع.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="flex items-center gap-4 mb-8 mt-10 first:mt-0">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800">{title}</h3>
    <div className="flex-1 h-[2px] bg-slate-100 mr-2"></div>
  </div>
);

const getDesignIcon = (type: string) => {
  switch(type) {
    case DesignType.Logo: return <Target className="w-5 h-5" />;
    case DesignType.Branding: return <Star className="w-5 h-5" />;
    case DesignType.SocialMedia: return <Sparkles className="w-5 h-5" />;
    case DesignType.Print: return <FileText className="w-5 h-5" />;
    case DesignType.Packaging: return <Briefcase className="w-5 h-5" />;
    case DesignType.UIUX: return <Grid className="w-5 h-5" />;
    default: return <Sparkles className="w-5 h-5" />;
  }
};

export default App;
