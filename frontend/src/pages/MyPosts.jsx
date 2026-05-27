import React, { useState } from 'react';
import PostFeed from '../components/feed/PostFeed';

const MyPosts = () => {
  // Sample posts data
  const [samplePosts, setSamplePosts] = useState([
    {
      id: 1,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-10-01T10:00:00Z',
      content: {
                text: 'React Blog Post ✨',
                image: 'https://media.istockphoto.com/photos/blog-picture-id479759238?k=6&m=479759238&s=612x612&w=0&h=cIOO2FfZ9YKhVrXLAiBnu9r7Z9kWOa9uqPcBS5Pdebo=',
                hashtags: '#react #frontend #webdev #javascript',
            },
      likes: 28,
      comments: 6,
      shares: 4,
      commentsList: [
        {
          id: 1,
          author: { name: 'DevEnthusiast', avatar: '/src/assets/default-avatar.png' },
          content: 'Great breakdown! I\'ve been using Zustand lately - much simpler than Context for complex state.',
          timestamp: '2023-10-01T10:30:00Z',
          likes: 5,
        },
        {
          id: 2,
          author: { name: 'ReactFan', avatar: '/src/assets/default-avatar.png' },
          content: 'Custom hooks are a game changer! Have you tried React Query for server state?',
          timestamp: '2023-10-01T11:15:00Z',
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-09-28T14:00:00Z',
      content: '🤖 Machine Learning Deep Dive: Implementing Neural Networks from Scratch\n\nSpent the weekend building a multi-layer perceptron (MLP) from scratch using only NumPy. No TensorFlow or PyTorch - just pure Python and math! 🧮\n\nThe architecture:\n• Input layer (784 neurons for MNIST)\n• 2 hidden layers (128, 64 neurons)\n• Output layer (10 neurons for digits)\n• ReLU activation + Softmax\n• Adam optimizer with learning rate decay\n\nAchieved 94% accuracy on test set after 50 epochs. The math behind backpropagation is beautiful but challenging. Understanding gradient descent at this level really solidifies your ML fundamentals.\n\nNext: Adding convolutional layers for image classification!',
      likes: 45,
      comments: 12,
      shares: 8,
      commentsList: [
        {
          id: 3,
          author: { name: 'MLResearcher', avatar: '/src/assets/default-avatar.png' },
          content: 'This is gold! Building from scratch teaches you so much more than using libraries.',
          timestamp: '2023-09-28T15:00:00Z',
          likes: 8,
        },
        {
          id: 4,
          author: { name: 'DataScientist', avatar: '/src/assets/default-avatar.png' },
          content: 'Impressive! Have you tried implementing batch normalization?',
          timestamp: '2023-09-28T16:30:00Z',
          likes: 4,
        },
      ],
    },
    {
      id: 3,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-09-25T09:00:00Z',
      content: '🎨 Full-Stack Web Development: Creating a Real-Time Chat App\n\nBuilt a real-time chat application using the MERN stack with Socket.io for instant messaging. Features include:\n\nFrontend (React):\n• Real-time message updates with Socket.io client\n• Message history with infinite scroll\n• Online/offline status indicators\n• Emoji picker and file sharing\n• Responsive design with Tailwind CSS\n\nBackend (Node.js + Express):\n• JWT authentication\n• MongoDB for message storage\n• Socket.io for real-time communication\n• Input validation and rate limiting\n\nThe app handles 100+ concurrent users smoothly. Learned a lot about WebSocket connections, database indexing, and optimizing real-time features. Security considerations like XSS prevention and rate limiting were crucial.',
      likes: 32,
      comments: 8,
      shares: 6,
      commentsList: [
        {
          id: 5,
          author: { name: 'FullStackDev', avatar: '/src/assets/default-avatar.png' },
          content: 'Socket.io is amazing! Did you implement private messaging?',
          timestamp: '2023-09-25T10:00:00Z',
          likes: 2,
        },
      ],
    },
    {
      id: 4,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-09-20T16:00:00Z',
      content: '🧠 AI & Machine Learning: Natural Language Processing with BERT\n\nExperimenting with BERT (Bidirectional Encoder Representations from Transformers) for sentiment analysis on customer reviews. Fine-tuned a pre-trained BERT model on a dataset of 50k+ reviews.\n\nKey insights:\n• BERT\'s attention mechanism captures context beautifully\n• Fine-tuning on domain-specific data improves accuracy by 15-20%\n• Model compression techniques (distillation) reduce size by 40%\n• Deployed as a REST API using FastAPI\n\nThe model now classifies sentiment with 92% accuracy. Applications in automated customer service, content moderation, and market research are endless. The transformer architecture is truly revolutionary!\n\nWhat NLP tasks are you working on?',
      likes: 38,
      comments: 9,
      shares: 7,
      commentsList: [],
    },
    {
      id: 5,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-09-15T12:00:00Z',
      content: '⚡ Modern Web Development: Building a Progressive Web App (PWA)\n\nCreated a PWA for a local restaurant with offline functionality, push notifications, and native app-like experience. Tech stack:\n\n• Next.js for SSR and static generation\n• Service Workers for caching and offline support\n• IndexedDB for local data storage\n• Web Push API for notifications\n• Lighthouse for performance auditing\n\nFeatures:\n• Offline menu browsing and ordering\n• Push notifications for order updates\n• Installable on mobile devices\n• Fast loading with code splitting\n\nPWA score: 95/100 on Lighthouse. The app works offline and loads in under 2 seconds. PWAs bridge the gap between web and native apps perfectly!\n\nHave you built any PWAs? What challenges did you face?',
      likes: 29,
      comments: 7,
      shares: 5,
      commentsList: [],
    },
    {
      id: 6,
      author: {
        name: 'Ashutosh Kumar Shaw',
        avatar: '/src/assets/profile.jpg',
      },
      timestamp: '2023-09-10T08:00:00Z',
      content: '🔬 Machine Learning in Production: MLOps Best Practices\n\nDeployed my first ML model to production using a complete MLOps pipeline. The journey involved:\n\n1. Model Development: Scikit-learn pipeline with feature engineering\n2. Model Versioning: DVC for data and model versioning\n3. Containerization: Docker for reproducible environments\n4. CI/CD: GitHub Actions for automated testing and deployment\n5. Monitoring: MLflow for experiment tracking, Prometheus for metrics\n6. API Serving: FastAPI with input validation and error handling\n\nKey lessons:\n• Data drift monitoring is crucial\n• Model performance degrades over time\n• A/B testing for model updates\n• Documentation and reproducibility matter\n\nThe model predicts customer churn with 85% accuracy and serves 1000+ predictions daily. MLOps is the bridge between ML research and production reality!',
      likes: 41,
      comments: 11,
      shares: 9,
      commentsList: [],
    },
  ]);


  const currentUser = {
    name: 'Ashutosh Kumar Shaw',
    avatar: '/src/assets/profile.jpg',
  };

  const handleDeletePost = (postId) => {
    setSamplePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="myposts-page p-4">
      <h1 className="text-2xl font-bold mb-4">My Posts</h1>
      <PostFeed
        posts={samplePosts}
        currentUser={currentUser}
        onLike={(postId) => console.log('Liked post', postId)}
        onComment={(postId, text) => console.log('Commented on post', postId, text)}
        onShare={(postId) => console.log('Shared post', postId)}
        onDelete={handleDeletePost}
      />
    </div>
  );
};

export default MyPosts;