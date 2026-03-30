import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { popularBooks, newestBooks } from './data';

export default function DetailScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams(); 
  
  const bookList = type === 'popular' ? popularBooks : newestBooks;
  const book = bookList.find(b => b.id === id) || popularBooks[0]; 

  const [isBookmarked, setIsBookmarked] = useState(false);

 
  const renderStars = (ratingStr) => {
    const displayString = ratingStr || '4.0 / 5.0';
    const numericRating = parseFloat(displayString);
    const stars = [];
    const filledStars = Math.floor(numericRating); 

    for (let i = 0; i < filledStars; i++) {
      stars.push(<Image key={`filled_${i}`} source={require('../pic/icon_star_filled.png')} style={styles.starIconDetail} />);
    }
    for (let i = 0; i < (5 - filledStars); i++) {
      stars.push(<Image key={`empty_${i}`} source={require('../pic/icon_star_empty.png')} style={styles.starIconDetail} />);
    }

    return (
      <View style={styles.ratingRow}>
        {stars}
        <Text style={styles.ratingText}>{displayString}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../pic/icon_back.png')} style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)}>
          <Image 
            source={isBookmarked ? require('../pic/icon_bookmark_actived.png') : require('../pic/icon_bookmark.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={book.image} style={styles.bookImage} resizeMode="contain" />
        
        {/* 已修正為 title 與 author */}
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        
        {/* 渲染星星與評分 */}
        {renderStars(book.rating)}
        
        <Text style={styles.description}>
          A spectacular visual journey through 40 years of haute couture from one of the best-known and most trend-setting brands in fashion.
        </Text>

        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>BUY NOW FOR $46.99</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  icon: { width: 24, height: 24 },
  content: { alignItems: 'center', paddingHorizontal: 30, paddingBottom: 40 },
  bookImage: { width: 200, height: 300, borderRadius: 10, marginVertical: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  author: { fontSize: 16, color: '#888', marginTop: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  starIconDetail: { width: 16, height: 16, marginRight: 2 },
  ratingText: { fontSize: 14, color: '#333', marginLeft: 8, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 20, lineHeight: 22 },
  buyButton: { backgroundColor: '#5C4B99', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, marginTop: 40, width: '100%', alignItems: 'center' },
  buyButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});