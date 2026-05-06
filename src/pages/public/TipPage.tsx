import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { containsProfanity } from '@/utils/profanityFilter';
import './TipPage.css';

interface TipForm {
  reporter_name: string;
  reporter_email: string;
  reporter_phone: string;
  title: string;
  content: string;
}

const initialForm: TipForm = {
  reporter_name: '',
  reporter_email: '',
  reporter_phone: '',
  title: '',
  content: '',
};

export default function TipPage() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState<TipForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isKo = language === 'ko';

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Required field validation
    if (!form.title.trim() || !form.content.trim()) {
      alert(isKo
        ? '제목과 내용은 필수 입력 항목입니다.'
        : 'Title and content are required fields.');
      return;
    }

    // Profanity check on title
    const titleCheck = containsProfanity(form.title);
    if (!titleCheck.isClean) {
      alert(titleCheck.reason || (isKo
        ? '부적절한 내용이 포함되어 있습니다.'
        : 'Inappropriate content detected.'));
      return;
    }

    // Profanity check on content
    const contentCheck = containsProfanity(form.content);
    if (!contentCheck.isClean) {
      alert(contentCheck.reason || (isKo
        ? '부적절한 내용이 포함되어 있습니다.'
        : 'Inappropriate content detected.'));
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from('joongang_tips')
      .insert({
        reporter_name: form.reporter_name.trim() || null,
        reporter_email: form.reporter_email.trim() || null,
        reporter_phone: form.reporter_phone.trim() || null,
        title: form.title.trim(),
        content: form.content.trim(),
        status: 'received',
      });

    setSubmitting(false);

    if (error) {
      console.error('Tip submission error:', error);
      alert(isKo
        ? '제보 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        : 'An error occurred while submitting your tip. Please try again later.');
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
  }

  if (submitted) {
    return (
      <div className="tip-page">
        <div className="page-header-banner">
          <div className="container">
            <h1>{isKo ? '기사 제보' : 'News Tips'}</h1>
          </div>
        </div>
        <div className="container">
          <div className="tip-success">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <h2>{isKo ? '제보가 접수되었습니다.' : 'Your tip has been received.'}</h2>
            <p>{isKo ? '감사합니다.' : 'Thank you.'}</p>
            <button
              className="btn btn-primary"
              onClick={() => setSubmitted(false)}
              style={{ marginTop: '20px' }}
            >
              {isKo ? '새 제보하기' : 'Submit Another Tip'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tip-page">
      <div className="page-header-banner">
        <div className="container">
          <h1>{isKo ? '기사 제보' : 'News Tips'}</h1>
          <p>{isKo
            ? '여러분의 소중한 제보를 기다립니다.'
            : 'We welcome your valuable news tips.'}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="tip-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reporter_name">
                {isKo ? '이름' : 'Name'}
              </label>
              <input
                id="reporter_name"
                name="reporter_name"
                type="text"
                className="form-input"
                placeholder={isKo ? '이름을 입력하세요' : 'Enter your name'}
                value={form.reporter_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reporter_email">
                {isKo ? '이메일' : 'Email'}
              </label>
              <input
                id="reporter_email"
                name="reporter_email"
                type="email"
                className="form-input"
                placeholder={isKo ? '이메일을 입력하세요' : 'Enter your email'}
                value={form.reporter_email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reporter_phone">
                {isKo ? '전화번호' : 'Phone'}
              </label>
              <input
                id="reporter_phone"
                name="reporter_phone"
                type="tel"
                className="form-input"
                placeholder={isKo ? '전화번호를 입력하세요' : 'Enter your phone number'}
                value={form.reporter_phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                {isKo ? '제목' : 'Title'} <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder={isKo ? '제보 제목을 입력하세요' : 'Enter the tip title'}
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">
                {isKo ? '내용' : 'Content'} <span className="required">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                className="form-textarea"
                placeholder={isKo
                  ? '제보 내용을 상세히 작성해주세요'
                  : 'Please describe your tip in detail'}
                value={form.content}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg tip-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? (isKo ? '접수 중...' : 'Submitting...')
                : (isKo ? '제보하기' : 'Submit Tip')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
