// import React, { useEffect, useRef, useState } from 'react';
// import { Modal, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import Slider from '@react-native-community/slider';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// interface AudioPlayerModalProps {
//   visible: boolean;
//   onClose: () => void;
//   title?: string;
//   audioUrl: string | null;
//   styles: any; // You can replace `any` with a proper StyleSheet type if needed
// }

// const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
//   visible,
//   onClose,
//   title = 'Audio Player',
//   audioUrl,
//   styles,
// }) => {

//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);

//   const onTogglePlayPause = async () => {
//     if (!audioUrl) {
//       Alert.alert('No Audio', 'There is no audio available to play.');
//       return;
//     }

//     if (!isPlaying) {
//       try {
//         setIsLoading(true);
//         await audioRecorderPlayer.startPlayer(audioUrl);
//         setIsPlaying(true);
//         setIsLoading(false);
//         audioRecorderPlayer.addPlayBackListener((e) => {
//           setPosition(e.currentPosition);
//           setDuration(e.duration);
//           console.log(formatTime(e.currentPosition));
          
//           if (e.currentPosition >= e.duration) {
//             audioRecorderPlayer.stopPlayer();
//             audioRecorderPlayer.removePlayBackListener();
//             setIsPlaying(false);
//             setPosition(0);
//           }
//           return;
//         });
//       } catch (error) {
//         console.error('Playback failed', error);
//         setIsLoading(false);
//         Alert.alert('Playback Error', 'Failed to play audio.');
//       }
//     } else {
//       await audioRecorderPlayer.pausePlayer();
//       setIsPlaying(false);
//     }
//   };

//   const onSeek = async (value: number) => {
//     await audioRecorderPlayer.seekToPlayer(value);
//     setPosition(value);
//   };
//   const formatTime = (millis: number): string => {
//     const minutes = Math.floor(millis / 60000);
//     const seconds = Math.floor((millis % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const handlePlayPause = async () => {
//     if (!isPlaying) {
//       try {
//         setIsPlaying(true);
//         setIsLoading(false);
//         await audioRecorderPlayer.startPlayer();
//       } catch (error) {
//         console.error('Playback failed', error);
//         setIsLoading(false);
//         Alert.alert('Playback Error', 'Failed to play audio.');
//       }
//     } else {
//       await audioRecorderPlayer.pausePlayer();
//       setIsPlaying(false);
//     }
//   }


//   useEffect(() => {
//     if (audioUrl) {
//       onTogglePlayPause();
//     }
//     if (!visible) {
//       audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//       setIsPlaying(false);
//       setPosition(0);
//     }

//     return () => {
//       audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//     };
//   }, [visible]);



//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlayCenter}>
//         <View style={styles.centeredModal}>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>

//           <Text style={styles.title}>{title}</Text>
//           {isLoading ? (
//             <ActivityIndicator size="large" color="#000000" />
//           ) : (
//             <>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={position}
//                 onSlidingComplete={onSeek}
//                 minimumTrackTintColor="#F49D16"
//                 maximumTrackTintColor="#000000"
//                 thumbTintColor="#F49D16"
//               />

//               <Text style={styles.timer}>
//                 {formatTime(position)} / {formatTime(duration)}
//               </Text>

//               <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>

//                 <Text style={styles.btnText}>{isPlaying ? 'Pause' : 'Play'}</Text>

//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AudioPlayerModal;










// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Slider from '@react-native-community/slider';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// interface AudioPlayerModalProps {
//   visible: boolean;
//   onClose: () => void;
//   title?: string;
//   audioUrl: string | null;
//   styles: any;
// }

// const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
//   visible,
//   onClose,
//   title = 'Audio Player',
//   audioUrl,
//   styles,
// }) => {
//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);

//   const formatTime = (millis: number): string => {
//     const minutes = Math.floor(millis / 60000);
//     const seconds = Math.floor((millis % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const resetPlayerState = () => {
//     setIsPlaying(false);
//     setIsPaused(false);
//     setPosition(0);
//   };

//   const playAudio = async () => {
//     if (!audioUrl) {
//       Alert.alert('No Audio', 'There is no audio available to play.');
//       return;
//     }
  
//     try {
//       setIsLoading(true);
  
//       // Clean up any previous playback
//       await audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
  
//       await audioRecorderPlayer.startPlayer(audioUrl);
  
//       audioRecorderPlayer.addPlayBackListener((e) => {
//         if (e.duration > 0) setDuration(e.duration);
//         setPosition(e.currentPosition);
  
//         // 🛑 Playback has ended
//         if (e.currentPosition >= e.duration) {
//           setTimeout(async () => {
//             try {
//               await audioRecorderPlayer.stopPlayer();
//               audioRecorderPlayer.removePlayBackListener();
//             } catch (err) {
//               console.warn('Already stopped or error:', err);
//             }
//             resetPlayerState(); // Reset UI
//           }, 100); // Small delay to ensure cleanup
//         }
  
//         return;
//       });
  
//       setIsPlaying(true);
//       setIsPaused(false);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Playback failed', error);
//       setIsLoading(false);
//       Alert.alert('Playback Error', 'Failed to play audio.');
//     }
//   };
  

//   const pauseAudio = async () => {
//     try {
//       await audioRecorderPlayer.pausePlayer();
//       setIsPlaying(false);
//       setIsPaused(true);
//     } catch (error) {
//       console.error('Pause failed', error);
//     }
//   };

//   const resumeAudio = async () => {
//     try {
//       await audioRecorderPlayer.resumePlayer();
//       setIsPlaying(true);
//       setIsPaused(false);
//     } catch (error) {
//       console.error('Resume failed', error);
//       Alert.alert('Playback Error', 'Failed to resume audio.');
//     }
//   };

//   const stopAudio = async () => {
//     try {
//       await audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//     } catch (e) {
//       console.error('Stop failed:', e);
//     }
//     resetPlayerState();
//   };

//   const handlePlayPause = async () => {
//     if (isPlaying) {
//       await pauseAudio();
//     } else {
//       if (isPaused) {
//         await resumeAudio();
//       } else {
//         await playAudio();
//       }
//     }
//   };

//   const onSeek = async (value: number) => {
//     try {
//       await audioRecorderPlayer.seekToPlayer(value);
//       setPosition(value);
//     } catch (e) {
//       console.error('Seek failed', e);
//     }
//   };

//   useEffect(() => {
//     if (visible && audioUrl) {
//       playAudio();
//     }

//     if (!visible) {
//       stopAudio();
//     }

//     return () => {
//       stopAudio();
//     };
//   }, [visible]);

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlayCenter}>
//         <View style={styles.centeredModal}>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>

//           <Text style={styles.title}>{title}</Text>

//           {isLoading ? (
//             <ActivityIndicator size="large" color="#000000" />
//           ) : (
//             <>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={position}
//                 onSlidingComplete={onSeek}
//                 minimumTrackTintColor="#F49D16"
//                 maximumTrackTintColor="#000000"
//                 thumbTintColor="#F49D16"
//               />
//               <Text style={styles.timer}>
//                 {formatTime(position)} / {formatTime(duration)}
//               </Text>

//               <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
//                 <Text style={styles.btnText}>
//                   {isPlaying ? 'Pause' : 'Play'}
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AudioPlayerModal;




// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Slider from '@react-native-community/slider';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// interface AudioPlayerModalProps {
//   visible: boolean;
//   onClose: () => void;
//   title?: string;
//   audioUrl: string | null;
//   styles: any;
// }

// const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
//   visible,
//   onClose,
//   title = 'Audio Player',
//   audioUrl,
//   styles,
// }) => {
//   const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

//   const [isPlaying, setIsPlaying] = useState(false);
//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const formatTime = (millis: number): string => {
//     const minutes = Math.floor(millis / 60000);
//     const seconds = Math.floor((millis % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const stopAudio = async () => {
//     try {
//       await audioRecorderPlayer.stopPlayer();
//     } catch (_) {}
//     audioRecorderPlayer.removePlayBackListener();
//     setIsPlaying(false);
//     setPosition(0);
//     setDuration(0);
//   };

//   const playAudio = async () => {
//     if (!audioUrl) {
//       Alert.alert('No Audio', 'There is no audio available to play.');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await stopAudio();

//       await audioRecorderPlayer.startPlayer(audioUrl);

//       audioRecorderPlayer.addPlayBackListener((e) => {
//         console.log('Playback update:', e.currentPosition, '/', e.duration);
//         setPosition(e.currentPosition);
//         setDuration(e.duration);
      
//         // ✅ FIXED: use tolerance to detect playback end
//         if (e.duration > 0 && e.currentPosition >= e.duration - 500) {
//           console.log('==> Audio END detected');
//           audioRecorderPlayer.stopPlayer().then(() => {
//             audioRecorderPlayer.removePlayBackListener();
//             setIsPlaying(false);
//             setPosition(0);
//             setDuration(0);
//             setTimeout(() => {
//               onClose(); // ✅ Finally works
//             }, 100);
//           });
//         }
      
//         return;
//       });

//       setIsPlaying(true);
//     } catch (error) {
//       console.error('Playback failed', error);
//       Alert.alert('Playback Error', 'Failed to play audio.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const pauseAudio = async () => {
//     try {
//       await audioRecorderPlayer.pausePlayer();
//       setIsPlaying(false);
//     } catch (err) {
//       console.error('Pause error', err);
//     }
//   };

//   const resumeAudio = async () => {
//     try {
//       await audioRecorderPlayer.resumePlayer();
//       setIsPlaying(true);
//     } catch (err) {
//       console.error('Resume error', err);
//       Alert.alert('Playback Error', 'Failed to resume audio.');
//     }
//   };

//   const onSeek = async (value: number) => {
//     if (!isPlaying) {
//       Alert.alert('Seek Error', 'Audio must be playing to seek.');
//       return;
//     }

//     try {
//       await audioRecorderPlayer.seekToPlayer(value);
//       setPosition(value);
//     } catch (e) {
//       console.log('Seek error:', e);
//       Alert.alert('Seek Error', 'Could not seek, try playing again.');
//     }
//   };

//   const handlePlayPause = async () => {
//     if (isPlaying) {
//       await pauseAudio();
//     } else {
//       await resumeAudio();
//     }
//   };

//   useEffect(() => {
//     if (visible && audioUrl) {
//       playAudio();
//     } else {
//       stopAudio();
//     }

//     return () => {
//       stopAudio();
//     };
//   }, [visible]);

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlayCenter}>
//         <View style={styles.centeredModal}>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>✕</Text>
//           </TouchableOpacity>

//           <Text style={styles.title}>{title}</Text>

//           {isLoading ? (
//             <ActivityIndicator size="large" color="#000" />
//           ) : (
//             <>
//               <Slider
//                 style={styles.slider}
//                 minimumValue={0}
//                 maximumValue={duration}
//                 value={position}
//                 onSlidingComplete={onSeek}
//                 minimumTrackTintColor="#F49D16"
//                 maximumTrackTintColor="#000000"
//                 thumbTintColor="#F49D16"
//               />
//               <Text style={styles.timer}>
//                 {formatTime(position)} / {formatTime(duration)}
//               </Text>

//               <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
//                 <Text style={styles.btnText}>
//                   {isPlaying ? 'Pause' : 'Play'}
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default AudioPlayerModal;






import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  audioUrl: string | null;
  styles: any;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  title = 'Audio Player',
  audioUrl,
  styles,
}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEnded, setHasEnded] = useState(false); // ✅ new state

  const formatTime = (millis: number): string => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const stopAudio = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
    } catch (_) {}
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  };

  const playAudio = async () => {
    if (!audioUrl) {
      Alert.alert('No Audio', 'There is no audio available to play.');
      return;
    }

    try {
      setIsLoading(true);
      await stopAudio();
      setHasEnded(false); // reset replay state

      await audioRecorderPlayer.startPlayer(audioUrl);

      audioRecorderPlayer.addPlayBackListener((e) => {
        console.log('Playback update:', e.currentPosition, '/', e.duration);
        setPosition(e.currentPosition);
        setDuration(e.duration);

        // ✅ Detect when playback ends
        if (e.duration > 0 && e.currentPosition >= e.duration - 500) {
          console.log('==> Audio END detected');
          audioRecorderPlayer.stopPlayer().then(() => {
            audioRecorderPlayer.removePlayBackListener();
            setIsPlaying(false);
            setPosition(0);
            setHasEnded(true); // show Replay
          });
        }

        return;
      });

      setIsPlaying(true);
    } catch (error) {
      console.error('Playback failed', error);
      Alert.alert('Playback Error', 'Failed to play audio.');
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } catch (err) {
      console.error('Pause error', err);
    }
  };

  const resumeAudio = async () => {
    try {
      await audioRecorderPlayer.resumePlayer();
      setIsPlaying(true);
    } catch (err) {
      console.error('Resume error', err);
      Alert.alert('Playback Error', 'Failed to resume audio.');
    }
  };

  const onSeek = async (value: number) => {
    try {
      if (!isPlaying) {
        // Workaround: resume → seek → pause
        await audioRecorderPlayer.resumePlayer();
        await audioRecorderPlayer.seekToPlayer(value);
        await audioRecorderPlayer.pausePlayer();
        setIsPlaying(false);
      } else {
        await audioRecorderPlayer.seekToPlayer(value);
      }
      setPosition(value);
    } catch (e) {
      console.log('Seek error:', e);
      Alert.alert('Seek Error', 'Could not seek. Try playing again.');
    }
  };
  

  const handlePlayPause = async () => {
    if (hasEnded) {
      await playAudio(); // replay from beginning
    } else if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
  };

  useEffect(() => {
    if (visible && audioUrl) {
      playAudio();
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlayCenter}>
        <View style={styles.centeredModal}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{title}</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={onSeek}
                minimumTrackTintColor="#F49D16"
                maximumTrackTintColor="#000000"
                thumbTintColor="#F49D16"
              />
              <Text style={styles.timer}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>

              <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn}>
                <Text style={styles.btnText}>
                  {hasEnded ? 'Replay Audio' : isPlaying ? 'Pause' : 'Play'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;
