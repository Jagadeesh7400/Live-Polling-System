import React, { useState } from 'react';
import './PollTemplates.css';

const PollTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('science');

  const pollTemplates = {
    science: [
      {
        id: 1,
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        category: "Astronomy"
      },
      {
        id: 2,
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        category: "Chemistry"
      },
      {
        id: 3,
        question: "Which gas makes up most of Earth's atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        category: "Earth Science"
      },
      {
        id: 4,
        question: "How many bones are in an adult human body?",
        options: ["206", "208", "210", "215"],
        category: "Biology"
      },
      {
        id: 5,
        question: "What is the speed of light in vacuum?",
        options: ["299,792,458 m/s", "300,000,000 m/s", "186,000 miles/s", "All of the above"],
        category: "Physics"
      }
    ],
    programming: [
      {
        id: 6,
        question: "Which programming language is most popular in 2024?",
        options: ["JavaScript", "Python", "Java", "C++"],
        category: "General"
      },
      {
        id: 7,
        question: "What does HTML stand for?",
        options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language", "Hypertext Machine Language"],
        category: "Web Development"
      },
      {
        id: 8,
        question: "Which company developed React.js?",
        options: ["Facebook (Meta)", "Google", "Microsoft", "Twitter"],
        category: "Frontend"
      },
      {
        id: 9,
        question: "What is the primary purpose of Git?",
        options: ["Version Control", "Code Compilation", "Database Management", "Web Hosting"],
        category: "Tools"
      },
      {
        id: 10,
        question: "Which database is known for NoSQL?",
        options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
        category: "Database"
      }
    ],
    general: [
      {
        id: 11,
        question: "Which country has the most time zones?",
        options: ["Russia", "USA", "China", "Australia"],
        category: "Geography"
      },
      {
        id: 12,
        question: "What is the largest ocean on Earth?",
        options: ["Pacific", "Atlantic", "Indian", "Arctic"],
        category: "Geography"
      },
      {
        id: 13,
        question: "Who painted the Mona Lisa?",
        options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo"],
        category: "Art"
      },
      {
        id: 14,
        question: "In which year did World War II end?",
        options: ["1945", "1944", "1946", "1943"],
        category: "History"
      },
      {
        id: 15,
        question: "What is the capital of Australia?",
        options: ["Canberra", "Sydney", "Melbourne", "Brisbane"],
        category: "Geography"
      }
    ],
    business: [
      {
        id: 16,
        question: "What does ROI stand for in business?",
        options: ["Return on Investment", "Rate of Interest", "Risk of Investment", "Revenue over Income"],
        category: "Finance"
      },
      {
        id: 17,
        question: "Which company is the largest by market cap in 2024?",
        options: ["Apple", "Microsoft", "Amazon", "Google"],
        category: "Market"
      },
      {
        id: 18,
        question: "What is the most important factor in customer satisfaction?",
        options: ["Product Quality", "Price", "Customer Service", "Brand Recognition"],
        category: "Marketing"
      },
      {
        id: 19,
        question: "What does MVP stand for in product development?",
        options: ["Minimum Viable Product", "Maximum Value Proposition", "Most Valuable Player", "Market Value Product"],
        category: "Product"
      },
      {
        id: 20,
        question: "Which metric is most important for SaaS businesses?",
        options: ["Monthly Recurring Revenue", "Total Revenue", "One-time Sales", "Cost per Acquisition"],
        category: "SaaS"
      }
    ]
  };

  const categories = [
    { key: 'science', label: '🔬 Science', icon: '🧪' },
    { key: 'programming', label: '💻 Programming', icon: '👨‍💻' },
    { key: 'general', label: '🌍 General Knowledge', icon: '📚' },
    { key: 'business', label: '💼 Business', icon: '📈' }
  ];

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="poll-templates-overlay">
      <div className="poll-templates-modal">
        <div className="poll-templates-header">
          <h2>📋 Choose a Poll Template</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="poll-templates-categories">
          {categories.map(category => (
            <button
              key={category.key}
              className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="poll-templates-list">
          <h3>
            {categories.find(cat => cat.key === selectedCategory)?.icon} 
            {categories.find(cat => cat.key === selectedCategory)?.label} Templates
          </h3>
          
          <div className="templates-grid">
            {pollTemplates[selectedCategory]?.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-category">{template.category}</div>
                <h4 className="template-question">{template.question}</h4>
                <div className="template-options">
                  {template.options.map((option, index) => (
                    <div key={index} className="template-option">
                      <span className="option-number">{index + 1}</span>
                      <span className="option-text">{option}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className="use-template-btn"
                  onClick={() => handleTemplateSelect(template)}
                >
                  ✨ Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="poll-templates-footer">
          <button className="create-custom-btn" onClick={onClose}>
            🎨 Create Custom Poll Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollTemplates;
