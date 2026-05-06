import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Section, PositionType } from '@/types';
import './ArticleEditor.css';

const POSITION_OPTIONS: { value: PositionType; label: string }[] = [
  { value: 'main_headline', label: '메인 헤드라인' },
  { value: 'main_top', label: '메인 탑뉴스' },
  { value: 'main_center', label: '메인 중앙뉴스' },
  { value: 'main_recommend', label: '추천기사' },
  { value: 'main_photo_video', label: '포토/영상' },
  { value: 'sub_headline', label: '서브 헤드라인' },
  { value: 'sub_top', label: '서브 탑뉴스' },
  { value: 'sub_right', label: '서브 우측' },
];

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { staff } = useAuth();
  const isEdit = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [articleType, setArticleType] = useState<'normal' | 'photo' | 'video'>('normal');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailCaption, setThumbnailCaption] = useState('');
  const [useWatermark, setUseWatermark] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  // Section selection
  const [sections, setSections] = useState<Section[]>([]);
  const [primarySectionId, setPrimarySectionId] = useState('');
  const [secondarySectionIds, setSecondarySectionIds] = useState<string[]>([]);

  // Position
  const [selectedPositions, setSelectedPositions] = useState<PositionType[]>([]);

  // Status
  const [status, setStatus] = useState<'draft' | 'pending' | 'published' | 'scheduled'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '기사 내용을 입력하세요...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: '',
  });

  useEffect(() => {
    fetchSections();
    if (isEdit) {
      fetchArticle();
    }
  }, [id]);

  async function fetchSections() {
    const { data } = await supabase
      .from('joongang_sections')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (data) setSections(data);
  }

  async function fetchArticle() {
    if (!id) return;
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('id', id)
      .single();
    if (data) {
      setTitle(data.title);
      setSubtitle(data.subtitle || '');
      setArticleType(data.article_type);
      setThumbnailUrl(data.thumbnail_url || '');
      setThumbnailCaption(data.thumbnail_caption || '');
      setUseWatermark(data.use_watermark);
      setVideoUrl(data.video_url || '');
      setSourceName(data.source_name || '');
      setSourceUrl(data.source_url || '');
      setExcerpt(data.excerpt || '');
      setStatus(data.status);
      setScheduledAt(data.scheduled_at || '');
      editor?.commands.setContent(data.content || '');
    }

    // Fetch sections
    const { data: articleSections } = await supabase
      .from('joongang_article_sections')
      .select('section_id, is_primary')
      .eq('article_id', id);
    if (articleSections) {
      const primary = articleSections.find((s) => s.is_primary);
      if (primary) setPrimarySectionId(primary.section_id);
      setSecondarySectionIds(
        articleSections.filter((s) => !s.is_primary).map((s) => s.section_id)
      );
    }

    // Fetch positions
    const { data: positions } = await supabase
      .from('joongang_article_positions')
      .select('position_type')
      .eq('article_id', id);
    if (positions) {
      setSelectedPositions(positions.map((p) => p.position_type as PositionType));
    }

    // Fetch keywords
    const { data: kws } = await supabase
      .from('joongang_article_keywords')
      .select('keyword')
      .eq('article_id', id);
    if (kws) setKeywords(kws.map((k) => k.keyword));
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) + '-' + Date.now().toString(36);
  }

  function addKeyword() {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
    setKeywordInput('');
  }

  function removeKeyword(kw: string) {
    setKeywords(keywords.filter((k) => k !== kw));
  }

  function togglePosition(pos: PositionType) {
    setSelectedPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  }

  async function handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const ext = file.name.split('.').pop();
      const path = `articles/${Date.now()}.${ext}`;
      const { data } = await supabase.storage
        .from('joongang-images')
        .upload(path, file);
      if (data) {
        const { data: urlData } = supabase.storage
          .from('joongang-images')
          .getPublicUrl(data.path);
        editor?.chain().focus().setImage({ src: urlData.publicUrl }).run();
      }
    };
    input.click();
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const path = `thumbnails/${Date.now()}.${ext}`;
    const { data } = await supabase.storage
      .from('joongang-images')
      .upload(path, file);
    if (data) {
      const { data: urlData } = supabase.storage
        .from('joongang-images')
        .getPublicUrl(data.path);
      setThumbnailUrl(urlData.publicUrl);
    }
  }

  async function handleSave(publishNow = false) {
    if (!title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }
    if (!editor?.getHTML()) {
      alert('기사 내용을 입력하세요.');
      return;
    }

    setSaving(true);
    const content = editor.getHTML();
    const finalStatus = publishNow ? 'published' : status;

    const articleData = {
      title,
      subtitle: subtitle || null,
      slug: isEdit ? undefined : generateSlug(title),
      content,
      excerpt: excerpt || content.replace(/<[^>]+>/g, '').slice(0, 200),
      thumbnail_url: thumbnailUrl || null,
      thumbnail_caption: thumbnailCaption || null,
      use_watermark: useWatermark,
      article_type: articleType,
      video_url: articleType === 'video' ? videoUrl : null,
      source_name: sourceName || null,
      source_url: sourceUrl || null,
      author_id: staff?.id || null,
      author_name: staff?.name || null,
      author_email: staff?.email || null,
      status: finalStatus,
      is_published: finalStatus === 'published',
      published_at: finalStatus === 'published' ? new Date().toISOString() : null,
      scheduled_at: finalStatus === 'scheduled' ? scheduledAt : null,
      updated_at: new Date().toISOString(),
    };

    let articleId = id;

    if (isEdit) {
      await supabase
        .from('joongang_articles')
        .update(articleData)
        .eq('id', id);
    } else {
      const { data } = await supabase
        .from('joongang_articles')
        .insert({ ...articleData, slug: generateSlug(title) })
        .select('id')
        .single();
      if (data) articleId = data.id;
    }

    if (articleId) {
      // Save sections
      await supabase
        .from('joongang_article_sections')
        .delete()
        .eq('article_id', articleId);

      const sectionInserts = [];
      if (primarySectionId) {
        sectionInserts.push({
          article_id: articleId,
          section_id: primarySectionId,
          is_primary: true,
          sort_order: 0,
        });
      }
      secondarySectionIds.forEach((sid, idx) => {
        sectionInserts.push({
          article_id: articleId!,
          section_id: sid,
          is_primary: false,
          sort_order: idx + 1,
        });
      });
      if (sectionInserts.length > 0) {
        await supabase.from('joongang_article_sections').insert(sectionInserts);
      }

      // Save positions
      await supabase
        .from('joongang_article_positions')
        .delete()
        .eq('article_id', articleId);

      if (selectedPositions.length > 0) {
        const posInserts = selectedPositions.map((pos, idx) => ({
          article_id: articleId!,
          position_type: pos,
          priority: idx,
        }));
        await supabase.from('joongang_article_positions').insert(posInserts);
      }

      // Save keywords
      await supabase
        .from('joongang_article_keywords')
        .delete()
        .eq('article_id', articleId);

      if (keywords.length > 0) {
        const kwInserts = keywords.map((kw) => ({
          article_id: articleId!,
          keyword: kw,
        }));
        await supabase.from('joongang_article_keywords').insert(kwInserts);
      }
    }

    setSaving(false);
    navigate('/admin/articles');
  }

  const parentSections = sections.filter((s) => !s.parent_id);
  const childSections = primarySectionId
    ? sections.filter((s) => s.parent_id === primarySectionId)
    : [];

  return (
    <div className="article-editor">
      <div className="editor-header">
        <h2>{isEdit ? '기사 수정' : '기사 등록'}</h2>
        <div className="editor-actions">
          <button
            className="btn btn-outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            임시저장
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? '저장 중...' : '발행하기'}
          </button>
        </div>
      </div>

      <div className="editor-body">
        <div className="editor-main">
          {/* Article Type */}
          <div className="editor-section">
            <label className="form-label">뉴스형태</label>
            <div className="radio-group">
              <label className="radio-item">
                <input
                  type="radio"
                  name="articleType"
                  value="normal"
                  checked={articleType === 'normal'}
                  onChange={() => setArticleType('normal')}
                />
                일반뉴스
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="articleType"
                  value="photo"
                  checked={articleType === 'photo'}
                  onChange={() => setArticleType('photo')}
                />
                포토뉴스
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  name="articleType"
                  value="video"
                  checked={articleType === 'video'}
                  onChange={() => setArticleType('video')}
                />
                동영상뉴스
              </label>
            </div>
          </div>

          {/* Section Selection */}
          <div className="editor-section">
            <label className="form-label">섹션 분류</label>
            <div className="section-selects">
              <select
                className="form-select"
                value={primarySectionId}
                onChange={(e) => setPrimarySectionId(e.target.value)}
              >
                <option value="">1차 섹션 선택</option>
                {parentSections.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {childSections.length > 0 && (
                <select
                  className="form-select"
                  value={secondarySectionIds[0] || ''}
                  onChange={(e) => {
                    if (e.target.value) setSecondarySectionIds([e.target.value]);
                    else setSecondarySectionIds([]);
                  }}
                >
                  <option value="">2차 섹션 선택</option>
                  {childSections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Output Position */}
          <div className="editor-section">
            <label className="form-label">출력위치</label>
            <div className="position-grid">
              {POSITION_OPTIONS.map((pos) => (
                <label key={pos.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedPositions.includes(pos.value)}
                    onChange={() => togglePosition(pos.value)}
                  />
                  {pos.label}
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="editor-section">
            <input
              type="text"
              className="form-input title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            <input
              type="text"
              className="form-input subtitle-input"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="부제목 (선택사항)"
            />
          </div>

          {/* Thumbnail */}
          <div className="editor-section">
            <label className="form-label">대표이미지</label>
            <div className="thumbnail-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
              />
              <input
                type="text"
                className="form-input"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="또는 이미지 URL 직접 입력"
              />
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt="미리보기" className="thumb-preview" />
              )}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={useWatermark}
                  onChange={(e) => setUseWatermark(e.target.checked)}
                />
                워터마크 적용
              </label>
              <input
                type="text"
                className="form-input"
                value={thumbnailCaption}
                onChange={(e) => setThumbnailCaption(e.target.value)}
                placeholder="이미지 캡션"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Video URL (conditional) */}
          {articleType === 'video' && (
            <div className="editor-section">
              <label className="form-label">동영상 소스코드 (유튜브 embed 코드 붙여넣기)</label>
              <textarea
                className="form-textarea"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/..." ...></iframe>'
                rows={3}
              />
            </div>
          )}

          {/* WYSIWYG Editor */}
          <div className="editor-section">
            <label className="form-label">기사 내용</label>
            <div className="tiptap-toolbar">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive('bold') ? 'active' : ''}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive('italic') ? 'active' : ''}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={editor?.isActive('underline') ? 'active' : ''}
              >
                U
              </button>
              <span className="toolbar-divider" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor?.isActive('heading', { level: 2 }) ? 'active' : ''}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor?.isActive('heading', { level: 3 }) ? 'active' : ''}
              >
                H3
              </button>
              <span className="toolbar-divider" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              >
                좌
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              >
                중
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              >
                우
              </button>
              <span className="toolbar-divider" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={editor?.isActive('blockquote') ? 'active' : ''}
              >
                인용
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                목록
              </button>
              <button type="button" onClick={handleImageUpload}>
                이미지
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('링크 URL을 입력하세요:');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
              >
                링크
              </button>
            </div>
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>

          {/* Source */}
          <div className="editor-section">
            <label className="form-label">출처</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="form-input"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="출처명"
                style={{ flex: 1 }}
              />
              <input
                type="text"
                className="form-input"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="출처 링크 (http://...)"
                style={{ flex: 2 }}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="editor-section">
            <label className="form-label">요약문 (200자, 미입력 시 자동 생성)</label>
            <textarea
              className="form-textarea"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="기사 요약문..."
              rows={3}
              maxLength={200}
            />
          </div>

          {/* Keywords */}
          <div className="editor-section">
            <label className="form-label">키워드</label>
            <div className="keyword-area">
              <div className="keyword-tags">
                {keywords.map((kw) => (
                  <span key={kw} className="keyword-tag">
                    {kw}
                    <button type="button" onClick={() => removeKeyword(kw)}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); addKeyword(); }
                  }}
                  placeholder="키워드 입력 후 Enter"
                />
                <button type="button" className="btn btn-outline btn-sm" onClick={addKeyword}>
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
