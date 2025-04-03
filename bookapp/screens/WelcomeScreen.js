import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const catSlides = [
  { id: '1', image: require('../assets/images/cat1.png') },
  { id: '2', image: require('../assets/images/cat4.png') },
  { id: '3', image: require('../assets/images/cat3.png') }, // cat3 will just use different dimensions
];

const textSlides = [
  {
    title: 'Browse Thousands of Books, Anytime!',
    subtitle: 'Dive into a vast collection of books across fiction, non-fiction, fantasy, mystery, and more.',
  },
  {
    title: 'Discover New Authors',
    subtitle: 'Explore books by your favorite authors or discover fresh voices in literature.',
  },
  {
    title: 'Read Anywhere',
    subtitle: 'Access your collection from your phone, tablet, or computer at any time.',
  },
];

export default function WelcomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const catCarouselRef = useRef(null);
  const textCarouselRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-scroll function
  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % catSlides.length;
        
        // Scroll both carousels
        catCarouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        textCarouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        
        return nextIndex;
      });
    }, 3000);
  };

  // Initialize auto-scroll on mount
  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Handle manual scroll
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        clearInterval(intervalRef.current);
        startAutoScroll();
      }
    }
  };

  // Render indicator dots
  const renderIndicators = () => {
    return (
      <View style={styles.indicatorContainer}>
        {catSlides.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.indicatorDot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot
            ]} 
          />
        ))}
      </View>
    );
  };

  // Get image style based on ID
  const getImageStyle = (id) => {
    return id === '3' ? styles.cat3Image : styles.catImage;
  };

  return (
    <View style={styles.container}>
      {/* Dripping Effect */}
      <Image source={require('../assets/images/dripping.png')} style={styles.dripImage} />
      
      {/* Drop Images */}
      <Image source={require('../assets/images/drop1.png')} style={styles.drop1} />
      <Image source={require('../assets/images/drop2.png')} style={styles.drop2} />

      {/* Cat Image Carousel */}
      <FlatList
        ref={catCarouselRef}
        data={catSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.catImageContainer}>
            <Image source={item.image} style={getImageStyle(item.id)} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={styles.catCarousel}
        contentContainerStyle={styles.carouselContent}
        initialScrollIndex={currentIndex}
      />

      {/* Text Carousel */}
      <FlatList
        ref={textCarouselRef}
        data={textSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: 'center', paddingHorizontal: 20 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        style={styles.textCarousel}
        initialScrollIndex={currentIndex}
      />

      {/* Dotted Indicator */}
      {renderIndicators()}

      {/* Buttons */}
      <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      {/* Terms & Privacy Policy */}
      {/* <Text style={styles.termsText}>
        By continuing you agree to Terms of Service and Privacy Policy
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    paddingTop: 50 
  },
  dripImage: { 
    width: '80%', 
    height: 280, 
    resizeMode: 'cover', 
    position: 'absolute', 
    top: -10, 
    left: 10 
  },
  drop1: { 
    width: 30, 
    height: 50, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: 60, 
    left: 40 
  },
  drop2: { 
    width: 55, 
    height: 45, 
    resizeMode: 'contain', 
    position: 'absolute', 
    top: 120, 
    right: 50 
  },
  catCarousel: { 
    maxHeight: 210,
    width: '80%',
    top: 200,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  catImageContainer: {
    width: width - 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  catImage: { 
    width: 200, 
    height: 210, 
    marginBottom: 20,
    resizeMode: 'contain',
  },
  cat3Image: {
    width: 200,  // Different width for cat3
    height: 180, // Different height for cat3
    marginBottom: 20,
    resizeMode: 'contain',
  },
  textCarousel: { 
    marginBottom: 15,
    top: 180,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5,
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center', 
    color: '#555',
  },
  indicatorContainer: {
    top: -70,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#f8c6a7',
    width: 16,
  },
  inactiveDot: {
    backgroundColor: '#ddd',
  },
  getStartedButton: {
    top: -60,
    backgroundColor: '#f8c6a7',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    top: -60,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  loginText: { 
    fontWeight: 'bold', 
    color: '#555' 
  },
  
});