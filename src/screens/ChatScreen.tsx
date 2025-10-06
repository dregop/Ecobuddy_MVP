// src/screens/ChatScreen.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { getApiUrl } from '../utils/getApiUrl'

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: { role: 'user' | 'bot', text: string } = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${getApiUrl()}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      })

      const data = await response.json()
      const botMessage: { role: 'user' | 'bot', text: string } = { role: 'bot', text: data.answer || 'Erreur dans la réponse du serveur.' }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Erreur réseau', error)
      setMessages(prev => [...prev, { role: 'bot', text: "Erreur lors de l'envoi de la question." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.message, msg.role === 'user' ? styles.userMsg : styles.botMsg]}>
            <Text style={styles.msgText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Pose ta question..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  chatArea: { flex: 1, padding: 16 },
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    maxWidth: '85%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  msgText: { color: '#000' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    padding: 10,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 12,
  },
})
