
import { useEffect, useState } from 'react';
import { Room, RoomEvent, RemoteParticipant, LocalParticipant } from 'livekit-client';

const LIVEKIT_URL = 'wss://movin10-5usgy6z9.livekit.cloud';

export const useLiveKit = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const connectToRoom = async (token: string, roomName: string) => {
    try {
      const newRoom = new Room();
      
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnected(true);
        setParticipants(Array.from(newRoom.participants.values()));
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsConnected(false);
        setParticipants([]);
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log('Participant connected:', participant.identity);
        setParticipants(Array.from(newRoom.participants.values()));
      });

      newRoom.on(RoomEvent.AudioLevelChanged, (level, participant) => {
        setAudioLevel(level);
        setIsSpeaking(level > 0.1);
      });

      await newRoom.connect(LIVEKIT_URL, token);
      setRoom(newRoom);
      
      // Enable microphone
      await newRoom.localParticipant.enableMicrophone();
      
    } catch (error) {
      console.error('Failed to connect to room:', error);
    }
  };

  const disconnectFromRoom = async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
      setIsSpeaking(false);
      setAudioLevel(0);
    }
  };

  const generateToken = async (roomName: string, participantName: string) => {
    // In a real app, this would be a server-side endpoint
    // For now, return a mock token - you'll need to implement token generation
    console.log('Generating token for room:', roomName, 'participant:', participantName);
    return 'mock-token'; // Replace with actual token generation
  };

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
    room,
    isConnected,
    participants,
    isSpeaking,
    audioLevel,
    connectToRoom,
    disconnectFromRoom,
    generateToken
  };
};
