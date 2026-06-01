# Supabase 마이그레이션 적용 안내

프로젝트의 `supabase/migrations/` 폴더에 SQL 마이그레이션 파일이 포함되어 있습니다. 좋아요 기능을 비롯한 테이블이 DB에 존재하지 않아 에러가 발생하면, 아래 방법으로 마이그레이션을 적용하세요.

방법 A — Supabase Studio (간단)
1. https://app.supabase.com 에 접속하여 프로젝트 선택
2. 좌측 메뉴의 `SQL Editor`를 열고, `migrations/` 폴더의 SQL 파일 내용을 복사하여 실행

방법 B — Supabase CLI (권장: 마이그레이션 관리)
1. Supabase CLI 설치:

```bash
npm install -g supabase
```

2. Supabase에 로그인:

```bash
supabase login
```

3. 로컬 프로젝트를 remote와 연결(처음 설정 시):

```bash
supabase link --project-ref <your-project-ref>
```

4. 마이그레이션 적용(프로젝트 루트에서):

```bash
supabase db push
```

참고
- 마이그레이션 적용 전에 데이터베이스 백업을 권장합니다.
- RLS 정책이 활성화된 경우, 클라이언트에서 `insert`/`delete`를 수행하려면 인증된 사용자의 컨텍스트(auth.uid())가 필요합니다.

문제가 지속되면 `supabase/migrations/` 아래 파일들을 복사해 주시거나, Supabase Studio에서 실행한 결과(오류 메시지)를 알려주세요.
