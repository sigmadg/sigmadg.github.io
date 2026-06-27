/* Catálogo de algoritmos de Machine Learning */
window.ML_CATALOG = [
  {
    id: 'supervised',
    title: '1. Aprendizaje Supervisado',
    desc: 'Usas datos etiquetados para entrenar modelos.',
    subgroups: [
      {
        title: 'Regresión',
        desc: 'Predicen valores continuos.',
        algorithms: [
          'Regresión Lineal', 'Regresión Polinomial', 'Ridge Regression', 'Lasso Regression',
          'Elastic Net', 'Bayesian Regression', 'Quantile Regression', 'Support Vector Regression (SVR)',
          'Decision Tree Regression', 'Random Forest Regression', 'Gradient Boosting Regression',
          'XGBoost Regression', 'LightGBM Regression', 'CatBoost Regression', 'KNN Regression',
          'Gaussian Process Regression', 'Neural Network Regression',
        ],
      },
      {
        title: 'Clasificación',
        desc: 'Predicen categorías.',
        algorithms: [
          'Logistic Regression', 'Naive Bayes', 'Gaussian NB', 'Multinomial NB', 'Bernoulli NB',
          'K-Nearest Neighbors (KNN)', 'Support Vector Machine (SVM)', 'Decision Trees',
          'Random Forest', 'Extra Trees', 'AdaBoost', 'Gradient Boosting', 'XGBoost', 'LightGBM',
          'CatBoost', 'Linear Discriminant Analysis (LDA)', 'Quadratic Discriminant Analysis (QDA)',
          'Perceptron', 'Passive Aggressive Classifier', 'Stochastic Gradient Descent (SGD)',
          'Neural Networks / MLP', 'Deep Neural Networks', 'Capsule Networks', 'Bayesian Networks',
        ],
      },
    ],
  },
  {
    id: 'unsupervised',
    title: '2. Aprendizaje No Supervisado',
    desc: 'No hay etiquetas; el modelo descubre estructura en los datos.',
    subgroups: [
      {
        title: 'Clustering',
        desc: 'Agrupan datos similares.',
        algorithms: [
          'K-Means', 'MiniBatch K-Means', 'K-Medoids', 'Hierarchical Clustering',
          'Agglomerative Clustering', 'DBSCAN', 'HDBSCAN', 'OPTICS', 'Mean Shift',
          'Spectral Clustering', 'Gaussian Mixture Models (GMM)', 'Affinity Propagation',
          'Birch', 'Fuzzy C-Means', 'Self Organizing Maps (SOM)',
        ],
      },
      {
        title: 'Reducción de dimensionalidad',
        desc: 'Reducen variables manteniendo información.',
        algorithms: [
          'PCA', 'Kernel PCA', 'Sparse PCA', 'Incremental PCA', 't-SNE', 'UMAP', 'ICA',
          'Factor Analysis', 'LDA (dimensionalidad)', 'Autoencoders', 'Isomap',
          'Locally Linear Embedding (LLE)', 'MDS', 'Random Projection',
        ],
      },
      {
        title: 'Detección de anomalías',
        desc: 'Identifican puntos atípicos o outliers.',
        algorithms: [
          'Isolation Forest', 'One-Class SVM', 'Local Outlier Factor (LOF)', 'Elliptic Envelope',
          'Autoencoder Anomaly Detection', 'HBOS', 'COPOD',
        ],
      },
    ],
  },
  {
    id: 'deep-learning',
    title: '3. Deep Learning',
    desc: 'Subcampo de ML con redes neuronales profundas.',
    subgroups: [
      {
        title: 'Redes neuronales clásicas',
        algorithms: ['Perceptron', 'Multilayer Perceptron (MLP)', 'Feedforward Neural Networks'],
      },
      {
        title: 'Redes para imágenes',
        algorithms: [
          'CNN', 'LeNet', 'AlexNet', 'VGG', 'ResNet', 'DenseNet', 'EfficientNet', 'MobileNet',
          'Vision Transformers (ViT)', 'YOLO', 'Faster R-CNN', 'Mask R-CNN', 'U-Net',
          'Segment Anything Model (SAM)',
        ],
      },
      {
        title: 'Redes secuenciales',
        algorithms: ['RNN', 'LSTM', 'GRU', 'Bidirectional RNN', 'Seq2Seq'],
      },
      {
        title: 'Transformers',
        algorithms: [
          'Transformer', 'BERT', 'RoBERTa', 'GPT', 'T5', 'Llama', 'Mistral',
          'Claude-like architectures', 'Vision Transformer', 'Diffusion Transformers',
        ],
      },
      {
        title: 'Generativos',
        algorithms: [
          'GAN', 'DCGAN', 'CycleGAN', 'StyleGAN', 'Variational Autoencoder (VAE)',
          'Diffusion Models', 'Stable Diffusion', 'DALL·E-type models', 'Normalizing Flows',
        ],
      },
    ],
  },
  {
    id: 'reinforcement',
    title: '4. Reinforcement Learning',
    desc: 'Aprendizaje por recompensa en entornos interactivos.',
    subgroups: [
      {
        title: 'Métodos clásicos',
        algorithms: ['Q-Learning', 'SARSA', 'Monte Carlo RL', 'Temporal Difference Learning'],
      },
      {
        title: 'Deep Reinforcement Learning',
        algorithms: [
          'Deep Q Network (DQN)', 'Double DQN', 'Dueling DQN', 'PPO', 'TRPO', 'A3C', 'A2C',
          'DDPG', 'TD3', 'SAC', 'AlphaGo methods', 'MuZero',
        ],
      },
    ],
  },
  {
    id: 'probabilistic',
    title: '5. Probabilísticos y Bayesianos',
    subgroups: [
      {
        title: 'Modelos',
        algorithms: [
          'Hidden Markov Models (HMM)', 'Bayesian Networks', 'Markov Random Fields',
          'Conditional Random Fields (CRF)', 'Gaussian Processes', 'Bayesian Optimization',
          'Dirichlet Processes', 'Latent Dirichlet Allocation (LDA topic modeling)',
        ],
      },
    ],
  },
  {
    id: 'time-series',
    title: '6. Series temporales',
    subgroups: [
      {
        title: 'Modelos',
        algorithms: [
          'ARIMA', 'SARIMA', 'Prophet', 'Exponential Smoothing', 'Holt-Winters',
          'State Space Models', 'Kalman Filter', 'DeepAR', 'Temporal Fusion Transformer',
        ],
      },
    ],
  },
  {
    id: 'recommendation',
    title: '7. Recomendación',
    subgroups: [
      {
        title: 'Sistemas',
        algorithms: [
          'Collaborative Filtering', 'Matrix Factorization', 'ALS', 'Content-Based Filtering',
          'Hybrid Recommenders', 'Neural Recommenders', 'Factorization Machines',
        ],
      },
    ],
  },
  {
    id: 'nlp',
    title: '8. NLP (Procesamiento de lenguaje)',
    subgroups: [
      {
        title: 'Modelos y técnicas',
        algorithms: [
          'Word2Vec', 'GloVe', 'FastText', 'BERT', 'GPT', 'CRF', 'Seq2Seq', 'Attention Models',
          'Transformers', 'RAG', 'Sentence Transformers',
        ],
      },
    ],
  },
  {
    id: 'automl',
    title: '9. Meta Learning / AutoML',
    subgroups: [
      {
        title: 'AutoML',
        algorithms: [
          'Neural Architecture Search (NAS)', 'AutoSklearn', 'AutoGluon', 'Hyperband',
          'Bayesian Hyperparameter Optimization', 'MAML',
        ],
      },
    ],
  },
  {
    id: 'ensemble',
    title: '10. Ensemble Learning',
    desc: 'Combinan múltiples modelos para mejorar predicciones.',
    subgroups: [
      {
        title: 'Técnicas',
        algorithms: [
          'Bagging', 'Boosting', 'Stacking', 'Blending', 'Voting Classifier', 'Random Forest',
          'AdaBoost', 'Gradient Boosting', 'XGBoost', 'LightGBM', 'CatBoost',
        ],
      },
    ],
  },
  {
    id: 'evolutionary',
    title: '11. Evolutivos y bioinspirados',
    subgroups: [
      {
        title: 'Algoritmos',
        algorithms: [
          'Genetic Algorithms', 'Genetic Programming', 'Neuroevolution',
          'Particle Swarm Optimization', 'Ant Colony Optimization', 'Differential Evolution',
          'Simulated Annealing',
        ],
      },
    ],
  },
  {
    id: 'graph-ml',
    title: '12. Graph Machine Learning',
    subgroups: [
      {
        title: 'Grafos',
        algorithms: [
          'Graph Neural Networks (GNN)', 'GraphSAGE', 'GAT', 'GCN', 'Node2Vec', 'DeepWalk',
        ],
      },
    ],
  },
  {
    id: 'semi-supervised',
    title: '13. Aprendizaje semi-supervisado',
    subgroups: [
      {
        title: 'Métodos',
        algorithms: [
          'Self Training', 'Co-Training', 'Label Propagation', 'Pseudo Labeling', 'Mean Teacher',
        ],
      },
    ],
  },
  {
    id: 'self-supervised',
    title: '14. Self-Supervised Learning',
    subgroups: [
      {
        title: 'Métodos',
        algorithms: ['SimCLR', 'MoCo', 'BYOL', 'DINO', 'MAE', 'Contrastive Learning'],
      },
    ],
  },
  {
    id: 'federated',
    title: '15. Federated Learning',
    subgroups: [
      {
        title: 'Métodos',
        algorithms: ['FedAvg', 'FedProx', 'Split Learning'],
      },
    ],
  },
  {
    id: 'online',
    title: '16. Online Learning',
    subgroups: [
      {
        title: 'Métodos',
        algorithms: ['Online SGD', 'Passive Aggressive', 'Hoeffding Trees', 'Online Boosting'],
      },
    ],
  },
  {
    id: 'causal',
    title: '17. Causal Machine Learning',
    subgroups: [
      {
        title: 'Métodos',
        algorithms: [
          'Causal Forests', 'Double ML', 'Propensity Score Models', 'DoWhy approaches',
          'Structural Causal Models',
        ],
      },
    ],
  },
  {
    id: 'hybrid-modern',
    title: '18. Algoritmos híbridos modernos',
    subgroups: [
      {
        title: 'Sistemas',
        algorithms: [
          'RAG (Retrieval Augmented Generation)', 'Agentic AI systems', 'Neuro-symbolic AI',
          'Mixture of Experts (MoE)', 'Retrieval Transformers', 'Tool-using LLMs',
        ],
      },
    ],
  },
];
