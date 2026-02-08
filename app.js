import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('books.db');

export default function App() {
  const [books, setBooks] = useState([]);
  const [nazev, setNazev] = useState('');
  const [autor, setAutor] = useState('');
  const [rok, setRok] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS books(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nazev TEXT,
          autor TEXT,
          rok INTEGER
        )`
      );
    });
    loadBooks();
  }, []);

  function loadBooks() {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM books ORDER BY nazev",
        [],
        (_, { rows }) => setBooks(rows._array)
      );
    });
  }

  function addBook() {
    if (!nazev || !autor || !rok) return;

    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO books (nazev, autor, rok) VALUES (?, ?, ?)",
        [nazev, autor, Number(rok)],
        loadBooks
      );
    });

    setNazev('');
    setAutor('');
    setRok('');
  }

  function confirmDelete(id) {
    Alert.alert(
      "Smazat knihu?",
      "Opravdu ji chceš odstranit?",
      [
        { text: "Zrušit", style: "cancel" },
        { text: "Smazat", style: "destructive", onPress: () => deleteBook(id) }
      ]
    );
  }

  function deleteBook(id) {
    db.transaction(tx => {
      tx.executeSql("DELETE FROM books WHERE id = ?", [id], loadBooks);
    });
  }

  return (
    <View style={styles.app}>
      <Text style={styles.title}>📚 Moje knihy</Text>

      <TextInput style={styles.input} placeholder="Název" value={nazev} onChangeText={setNazev}/>
      <TextInput style={styles.input} placeholder="Autor" value={autor} onChangeText={setAutor}/>
      <TextInput style={styles.input} placeholder="Rok" keyboardType="numeric" value={rok} onChangeText={setRok}/>

      <Button title="Přidat knihu" onPress={addBook} />

      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.book}>
            <Text style={styles.name}>{item.nazev}</Text>
            <Text>Autor: {item.autor}</Text>
            <Text>Rok: {item.rok}</Text>
            <Button title="Smazat" color="#e53935" onPress={() => confirmDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  app: { padding: 20, marginTop: 40 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 6 },
  book: { backgroundColor: '#f2f2f2', padding: 12, marginVertical: 6 },
  name: { fontSize: 18, fontWeight: 'bold' }
});
