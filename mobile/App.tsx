import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface FileItem { id: string; name: string }

export default function App() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const backendUrl = 'http://localhost:3000';

  const uploadFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.type === 'success') {
      const uri = res.uri;
      const name = res.name;
      const fileData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, data: fileData })
      });
    }
  };

  const searchFiles = async () => {
    const resp = await fetch(`${backendUrl}/files`);
    const json: FileItem[] = await resp.json();
    setFiles(json);
  };

  const downloadFile = async (file: FileItem) => {
    const resp = await fetch(`${backendUrl}/download/${file.id}`);
    const data = await resp.json();
    const path = `${FileSystem.documentDirectory}${file.name}`;
    await FileSystem.writeAsStringAsync(path, data.content, { encoding: FileSystem.EncodingType.Base64 });
    alert('Saved to ' + path);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doc Store</Text>
      <Button title="Upload" onPress={uploadFile} />
      <Button title="Refresh" onPress={searchFiles} />
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => downloadFile(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  header: {
    fontSize: 24,
    marginBottom: 20
  }
});
