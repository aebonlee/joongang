-- ==============================================
-- 지면보기 샘플 데이터 INSERT (5/1 ~ 5/9)
-- Supabase Dashboard > SQL Editor에서 실행
-- ==============================================

-- Step 1: Storage에 임시 anon 업로드 정책 추가 (스크립트 실행 후 제거)
CREATE POLICY "temp_anon_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'joongang-editions');

-- Step 2: DB 레코드 삽입

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AW/AW-2026-05-01-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-01', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-01/AE/AE-2026-05-01-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AW/AW-2026-05-02-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-02', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-02/AE/AE-2026-05-02-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-03', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-03/AW/AW-2026-05-03-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AW/AW-2026-05-04-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-04', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-04/AE/AE-2026-05-04-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AW/AW-2026-05-05-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-05', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-05/AE/AE-2026-05-05-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AW/AW-2026-05-06-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AE/AE-2026-05-06-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AE/AE-2026-05-06-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AE/AE-2026-05-06-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-06', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-06/AE/AE-2026-05-06-04.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AW/AW-2026-05-07-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-07', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-07/AE/AE-2026-05-07-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 7, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-07.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AW', '워싱턴판', 8, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AW/AW-2026-05-08-08.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-08', 'AE', '동부판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-08/AE/AE-2026-05-08-06.pdf', 15000);

INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-04.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 5, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-05.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AW', '워싱턴판', 6, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AW/AW-2026-05-09-06.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AE', '동부판', 1, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AE/AE-2026-05-09-01.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AE', '동부판', 2, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AE/AE-2026-05-09-02.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AE', '동부판', 3, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AE/AE-2026-05-09-03.pdf', 15000);
INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)
VALUES ('2026-05-09', 'AE', '동부판', 4, 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions/editions/2026-05-09/AE/AE-2026-05-09-04.pdf', 15000);

-- Total: 110 records

-- ⚠️ Step 3: 스크립트로 PDF 업로드 완료 후 아래 실행하여 임시 정책 제거
-- DROP POLICY "temp_anon_upload" ON storage.objects;
