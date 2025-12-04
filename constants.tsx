import { Topic, TopicId } from './types';

export const TOPICS: Topic[] = [
  {
    id: TopicId.ARITHMETIC,
    name: 'Số học',
    icon: '🧮',
    description: 'Cộng, trừ, nhân, chia, phân số và số thập phân.',
    color: 'bg-blue-500',
  },
  {
    id: TopicId.ALGEBRA,
    name: 'Đại số',
    icon: '📐',
    description: 'Phương trình, bất phương trình, đồ thị và hàm số.',
    color: 'bg-purple-500',
  },
  {
    id: TopicId.GEOMETRY,
    name: 'Hình học',
    icon: '🔺',
    description: 'Góc, tam giác, đường tròn, diện tích và thể tích.',
    color: 'bg-pink-500',
  },
  {
    id: TopicId.CALCULUS,
    name: 'Giải tích',
    icon: '∫',
    description: 'Giới hạn, đạo hàm, nguyên hàm và tích phân.',
    color: 'bg-indigo-500',
  },
  {
    id: TopicId.STATISTICS,
    name: 'Thống kê',
    icon: '📊',
    description: 'Xác suất, trung bình, trung vị và biểu đồ.',
    color: 'bg-emerald-500',
  },
  {
    id: TopicId.LOGIC,
    name: 'Logic Toán',
    icon: '🧠',
    description: 'Tư duy logic, mệnh đề và câu đố toán học.',
    color: 'bg-orange-500',
  }
];