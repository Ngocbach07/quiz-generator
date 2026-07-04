import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const enResources = {
  translation: {
    appName: 'QuizHub',
    generateQuiz: 'Generate Quiz',
    uploadDocument: 'Upload Document',
    dragDrop: 'Drag & drop your file here, or click to browse',
    supportedFormats: 'Supported: PDF, DOCX, TXT, PPTX, URL',
    urlPlaceholder: 'Enter a webpage URL',
    fetchContent: 'Fetch Content',
    apiSettings: 'API Settings',
    apiKey: 'API Key',
    baseUrl: 'Base URL',
    model: 'Model',
    temperature: 'Temperature',
    maxTokens: 'Max Tokens',
    quizOptions: 'Quiz Options',
    numQuestions: 'Number of Questions',
    questionType: 'Question Type',
    singleChoice: 'Single Choice',
    multiChoice: 'Multi Choice',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    mixed: 'Mixed',
    generate: 'Generate Quiz',
    generating: 'Generating...',
    submitAnswer: 'Submit Answer',
    nextQuestion: 'Next Question',
    previousQuestion: 'Previous Question',
    finishQuiz: 'Finish Quiz',
    score: 'Score',
    correct: 'Correct',
    incorrect: 'Incorrect',
    explanation: 'Explanation',
    login: 'Login',
    logout: 'Logout',
    myQuizzes: 'My Quizzes',
    history: 'History',
    settings: 'Settings',
    language: 'Language',
    vietnamese: 'Vietnamese',
    english: 'English',
  }
};

const viResources = {
  translation: {
    appName: 'QuizHub',
    generateQuiz: 'Tạo Quiz',
    uploadDocument: 'Tải Tài Liệu',
    dragDrop: 'Kéo và thả file vào đây, hoặc nhấn để chọn',
    supportedFormats: 'Hỗ trợ: PDF, DOCX, TXT, PPTX, URL',
    urlPlaceholder: 'Nhập URL trang web',
    fetchContent: 'Lấy Nội Dung',
    apiSettings: 'Cài Đặt API',
    apiKey: 'API Key',
    baseUrl: 'Base URL',
    model: 'Model',
    temperature: 'Nhiệt Độ',
    maxTokens: 'Max Tokens',
    quizOptions: 'Tùy Chọn Quiz',
    numQuestions: 'Số Lượng Câu Hỏi',
    questionType: 'Loại Câu Hỏi',
    singleChoice: 'Chọn 1',
    multiChoice: 'Chọn Nhiều',
    difficulty: 'Độ Khó',
    easy: 'Dễ',
    medium: 'Trung Bình',
    hard: 'Khó',
    mixed: 'Trộn',
    generate: 'Tạo Quiz',
    generating: 'Đang tạo...',
    submitAnswer: 'Nộp Đáp Án',
    nextQuestion: 'Câu Tiếp',
    previousQuestion: 'Câu Trước',
    finishQuiz: 'Hoàn Thành Quiz',
    score: 'Điểm',
    correct: 'Đúng',
    incorrect: 'Sai',
    explanation: 'Giải Thích',
    login: 'Đăng Nhập',
    logout: 'Đăng Xuất',
    myQuizzes: 'Quiz Của Tôi',
    history: 'Lịch Sử',
    settings: 'Cài Đặt',
    language: 'Ngôn Ngữ',
    vietnamese: 'Tiếng Việt',
    english: 'Tiếng Anh',
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enResources,
      vi: viResources,
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
