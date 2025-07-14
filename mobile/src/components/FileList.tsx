import React from 'react';
import { FlatList, Button } from 'react-native';
import { FileItem } from '../services/api';

interface Props {
  files: FileItem[];
  onSelect: (file: FileItem) => void;
}

export default function FileList({ files, onSelect }: Props) {
  return (
    <FlatList
      data={files}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Button title={item.name} onPress={() => onSelect(item)} />
      )}
    />
  );
}
