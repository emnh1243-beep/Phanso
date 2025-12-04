import React from 'react';
import { Topic } from '../types';
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  return (
    <button
      onClick={() => onClick(topic)}
      className="group relative flex flex-col items-start p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 w-full text-left"
    >
      <div className={`p-3 rounded-xl mb-4 ${topic.color} bg-opacity-10 text-opacity-100`}>
        <span className="text-3xl">{topic.icon}</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
        {topic.name}
      </h3>
      
      <p className="text-gray-500 text-sm mb-6 line-clamp-2">
        {topic.description}
      </p>

      <div className="mt-auto flex items-center text-primary font-semibold text-sm opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Bắt đầu học <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </button>
  );
};

export default TopicCard;