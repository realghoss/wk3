import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Image, Modal, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { popularBooks, newestBooks } from './data';

const { width } = Dimensions.get('window'); 

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleBookPress = (id, type) => {
    router.push({ pathname: '/detail', params: { id, type } });
  };

  // --- 動態星數函數 (已修復字串解析問題) ---
  const renderStars = (ratingStr) => {
    if (!ratingStr) return null; // 如果沒有提供星數就不顯示 (例如 popularBooks)
    
    // 使用 parseFloat 可以安全地從 '4.0 / 5.0' 中萃取出 4.0
    const numericRating = parseFloat(ratingStr); 
    const stars = [];
    const filledStars = Math.floor(numericRating); 

    for (let i = 0; i < filledStars; i++) {
      stars.push(<Image key={`filled_${i}`} source={require('../pic/icon_star_filled.png')} style={styles.starIcon} />);
    }
    for (let i = 0; i < (5 - filledStars); i++) {
      stars.push(<Image key={`empty_${i}`} source={require('../pic/icon_star_empty.png')} style={styles.starIcon} />);
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
          <Image source={require('../pic/icon_menu.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../pic/icon_search.png')} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Popular Books</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={popularBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleBookPress(item.id, 'popular')}>
              <Image source={item.image} style={styles.bookImage} />
              {/* 已修正為 title 與 author */}
              <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.authorText}>{item.author}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Newest</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={newestBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleBookPress(item.id, 'newest')}>
              <Image source={item.image} style={styles.bookImage} />
              {renderStars(item.rating)}
              <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.authorText}>{item.author}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('home')}>
          <Image source={activeTab === 'home' ? require('../pic/icon_home_actived.png') : require('../pic/icon_home.png')} style={styles.tabIcon} />
          <Text style={{ color: activeTab === 'home' ? '#5C4B99' : '#A0A0A0', fontSize: 12 }}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('wishlist')}>
          <Image source={activeTab === 'wishlist' ? require('../pic/icon_nav_bookmark_actived.png') : require('../pic/icon_nav_bookmark.png')} style={styles.tabIcon} />
          <Text style={{ color: activeTab === 'wishlist' ? '#5C4B99' : '#A0A0A0', fontSize: 12 }}>Wishlist</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('mybooks')}>
          <Image source={activeTab === 'mybooks' ? require('../pic/icon_mybook_actived.png') : require('../pic/icon_mybook.png')} style={styles.tabIcon} />
          <Text style={{ color: activeTab === 'mybooks' ? '#5C4B99' : '#A0A0A0', fontSize: 12 }}>My books</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isDrawerOpen} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.drawerMenu}>
            <Image source={require('../pic/userface.jpg')} style={styles.avatar} />
            <Text style={styles.drawerName}>May</Text>
            
            <View style={styles.drawerItemRow}>
              <Image source={require('../pic/icon_home.png')} style={styles.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Home</Text>
            </View>
            <View style={styles.drawerItemRow}>
              <Image source={require('../pic/icon_account.png')} style={styles.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Account</Text>
            </View>
            <View style={styles.drawerItemRow}>
              <Image source={require('../pic/icon_settings.png')} style={styles.drawerItemIcon} />
              <Text style={styles.drawerItemText}>Setting</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsDrawerOpen(false)} style={styles.closeArea} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerIcon: { width: 24, height: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginBottom: 16, color: '#333' },
  card: { width: 140, marginRight: 16 },
  bookImage: { width: 140, height: 200, borderRadius: 8, marginBottom: 8 },
  titleText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  authorText: { fontSize: 12, color: '#888', marginTop: 2 },
  starContainer: { flexDirection: 'row', marginBottom: 4 },
  starIcon: { width: 14, height: 14, marginRight: 2 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  tabItem: { alignItems: 'center' },
  tabIcon: { width: 24, height: 24, marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  closeArea: { flex: 1 }, 
  drawerMenu: { width: width * 0.7, backgroundColor: '#FFF', padding: 30, paddingTop: 60, height: '100%' }, 
  avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: 16 },
  drawerName: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
  drawerItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  drawerItemIcon: { width: 24, height: 24, marginRight: 16 },
  drawerItemText: { fontSize: 18, color: '#333' },
});