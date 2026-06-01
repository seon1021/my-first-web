-- posts 테이블에 image_url 컬럼 추가
alter table posts
  add column if not exists image_url text;
