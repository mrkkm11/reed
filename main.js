import firebase from 'firebase/app'; // Import only what is needed from Firebase
import 'firebase/firestore';
// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZLwsOneYhNgqrV2FSSJldSt1ErYgyTb4",
    authDomain: "capstone-db3cd.firebaseapp.com",
  projectId: "capstone-db3cd",
  storageBucket: "capstone-db3cd.appspot.com",
  messagingSenderId: "capstone-db3cd.appspot.com",
  appId:"1:895927224137:web:4769f8e442dffa0d923c98", 
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase

const sentenceInput = document.getElementById('sentenceInput');
const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const resultDiv = document.getElementById('result');

let recognition;

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
} else {
    alert('Speech recognition is not supported in this browser. Please try a different browser.');
}

recognition.onstart = () => {
    resultDiv.innerHTML = 'Recording started...';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const originalSentence = sentenceInput.value.toLowerCase();

    const transcriptWords = transcript.split(' ');
    const originalWords = originalSentence.split(' ');

    let misreadWordIndex = -1;

    for (let i = 0; i < originalWords.length; i++) {
        if (i >= transcriptWords.length || transcriptWords[i] !== originalWords[i]) {
            misreadWordIndex = i;
            break;
        }
    }

    if (misreadWordIndex !== -1) {
        // Misreading detected
        const misreadWord = originalWords[misreadWordIndex];
        const underlinedSentence = originalSentence.replace(misreadWord, `<u style="color: red;">${misreadWord}</u>`);
        
        sentenceInput.value = '';
        resultDiv.innerHTML = `Error: ${underlinedSentence}`;
        
        alert(`Misreading detected! You misread the word: "${misreadWord}"`);
        // You can replace the alert with your preferred notification method
    } else {
        alert('Successfully read.');

        // Reset input field for another assessment
        sentenceInput.value = '';
        resultDiv.innerHTML = 'Waiting for next input...';
    }
};

startRecordingBtn.addEventListener('click', () => {
    recognition.start();
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
});

stopRecordingBtn.addEventListener('click', () => {
    recognition.stop();
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
});
