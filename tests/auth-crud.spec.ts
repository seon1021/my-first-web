import { test, expect } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const TEST_EMAIL = process.env.TEST_EMAIL
const TEST_PASSWORD = process.env.TEST_PASSWORD

// Skip auth E2E tests when credentials are not provided to avoid hard failure in CI/local runs
if (!TEST_EMAIL || !TEST_PASSWORD) {
  // mark all tests in this file as skipped
  // Use runtime skip so test runner continues instead of throwing during module evaluation
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { test: _test } = require('@playwright/test')
  _test.skip(true, 'TEST_EMAIL and TEST_PASSWORD not set — skipping auth E2E tests')
}

test.describe('Auth + CRUD (E2E)', () => {
  test('행복 경로: 로그인 → 새 글 작성 → 목록에 표시', async ({ browser }) => {
    // 새로운 브라우저 컨텍스트 생성 (세션 격리)
    const context = await browser.newContext()
    const page = await context.newPage()

    // 1) /login에서 로그인
    await page.goto(`${BASE}/login`)
    await page.getByLabel(/이메일/i).fill(TEST_EMAIL)
    await page.getByLabel(/비밀번호/i).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /로그인/i }).click()

    // 로그인 후 /posts로 리다이렉트되는지 명시적으로 대기
    await Promise.race([
      page.waitForURL('**/posts', { timeout: 7000 }),
      page.waitForLoadState('networkidle')
    ])

    // 2) /posts/new에서 제목/내용 입력 후 저장
    const title = `E2E Test Post ${Date.now()}`
    const content = '이것은 E2E 테스트용 포스트 내용입니다. 충분히 길어야 합니다.'

    await page.goto(`${BASE}/posts/new`)
    await page.getByLabel(/제목/i).fill(title)
    await page.getByLabel(/내용/i).fill(content)
    await page.getByRole('button', { name: /포스트 작성|작성 중|작성/i }).click()

    // 제출 후 네비게이션 또는 결과 렌더링 대기
    await Promise.race([
      page.waitForURL(/posts\/[0-9]+/, { timeout: 7000 }),
      page.waitForLoadState('networkidle')
    ])

    // 3) /posts 목록에서 새 글 제목 확인 (목록에서 찾을 수 있도록 목록 페이지로 이동)
    await page.goto(`${BASE}/posts`)
    await expect(page.getByText(title)).toBeVisible({ timeout: 7000 })

    await context.close()
  })

  test('거절 경로: 인증되지 않은 상태로 /posts/new 접근 시 /login으로 리다이렉트', async ({ browser }) => {
    // 새 브라우저 컨텍스트로 쿠키/세션 없음
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(`${BASE}/posts/new`)

    // 인증되지 않은 경우 앱이 로그인 화면을 렌더링해야 합니다.
    // (일부 앱은 URL을 변경하지 않을 수 있으므로, 로그인 폼 존재 여부로 판단)
    await expect(page.getByLabel(/이메일/i)).toBeVisible({ timeout: 5000 })

    await context.close()
  })
})
