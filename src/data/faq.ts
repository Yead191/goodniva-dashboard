import type { FaqItem } from '@/types'

export const faqSeed: FaqItem[] = [
  { id: 1, question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page, enter your email, and follow the OTP verification to set a new password.' },
  { id: 2, question: 'How can I verify my account?', answer: 'Go to your profile page and submit a government-issued ID. Verification usually takes 24-48 hours.' },
  { id: 3, question: 'What is the difference between plans?', answer: 'Premium unlocks advanced analytics and custom branding. Professional adds unlimited users and 24/7 support.' },
  { id: 4, question: 'How do I report a user?', answer: 'Click the three-dot menu on any user profile or chat and select "Report". Our moderation team reviews all reports within 24 hours.' },
]

export const defaultRichContent = {
  about: '<h2>About GoodNiva</h2><p>GoodNiva is a community-first platform that connects verified users through shared interests and safe, curated meetups. Founded in 2023, our mission is to make real-world connection simple and secure.</p><p><b>Our values:</b></p><ul><li>Trust through verification</li><li>Safety as a default</li><li>Respect for every member</li></ul>',
  privacy: '<h2>Privacy Policy</h2><p><i>Last updated: October 2025</i></p><p>We respect your privacy and are committed to protecting your personal data. This policy explains what we collect, how we use it, and your rights.</p><p><b>Information we collect:</b></p><ul><li>Account details (name, email, phone)</li><li>Verification documents</li><li>Usage data and device information</li></ul>',
  terms: '<h2>Terms &amp; Conditions</h2><p><i>Effective: October 2025</i></p><p>By using GoodNiva, you agree to the following terms. Please read them carefully.</p><ol><li>You must be at least 18 years old to use our services.</li><li>You are responsible for maintaining account security.</li><li>Harassment and abuse are prohibited and result in permanent bans.</li></ol>',
}
