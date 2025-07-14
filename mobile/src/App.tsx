import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import FileList from './components/FileList';
import { uploadFile, listFiles, downloadFile, saveFile, FileItem } from './services/api';

export default function App() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.type === 'success') {
      const fileData = await FileSystem.readAsStringAsync(res.uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      await uploadFile(res.name, fileData);
    }
  };

  const refreshFiles = async () => {
    const list = await listFiles();
    setFiles(list);
  };

  const handleDownload = async (file: FileItem) => {
    const { content } = await downloadFile(file.id);
    const path = await saveFile(file.name, content);
    alert('Saved to ' + path);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doc Store</Text>
      <Button title="Upload" onPress={handleUpload} />
      <Button title="Refresh" onPress={refreshFiles} />
      <FileList files={files} onSelect={handleDownload} />
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
