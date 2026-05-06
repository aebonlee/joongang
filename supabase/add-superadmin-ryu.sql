INSERT INTO joongang_staff (user_id, name, email, role, department, position, byline, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'ryuwebpd@gmail.com'),
  '류태호',
  'ryuwebpd@gmail.com',
  'superadmin',
  '경영',
  '지사장',
  '중앙일보 워싱턴 지사장',
  true
);
