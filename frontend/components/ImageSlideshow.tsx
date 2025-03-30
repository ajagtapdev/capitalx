import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface ImageSlideshowProps {
  images: string[];
  height?: number;
  autoPlay?: boolean;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  images,
  height = 300,
  autoPlay = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      timerRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % images.length;
        setActiveIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeIndex, images.length, autoPlay, width]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={[styles.image, { width }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#0A84FF' : '#8E8E93' },
              ]}
            />
          ))}
        </View>
      )}

      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.arrow, styles.leftArrow]}
            onPress={() => {
              const prevIndex = (activeIndex - 1 + images.length) % images.length;
              handleDotPress(prevIndex);
            }}
          >
            <AntDesign name="left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrow, styles.rightArrow]}
            onPress={() => {
              const nextIndex = (activeIndex + 1) % images.length;
              handleDotPress(nextIndex);
            }}
          >
            <AntDesign name="right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 16,
  },
  rightArrow: {
    right: 16,
  },
});

export default ImageSlideshow; 