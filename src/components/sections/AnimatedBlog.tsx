import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, Tag, ChevronDown, RefreshCw } from 'lucide-react';

// Types
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedDate: string;
  readingTime: number;
  tags: string[];
  category: string;
  author: string;
}

interface FilterState {
  category: string;
  tags: string[];
  sortBy: 'date' | 'readingTime' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Mock data
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "My First DevOps Post",
    excerpt: "A brief overview of my journey into DevOps and some initial thoughts on automation.",
    content: "Full content here...",
    image: "https://via.placeholder.com/400x250",
    publishedDate: "2023-10-26",
    readingTime: 5,
    tags: ["DevOps", "Automation", "Journey"],
    category: "DevOps",
    author: "John Doe"
  },
  {
    id: 2,
    title: "Kubernetes Best Practices",
    excerpt: "Exploring essential practices for deploying and managing applications on Kubernetes.",
    content: "Full content here...",
    image: "https://via.placeholder.com/400x250",
    publishedDate: "2023-11-15",
    readingTime: 8,
    tags: ["Kubernetes", "Best Practices", "Deployment"],
    category: "Kubernetes",
    author: "Jane Smith"
  },
  {
    id: 3,
    title: "CI/CD with GitHub Actions",
    excerpt: "A step-by-step guide to setting up continuous integration and deployment using GitHub Actions.",
    content: "Full content here...",
    image: "https://via.placeholder.com/400x250",
    publishedDate: "2023-12-01",
    readingTime: 12,
    tags: ["CI/CD", "GitHub Actions", "Automation"],
    category: "CI/CD",
    author: "Bob Johnson"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const skeletonVariants = {
  initial: { opacity: 0.6 },
  animate: { 
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const filterVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

// Skeleton Card Component
const SkeletonCard: React.FC = () => (
  <motion.div
    variants={skeletonVariants}
    initial="initial"
    animate="animate"
    className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
  >
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  </motion.div>
);

// Blog Card Component with 3D Tilt Effect
const BlogCard: React.FC<{ post: BlogPost; searchTerm: string }> = ({ post, searchTerm }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useTransform(mouseY, (y) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return -(y - rect.top - rect.height / 2) / 25;
  });

  const rotateY = useTransform(mouseX, (x) => {
    if (!cardRef.current) return 0;
    const rect = cardRef.current.getBoundingClientRect();
    return (x - rect.left - rect.width / 2) / 25;
  });

  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isHovered) return;
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden cursor-pointer group"
    >
      {/* Image with zoom effect */}
      <div className="relative overflow-hidden h-48">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        {/* Reading time indicator */}
        <motion.div
          className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Clock size={12} />
          <span>{post.readingTime} min</span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3
          className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {highlightText(post.title, searchTerm)}
        </motion.h3>

        <motion.p
          className="text-gray-700 dark:text-gray-300 text-sm mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Published on {new Date(post.publishedDate).toLocaleDateString()}
        </motion.p>

        <motion.p
          className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {highlightText(post.excerpt, searchTerm)}
        </motion.p>

        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {post.tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <Tag size={10} />
              <span>{tag}</span>
            </motion.span>
          ))}
        </motion.div>

        {/* Read more link */}
        <motion.a
          href="#"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 group"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ x: 5 }}
        >
          <span>Read More</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.a>
      </div>
    </motion.div>
  );
};

// Filter Component
const FilterPanel: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  allTags: string[];
}> = ({ filters, onFilterChange, categories, allTags }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter size={16} />
        <span>Filters</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={filterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-10 min-w-64"
          >
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <div className="flex space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700"
                >
                  <option value="date">Date</option>
                  <option value="readingTime">Reading Time</option>
                  <option value="title">Title</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => onFilterChange({ ...filters, sortOrder: e.target.value as any })}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const AnimatedBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    tags: [],
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loaderRef = useRef<HTMLDivElement>(null);
  const postsPerPage = 6;

  // Get unique categories and tags
  const categories = Array.from(new Set(mockBlogPosts.map(post => post.category)));
  const allTags = Array.from(new Set(mockBlogPosts.flatMap(post => post.tags)));

  // Load initial posts
  useEffect(() => {
    loadPosts(1, true);
  }, []);

  // Filter and sort posts
  useEffect(() => {
    let filtered = posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !filters.category || post.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });

    // Sort posts
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime();
          break;
        case 'readingTime':
          comparison = a.readingTime - b.readingTime;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filters]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadPosts(page + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, page]);

  const loadPosts = useCallback((pageNum: number, reset = false) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const startIndex = (pageNum - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const newPosts = mockBlogPosts.slice(startIndex, endIndex);
      
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setPage(pageNum);
      setHasMore(endIndex < mockBlogPosts.length);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadPosts(1, true);
      setIsRefreshing(false);
    }, 1000);
  };

  // Pull to refresh for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const diff = currentY - startY;
      
      if (diff > 100 && window.scrollY === 0) {
        handleRefresh();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    
    setTimeout(() => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, 1000);
  }, []);

  return (
    <section 
      id="blog" 
      className="py-16 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      onTouchStart={handleTouchStart}
    >
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Blog</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on DevOps, cloud technologies, and software development.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
            allTags={allTags}
          />

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            >
              <RefreshCw size={16} />
            </motion.div>
            <span>Refresh</span>
          </motion.button>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                searchTerm={searchTerm}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Loading Skeletons */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loaderRef} className="h-10" />

        {/* No Results */}
        {filteredPosts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No blog posts found matching your criteria.
            </p>
          </motion.div>
        )}

        {/* End of Results */}
        {!hasMore && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <p className="text-gray-500 dark:text-gray-400">
              You've reached the end of our blog posts!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AnimatedBlog;