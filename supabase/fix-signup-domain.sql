-- joongang 사이트에서 가입한 회원들의 signup_domain 업데이트
UPDATE user_profiles
SET signup_domain = 'joongang.dreamitbiz.com'
WHERE email IN ('kimyoonmi09@gmail.com', 'kimokchae04@gmail.com');
