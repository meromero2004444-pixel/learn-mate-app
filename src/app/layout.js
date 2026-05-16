import './globals.css';

export const metadata = {
  title: 'LearnMate - كلية التربية النوعية',
  description: 'منصة تعليمية ذكية لطلاب كلية التربية النوعية بجامعة بورسعيد',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
